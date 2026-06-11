import os
import json
import google.generativeai as genai

# Configure Google Generative AI
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def generate_palette_from_text(prompt: str) -> list[str]:
    """
    Uses Gemini to interpret a semantic user prompt into 3 core hex codes
    Returns: [PrimaryHex, SecondaryHex, TertiaryHex]
    """
    if not api_key:
        # Fallback if no API key is provided during dev
        print("Warning: GEMINI_API_KEY not set. Returning dev-mode mock data.")
        return ["#3b82f6", "#10b981", "#8b5cf6"]

    # Use flash model for fast latency
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    system_instruction = """
    You are an expert color theorist and senior UI designer. 
    You will receive a semantic text prompt indicating a vibe, mood, or brand description.
    Your job is to translate this text into exactly 3 hex codes that perfectly represent this vibe.
    Output ONLY valid JSON matching this schema:
    [
      "#Hex1",
      "#Hex2",
      "#Hex3"
    ]
    Do not output markdown, Do not output anything else.
    """
    
    try:
        response = model.generate_content(
            f"{system_instruction}\n\nUser Prompt: {prompt}",
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                response_mime_type="application/json"
            )
        )
        
        # Parse the JSON response
        hex_list = json.loads(response.text)
        
        # Validate data
        if isinstance(hex_list, list) and len(hex_list) >= 3:
            return hex_list[:3]
        else:
            raise ValueError("LLM returned malformed list structure.")
            
    except Exception as e:
        print(f"genai generation failed: {e}")
        # Final fallback
        return ["#000000", "#555555", "#AAAAAA"]
