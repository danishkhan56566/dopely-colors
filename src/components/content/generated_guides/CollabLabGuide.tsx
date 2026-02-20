import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const CollabLabGuide = () => {
    return (
        <DocumentationHub
            title="Real-time Color Lab"
            description="Multiplayer color palette editing and design system building. Work synchronously with your entire design team."
            benefits={[
                "Eliminate version control issues with real-time syncing",
                "Instant feedback loops with integrated cursor tracking",
                "Conflict-free semantic token management",
                "Streamline client reviews and handoffs"
            ]}
            howToSteps={[
                { title: "Create Room", desc: "Start a new session and generate a secure invite link." },
                { title: "Invite Team", desc: "Share the link with designers, developers, and stakeholders." },
                { title: "Design Together", desc: "See cursors fly as you build, name, and test colors synchronously." }
            ]}
            faqs={[
                { question: "Is there a limit to concurrent users?", answer: "The Collab Lab supports up to 50 simultaneous users per session with zero latency." }
            ]}
        />
    );
};
