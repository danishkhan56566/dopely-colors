# Phase 2: Technical Architecture

## 1. Backend (Python/FastAPI)
**Role**: Processing inputs and running complex color algorithms, isolating heavy computation and AI logic from the frontend.

### Core Libraries
- **Material Logic**: `material-color-utilities-python`
  - *Purpose*: strictly follow Google’s open-source logic to generate mathematically correct Tonal Palettes.
- **AI Processing**: `openai` (or local LLM integration)
  - *Purpose*: Interpret natural language prompts into structured color data.
  - *Logic*: "Convert description 'Cyberpunk coffee shop' into a JSON object with Primary, Secondary, and Tertiary Hex codes."
- **Image Processing**: `opencv-python` / `Pillow`
  - *Purpose*: robust dominant color extraction from uploaded images/logos.

### Responsibilities
- REST API endpoints for:
  - `/generate/text-to-palette`
  - `/generate/image-to-palette`
  - `/refine/variation`
- Serving generated assets (if needed).

## 2. Frontend (Next.js / React)
**Role**: Interactive UI, routing, and real-time visualization.

### Architecture
- **Framework**: Next.js (TypeScript)
- **State Management**: React Context / Hooks (for managing "Live Preview" synchronization across Android/iOS/Web views).
- **Rendering Engine**:
  - **DOM/CSS**: For responsive UI structure.
  - **Canvas/SVG**: For rendering high-fidelity mockup previews dynamically and enabling high-quality export (PNG/JPG generation).
