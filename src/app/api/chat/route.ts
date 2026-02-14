import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { generateCorePalette } from '@/lib/color-engine';

// Initialize Services
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SYSTEM_INSTRUCTION = `
You are "PaletteAI," an expert UI/UX Design Assistant.
Your goal is to help users create color palettes and answer design questions.

CONTEXT AWARENESS:
Always review the 'history' provided to understand previous requests.

STRICT OUTPUT FORMAT:
You MUST return a single valid JSON object. Do not include markdown formatting.

JSON SCHEMA:
{
  "type": "action" | "chat" | "refusal",
  "message": "Reasoning for the colors OR the answer to the question.",
  "parameters": {
    "primary_hex": "#HEXCODE",
    "secondary_hex": "#HEXCODE" (optional),
    "tertiary_hex": "#HEXCODE" (optional),
    "mood": "string" (optional)
  }
}

RULES:
1. ACTION MODE: If user wants colors (e.g. "blue finance app", "make it darker"):
   - "type": "action"
   - "message": Explain WHY you chose these colors.
   - "parameters": Set primary_hex based on color theory.

2. CHAT MODE: If user asks about design (e.g. "What is contrast?"):
   - "type": "chat"
   - "message": Answer helpfully.
   - "parameters": {}

3. REFUSAL MODE: If user asks about non-design topics:
   - "type": "refusal"
   - "message": "I specialize only in UI/UX Design and Color Systems."
   - "parameters": {}
`;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, user_id = 'guest', current_state } = body;

        // 1. Fallback if no Key
        if (!process.env.GOOGLE_API_KEY) {
            console.warn("No GOOGLE_API_KEY found. Using regex fallback.");
            const msgLower = message.toLowerCase();

            if (msgLower.includes('palette') || msgLower.includes('color') || msgLower.includes('design')) {
                return NextResponse.json({
                    type: "action",
                    message: "Generating palette (Dev Mock - No Gemini Key)...",
                    data: generateCorePalette("#6200ea")
                });
            }
            return NextResponse.json({
                type: "chat",
                message: "This is a Dev Mode answer (No Gemini Key). I specialize in UI/UX.",
                data: current_state
            });
        }

        // 2. Fetch History from Supabase
        let historyForGemini: { role: string; parts: { text: any; }[]; }[] = [];
        try {
            // Save User Message
            await supabase.from('chat_messages').insert({
                user_id,
                role: 'user',
                content: message
            });

            // Get last 10 megs
            const { data: histData } = await supabase
                .from('chat_messages')
                .select('role, content')
                .eq('user_id', user_id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (histData) {
                // Reverse to chronological order
                historyForGemini = histData.reverse().map(record => ({
                    role: record.role === 'user' ? 'user' : 'model',
                    parts: [{ text: record.content }]
                }));
            }
        } catch (e) {
            console.error("Supabase History Error:", e);
        }

        // 3. Call Gemini
        let aiMessageText = "";
        let intentType = "chat";
        let aiData: any = {};

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: SYSTEM_INSTRUCTION,
                generationConfig: { responseMimeType: "application/json" }
            });

            const chat = model.startChat({ history: historyForGemini });
            const result = await chat.sendMessage(message);
            const responseText = result.response.text();
            aiData = JSON.parse(responseText);

            aiMessageText = aiData.message || "Processed request.";
            intentType = aiData.type || "chat";

        } catch (apiError) {
            console.error("Gemini API Error:", apiError);
            console.warn("Falling back to regex logic.");

            // Fallback Logic
            const msgLower = message.toLowerCase();
            if (msgLower.includes('palette') || msgLower.includes('color') || msgLower.includes('design')) {
                return NextResponse.json({
                    type: "action",
                    message: "Generating palette (Fallback - API Error)...",
                    data: generateCorePalette("#6200ea")
                });
            }
            return NextResponse.json({
                type: "chat",
                message: "I'm having trouble connecting to my brain right now, but I can still help you design! (Fallback Mode)",
                data: current_state
            });
        }

        // 4. Save AI Response (only if successful API call)
        if (intentType) {
            try {
                await supabase.from('chat_messages').insert({
                    user_id,
                    role: 'model',
                    content: aiMessageText
                });
            } catch (e) { console.error("Supabase Save Error:", e); }
        }

        // 5. Handle Action Intent
        if (intentType === 'action') {
            const params = aiData.parameters || {};
            const seedHex = params.primary_hex || '#3B82F6';

            // Generate System
            const paletteSystem = generateCorePalette(seedHex);

            return NextResponse.json({
                type: "action",
                message: aiMessageText,
                data: paletteSystem
            });
        }

        // 6. Return Chat Response
        return NextResponse.json({
            type: intentType,
            message: aiMessageText,
            data: current_state
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
