import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, exerciseId, exerciseName, exerciseSteps } = await req.json();
    
    if (!imageData || !exerciseId || !exerciseName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Use Gemini for vision analysis
    const systemPrompt = `You are an expert fitness coach AI that analyzes exercise form from images.
Your task is to analyze the person's form in the image and provide feedback.

For the exercise "${exerciseName}", the proper steps are:
${exerciseSteps?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n')}

Analyze the image and respond with a JSON object containing:
{
  "repCompleted": boolean, // true if you detect a completed repetition (transition from starting position through the movement and back)
  "formQuality": "good" | "warning" | "bad", // overall form assessment
  "feedback": [
    { "type": "correct" | "warning" | "error", "message": "specific feedback about form" }
  ]
}

Focus on:
- Body positioning and alignment
- Range of motion
- Common mistakes for this specific exercise
- Safety concerns

Be encouraging but accurate. Keep feedback concise and actionable.
If you cannot see the person clearly or they are not performing the exercise, indicate that.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              {
                type: "text",
                text: `Analyze this frame from a video of someone performing "${exerciseName}". Provide form feedback and determine if a rep was completed.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response from the AI
    let analysisResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        // Default response if parsing fails
        analysisResult = {
          repCompleted: false,
          formQuality: "warning",
          feedback: [{ type: "warning", message: "Unable to fully analyze. Please ensure you're visible in frame." }]
        };
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      analysisResult = {
        repCompleted: false,
        formQuality: "warning",
        feedback: [{ type: "warning", message: "Analysis in progress. Continue your exercise." }]
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-exercise:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        repCompleted: false,
        formQuality: null,
        feedback: []
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
