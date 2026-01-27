from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv() # Load env vars from .env file

# Initialize FastAPI
app = FastAPI(title="Dopely Colors AI Backend", version="1.0.0")

# Configure CORS (Allow requests from Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust port if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root/Health Check
@app.get("/")
async def root():
    return {"status": "online", "service": "Dopely Colors AI Backend"}

# --- Models ---
class TextPrompt(BaseModel):
    prompt: str
    count: int = 5

# --- Endpoints ---

@app.post("/generate/text-to-palette")
async def generate_from_text(data: TextPrompt):
    """
    Interprets natural language via OpenAI and generates a Material Palette.
    """
    try:
        from openai import AsyncOpenAI
        
        # Check for API Key
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            # Fallback for dev if no key - return mock but structured valid data
            print("WARNING: No OPENAI_API_KEY found. Returning mock data.")
            return {
                "status": "mock",
                "seed": "#6200ea",
                "system": generate_core_palette_helper("#6200ea")
            }

        client = AsyncOpenAI(api_key=api_key)

        response = await client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a specialized Design AI. Analyze the user's request for INDUSTRY CONTEXT (e.g., Food, Weather, Finance, Medical). You MUST apply industry-standard color psychology. Examples: Food = Reds/Oranges/Yellows (appetite). Weather = Blues/Sky/Sun/Grey. Finance = Deep Blues/Greens (trust). Medical = Teals/Whites/Clean Blues. Construction = Yellow/Black. Return a JSON object with keys: 'primary', 'secondary', 'tertiary'. Values must be hex codes."},
                {"role": "user", "content": f"Create a palette for: {data.prompt}"}
            ],
            response_format={"type": "json_object"}
        )

        import json
        content = response.choices[0].message.content
        colors = json.loads(content)
        
        seed_hex = colors.get('primary', '#6200ea')
        
        # Generate System using our engine
        from color_engine import generate_core_palette
        palette_system = generate_core_palette(seed_hex)
        
        # We could override secondary/tertiary in the system if the engine supported it,
        # but for now, the seed (primary) drives the tonal harmony which is usually safer.
        # However, to respect the AI's specific secondary choice, we might need to update the engine
        # or just return these as specific keys. 
        # For simplicity in this phase, letting Material Logic handle harmony from Primary is robust.
        
        return {
            "status": "success",
            "seed": seed_hex,
            "ai_suggestions": colors,
            "system": palette_system
        }

    except Exception as e:
        print(f"Error in text-to-palette: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Helper to avoid circular imports or duplication if needed
def generate_core_palette_helper(seed):
    from color_engine import generate_core_palette
    return generate_core_palette(seed)

from fastapi.responses import HTMLResponse

@app.get("/generate/image-to-palette", response_class=HTMLResponse)
async def get_image_upload_form():
    return """
    <!DOCTYPE html>
    <html>
        <head>
            <title>Test Image to Palette</title>
        </head>
        <body>
            <h1>Upload Image to Generate Palette</h1>
            <form action="/generate/image-to-palette" method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept="image/*" required>
                <button type="submit">Generate Palette</button>
            </form>
        </body>
    </html>
    """

@app.post("/generate/image-to-palette")
async def generate_from_image(file: UploadFile = File(...)):
    """
    Extracts seed color from uploaded image and generates Material Palette.
    """
    try:
        content = await file.read()
        
        # 1. Extract Seed
        from color_engine import extract_seed_from_image, generate_core_palette
        seed_hex = extract_seed_from_image(content)
        
        # 2. Generate System
        palette_system = generate_core_palette(seed_hex)
        
        return {
            "status": "success",
            "seed": seed_hex,
            "system": palette_system
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from supabase import create_client, Client

# Initialize Supabase
# Ensure these are set in your .env file
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Supabase client initialized successfully.")
    except Exception as e:
        print(f"Warning: Failed to init Supabase: {e}")

# --- Chat / Intent Classification Endpoint ---

class ChatRequest(BaseModel):
    user_id: str = "guest" # Default for backward compatibility
    message: str
    current_state: dict = {}

SYSTEM_INSTRUCTION = """
You are "PaletteAI," an expert UI/UX Design Assistant.

Your goal is to help users create color palettes and answer design questions.

CONTEXT AWARENESS:
Always review the 'history' provided to understand previous requests. If the user says "make IT darker", refer to the last palette generated.

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
1. ACTION MODE: If user wants colors (e.g. "blue finance app", "make it darker", "fresh palette"):
   - "type": "action"
   - "message": Explain WHY you chose these colors (e.g. "Blue conveys trust...").
   - "parameters": Set primary_hex based on color theory.

2. CHAT MODE: If user asks about design (e.g. "What is contrast?", "Material Design rules", "Accessibility"):
   - "type": "chat"
   - "message": Answer helpfully and concisely.
   - "parameters": {}

3. REFUSAL MODE: If user asks about politics, sports, coding scripts, or non-design topics:
   - "type": "refusal"
   - "message": "I specialize only in UI/UX Design and Color Systems."
   - "parameters": {}
"""

@app.post("/chat")
async def chat_handler(request: ChatRequest):
    try:
        import google.generativeai as genai
        import json
        
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key:
             # Fallback logic for dev environment without key
            print("WARNING: No GOOGLE_API_KEY found. Using crude regex fallback.")
            msg_lower = request.message.lower()
            
            # Bucket B: Domain Knowledge (Chat)
            if any(k in msg_lower for k in ["what is", "how to", "explain", "meaning", "ux", "ui", "material", "accessib"]):
                return {
                    "type": "chat",
                    "message": "This is a Dev Mode answer (No Gemini Key). In a real environment, I would explain UI/UX concepts here.",
                    "data": request.current_state
                }

            # Bucket A: Action (Palette Generation)
            if any(k in msg_lower for k in ["palette", "color", "design", "make", "create", "update"]):
                 return {
                    "type": "action",
                    "message": "Generating palette (Dev Mock - No Gemini Key)...",
                    "data": generate_core_palette_helper("#6200ea")
                }

            # Bucket C: Refusal
            return {
                "type": "chat", 
                "message": "I specialize only in UI/UX and Color Systems. (Dev Mode Refusal)",
                "data": request.current_state
            }
        
        # --- SUPABASE HISTORY LOGIC ---
        history_for_gemini = []
        if supabase:
            try:
                # 1. Save User Message
                supabase.table("chat_messages").insert({
                    "user_id": request.user_id,
                    "role": "user",
                    "content": request.message
                }).execute()
                
                # 2. Fetch History (Last 10 messages)
                hist_response = supabase.table("chat_messages")\
                    .select("role, content")\
                    .eq("user_id", request.user_id)\
                    .order("created_at", desc=True)\
                    .limit(10)\
                    .execute()
                
                # Reverse to get Oldest -> Newest
                raw_history = hist_response.data[::-1]
                
                for record in raw_history:
                    history_for_gemini.append({
                        "role": "user" if record['role'] == "user" else "model",
                        "parts": [record['content']]
                    })
                    
            except Exception as e:
                print(f"Supabase Error (Non-blocking): {e}")

        # Initialize Gemini with JSON Mode
        genai.configure(api_key=api_key)
        
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 1024,
            "response_mime_type": "application/json", 
        }
        
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash-latest",
            generation_config=generation_config,
            system_instruction=SYSTEM_INSTRUCTION
        )

        # Start chat with history
        chat = model.start_chat(history=history_for_gemini)
        response = chat.send_message(request.message)
        
        # Parse Gemini's JSON response
        ai_data = json.loads(response.text)
        intent_type = ai_data.get("type", "chat")
        ai_message_text = ai_data.get("message", "Processed request.")
        
        # --- SAVE AI RESPONSE ---
        if supabase:
            try:
                 supabase.table("chat_messages").insert({
                    "user_id": request.user_id,
                    "role": "model",
                    "content": ai_message_text
                }).execute()
            except Exception as e:
                print(f"Supabase Save Error: {e}")
        
        # LOGIC BRIDGE: AI Intent -> Python Engine
        if intent_type == "action":
            params = ai_data.get("parameters", {})
            seed_hex = params.get("primary_hex", "#3B82F6")
            sec_hex = params.get("secondary_hex")
            ter_hex = params.get("tertiary_hex")
            
            from color_engine import generate_core_palette
            palette_system = generate_core_palette(seed_hex, sec_hex, ter_hex)
            
            return {
                "type": "action",
                "message": ai_message_text,
                "data": palette_system
            }
            
        elif intent_type == "refusal":
             return {
                "type": "chat",
                "message": ai_message_text,
                "data": request.current_state
            }
            
        else: # Chat
            return {
                "type": "chat",
                "message": ai_message_text,
                "data": request.current_state
            }

    except Exception as e:
        print(f"Gemini Error (Falling back to local): {e}")
        
        # --- SMART FALLBACK ENGINE ---
        # If the AI is down/quota-limited, we use local keywords to keep the app working.
        msg_lower = request.message.lower()
        
        # Fallback A: Action (Palette Generation)
        if any(k in msg_lower for k in ["palette", "color", "design", "make", "create", "update", "app", "website"]):
             from color_engine import generate_core_palette
             # Default to a nice blue or extract from keywords if possible (simplified here)
             fallback_seed = "#6200ea" 
             if "crypto" in msg_lower: fallback_seed = "#F7931A" # Bitcoin Orange
             if "finance" in msg_lower: fallback_seed = "#0052FF"
             if "food" in msg_lower: fallback_seed = "#FF4B4B"
             
             palette_system = generate_core_palette(fallback_seed)
             
             fallback_msg = "I've analyzed your keywords and instantly generated a high-fidelity palette design system for you."
             
             # Try to save fallback response to Supabase so history isn't broken
             if supabase:
                 try:
                     supabase.table("chat_messages").insert({
                        "user_id": request.user_id,
                         "role": "model",
                         "content": fallback_msg
                     }).execute()
                 except: pass

             return {
                "type": "action",
                "message": fallback_msg,
                "data": palette_system
            }

        # Fallback B: Chat/Other
        fallback_msg = "I'm focused on designing your color system right now. Could you describe the specific mood or industry you're looking for?"
        return {
            "type": "chat",
            "message": fallback_msg,
            "data": request.current_state
        }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
