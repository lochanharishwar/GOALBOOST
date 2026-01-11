import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation helpers
const ALLOWED_FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced'];
const MAX_STRING_LENGTH = 200;
const MAX_ARRAY_LENGTH = 20;
const MAX_ARRAY_ITEM_LENGTH = 50;

function sanitizeString(input: unknown, maxLength: number = MAX_STRING_LENGTH): string | null {
  if (input === null || input === undefined) return null;
  if (typeof input !== 'string') return null;
  // Trim, limit length, and remove potentially dangerous characters for prompt injection
  return input.trim().slice(0, maxLength).replace(/[<>{}[\]\\]/g, '');
}

function validateStringArray(input: unknown, maxItems: number = MAX_ARRAY_LENGTH, maxItemLength: number = MAX_ARRAY_ITEM_LENGTH): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === 'string')
    .slice(0, maxItems)
    .map(item => item.trim().slice(0, maxItemLength).replace(/[<>{}[\]\\]/g, ''))
    .filter(item => item.length > 0);
}

function validateFitnessLevel(input: unknown): string {
  if (typeof input !== 'string') return 'beginner';
  const normalized = input.toLowerCase().trim();
  return ALLOWED_FITNESS_LEVELS.includes(normalized) ? normalized : 'beginner';
}

// Simple JWT validation - decode and verify with Supabase
async function validateJWT(token: string, supabaseUrl: string, supabaseAnonKey: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    // Call Supabase auth API to verify the token
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey,
      },
    });
    
    if (!response.ok) {
      return { valid: false };
    }
    
    const user = await response.json();
    return { valid: true, userId: user.id };
  } catch {
    return { valid: false };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optional authentication - allow both authenticated and anonymous access
    const authHeader = req.headers.get('Authorization');
    let userId = 'anonymous';
    
    if (authHeader?.startsWith('Bearer ')) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const token = authHeader.replace('Bearer ', '');
      
      const { valid, userId: validatedUserId } = await validateJWT(token, supabaseUrl, supabaseAnonKey);
      if (valid && validatedUserId) {
        userId = validatedUserId;
      }
    }

    console.log('Request from user:', userId);

    // Parse and validate input
    let rawBody;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and sanitize all inputs
    const fitnessLevel = validateFitnessLevel(rawBody.fitnessLevel);
    const goals = sanitizeString(rawBody.goals, MAX_STRING_LENGTH) || 'General fitness';
    const preferences = sanitizeString(rawBody.preferences, 500) || 'None';
    const availableEquipment = validateStringArray(rawBody.availableEquipment);
    const targetMuscles = validateStringArray(rawBody.targetMuscles, 10);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a fitness coach. Return ONLY valid JSON with no markdown formatting. Based on user preferences, provide exercise recommendations in this exact structure:

{
  "summary": "One sentence overview of the plan",
  "exercises": [
    {
      "name": "Exercise Name",
      "category": "upper-body|lower-body|core|cardio|full-body|flexibility",
      "sets": 3,
      "reps": "10-12",
      "benefit": "One short benefit sentence",
      "matchId": "exercise-id-from-library-if-exists"
    }
  ],
  "focusAreas": [
    { "area": "Strength", "percentage": 40 },
    { "area": "Cardio", "percentage": 30 },
    { "area": "Flexibility", "percentage": 30 }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Exercise library IDs to match: push-ups, pull-ups, bench-press, dumbbell-rows, overhead-press, dips, bicep-curls, tricep-extensions, lat-pulldowns, squats, lunges, deadlifts, leg-press, calf-raises, plank, crunches, leg-raises, russian-twists, mountain-climbers, burpees, jumping-jacks, high-knees, box-jumps, stretching, yoga-poses.

Return 4-5 exercises. Use matchId only if exercise matches one from library.`;

    const userPrompt = `Create a workout plan:
Level: ${fitnessLevel}
Goals: ${goals}
Equipment: ${availableEquipment.length > 0 ? availableEquipment.join(', ') : 'None'}
Target: ${targetMuscles.length > 0 ? targetMuscles.join(', ') : 'Full body'}
Notes: ${preferences}`;

    console.log('Generating exercise recommendations for user:', userId, { fitnessLevel, goals });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';
    
    // Clean markdown formatting if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let parsedPlan;
    try {
      parsedPlan = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse recommendations');
    }

    console.log('Successfully generated structured recommendations for user:', userId);

    return new Response(
      JSON.stringify({ plan: parsedPlan }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in exercise-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
