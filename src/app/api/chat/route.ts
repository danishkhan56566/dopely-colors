import { NextResponse } from 'next/server';
import { parseUserIntent, evolveDesignSystem, DesignState } from '@/lib/ai-assistant';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, current_design } = body;

        if (!current_design) {
            return NextResponse.json({
                type: 'chat',
                message: "I'm ready to help. Please start a design first."
            });
        }

        // 1. Analyze Intent using the shared logic
        const intent = parseUserIntent(message);

        console.log("API /chat intent:", intent);

        // 2. Handle specific non-visual intents
        if (intent.type === 'UNKNOWN') {
            // If we can't parse a clear design instruction, fallback to chat
            // In a real agent, this would use an LLM to chat. 
            // Here, we provide helpful guidance.
            return NextResponse.json({
                type: 'chat',
                message: "I can verify contrast, switch to dark mode, or adjust brightness. Try saying 'Make it punchy' or 'Dark mode'."
            });
        }

        if (intent.type === 'FEEDBACK') {
            return NextResponse.json({
                type: 'chat',
                message: "I'm listening. You can ask for specific colors like 'indigo' or styles like 'modern'."
            });
        }

        if (intent.type === 'EXPORT') {
            return NextResponse.json({
                type: 'export-ui',
                data: current_design, // Pass the design state back so UI can render it
                message: "Here are your Design Tokens and Export options. You can download for Web, iOS, and Android."
            });
        }

        if (intent.type === 'RESET') {
            // Evolution doesn't strictly handle reset (that's usually a clear state wipe)
            // But let's see if we can just trigger a chat response, 
            // as the client might have its own reset handler?
            // Actually client has 'RESET' intent check? No, client side check is just for FEEDBACK.
            // If user says "Reset", we might want to tell client to reset.
            // But for now, let's just return a message.
            return NextResponse.json({
                type: 'chat',
                message: "To start over, you can refresh the page or ask for a specific new style."
            });
        }

        // 3. Evolve the Design
        // We cast the current_design to DesignState. 
        // Note: we trust the client passed a valid shape.
        const newDesign = evolveDesignSystem(current_design as DesignState, intent);

        // 4. Return the new System
        return NextResponse.json({
            type: 'action',
            data: newDesign.system,
            message: newDesign.explanation || "I've updated the design based on your feedback."
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({
            type: 'chat',
            message: "I encountered a neural link error. Please try a different command."
        }, { status: 500 });
    }
}
