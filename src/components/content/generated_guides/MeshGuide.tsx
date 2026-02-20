import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const MeshGuide = () => {
    return (
        <DocumentationHub
            title="Mesh Gradient Maker"
            description="Visually drag and drop control nodes to create ultra-smooth organic multi-color gradients."
            benefits={[
                "Absolute granular control over color positioning",
                "Export production-ready CSS radial-gradient strings",
                "Create stunning abstract backgrounds for hero sections",
                "Save custom mesh presets"
            ]}
            howToSteps={[
                { title: "Plot Nodes", desc: "Click to add color anchors onto the canvas." },
                { title: "Assign Colors", desc: "Change the hue of each anchor point." },
                { title: "Manipulate Space", desc: "Drag the nodes to warp and bend the color fields." }
            ]}
            faqs={[
                { question: "How is the mesh exported?", answer: "We intelligently map your 2D nodes into a complex layered CSS radial-gradient background for maximum compatibility." }
            ]}
        />
    );
};
