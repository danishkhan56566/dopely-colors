import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const VoiceColorGuide = () => {
    return (
        <DocumentationHub
            title="Voice to Color Generator"
            description="Speak your mood, context, or project brief into the microphone and watch our NLP artificial intelligence generate the perfect palette."
            benefits={[
                "The fastest way to brainstorm without touching a keyboard",
                "Translates vague emotional words into concrete hex codes",
                "Great for rapid ideation in client meetings",
                "Visually impressive generative workflow"
            ]}
            howToSteps={[
                { title: "Allow Mic", desc: "Grant microphone permissions to the browser." },
                { title: "Describe Vision", desc: 'Say something like "I want a dark cyberpunk aesthetic feeling nervous but energetic."' },
                { title: "Witness Magic", desc: "The AI will parse your intent and produce 5 exact colors mapping to those emotions." }
            ]}
            faqs={[
                { question: "Is the audio recorded?", answer: "Audio is processed purely for transcription. The resulting text is what is sent to the color engine. We do not store voice data." }
            ]}
        />
    );
};
