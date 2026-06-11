from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.ai_service import generate_palette_from_text
from services.color_science import generate_material_system
import traceback

app = FastAPI(title="Dopely Colors API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to localhost and dopelycolors.com
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPrompt(BaseModel):
    prompt: str
    count: int = 5

@app.post("/api/generate/text-to-palette")
async def text_to_palette(body: TextPrompt):
    try:
        # 1. Ask LLM for the semantic colors
        seed_colors = generate_palette_from_text(body.prompt)
        if not seed_colors or len(seed_colors) < 3:
            raise ValueError("Failed to generate robust seed colors from LLM.")
            
        primary = seed_colors[0]
        secondary = seed_colors[1]
        tertiary = seed_colors[2]

        # 2. Convert to Material Design System
        system = generate_material_system(primary, secondary, tertiary)
        
        return {
            "status": "success",
            "seed": primary,
            "ai_suggestions": {
                "primary": primary,
                "secondary": secondary,
                "tertiary": tertiary
            },
            "system": system
        }
    except Exception as e:
        print(f"Error in text-to-palette: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class ChatMessage(BaseModel):
    message: str
    current_state: dict = {}
    current_design: dict = {}
    user_id: str = "guest"

@app.post("/api/chat")
async def chat_interaction(body: ChatMessage):
    try:
        # For phase 2 basics: returning fallback logic wrapper.
        # In the future, this would hold complex Agentic LLM chains.
        return {
            "type": "chat",
            "message": f"I understand you want to change: {body.message}. The neural UI updater is scheduled for Phase 3!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate/image-to-palette")
async def image_to_palette(file: UploadFile = File(...)):
    try:
        # For Phase 2 basics: returning default structure mapping to UI expectations
        # Production would utilize OpenCV or Pillow K-Means clustering here
        system = generate_material_system("#3b82f6", "#10b981", "#8b5cf6")
        return {
            "status": "success",
            "seed": "#3b82f6",
            "system": system
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}
