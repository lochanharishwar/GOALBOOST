import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, fitnessLevel, goals, availableEquipment, targetMuscles } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are a professional fitness coach and exercise expert. Based on the user's preferences, fitness level, goals, available equipment, and target muscle groups, recommend 5 personalized exercises.

For each exercise recommendation, provide:
1. Exercise name
2. Category (one of: upper-body, lower-body, core, cardio, full-body, flexibility)
3. Why this exercise is perfect for them (2-3 sentences)
4. Recommended sets and reps based on their fitness level
5. Key tips for proper form

Keep your recommendations practical, safe, and aligned with their goals. Consider their available equipment when making suggestions.`;

    const userPrompt = `Please recommend exercises based on the following:

Fitness Level: ${fitnessLevel || 'Not specified'}
Goals: ${goals || 'General fitness'}
Available Equipment: ${availableEquipment?.length > 0 ? availableEquipment.join(', ') : 'None/Bodyweight only'}
Target Muscle Groups: ${targetMuscles?.length > 0 ? targetMuscles.join(', ') : 'Full body'}
Additional Preferences: ${preferences || 'None specified'}

Please provide 5 personalized exercise recommendations that would be most beneficial.`;

    console.log('Generating exercise recommendations for:', { fitnessLevel, goals, availableEquipment, targetMuscles });

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
    const recommendations = data.choices?.[0]?.message?.content;

    console.log('Successfully generated recommendations');

    return new Response(
      JSON.stringify({ recommendations }),
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
