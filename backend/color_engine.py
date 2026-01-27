from PIL import Image
import io
import math

# Import directly from the top-level package
from material_color_utilities_python import (
    themeFromImage, 
    hexFromArgb, 
    argbFromHex,
    Hct,
    Scheme,
    themeFromSourceColor
)

def extract_seed_from_image(image_bytes: bytes) -> str:
    """
    Extracts the most suitable seed color from an image using
    Google's Material Design scoring algorithm via 'themeFromImage'.
    """
    try:
        # 1. Load Image
        image = Image.open(io.BytesIO(image_bytes))
        
        # 2. Normalize: Handle Transparency (Composite on White)
        if image.mode in ('RGBA', 'LA') or (image.mode == 'P' and 'transparency' in image.info):
            alpha = image.convert('RGBA').split()[-1]
            bg = Image.new("RGB", image.size, (255, 255, 255))
            bg.paste(image, mask=alpha)
            image = bg
        else:
            image = image.convert('RGB')
            
        # 3. Resize deterministically (LANCZOS is high quality and stable)
        image.thumbnail((128, 128), Image.Resampling.LANCZOS)
        
        # 4. Use the high-level helper
        theme = themeFromImage(image)
        
        # 5. Extract source color
        source_int = theme.get('source')
        if source_int:
            return hexFromArgb(source_int)
        
        return "#4285F4" # Fallback

    except Exception as e:
        print(f"Error extracting color: {e}")
        return "#4285F4"

class DesignSystemGenerator:
    """
    Python implementation of the frontend's DesignSystemGenerator.
    Ensures backend responses match the exact structure expected by the UI.
    """
    def __init__(self, seed_hex: str, secondary_hex: str = None, tertiary_hex: str = None):
        self.seed_hex = seed_hex
        self.seed_argb = argbFromHex(seed_hex)
        
        # Generate the base theme using library utilities
        # custom_colors could be added here if the library supports it easily, 
        # otherwise we manually override.
        self.theme = themeFromSourceColor(self.seed_argb)
        self.palettes = self.theme.get('palettes')
        
    def generate_all(self, brand_name: str = "Brand"):
        core = self.generate_core_spectrum()
        return {
            "brand_name": brand_name,
            "base_colors": core,
            "platforms": {
                "android_material": self.generate_android_system(),
                "ios_hig": self.generate_ios_system(core),
                "web": self.generate_web_system()
            },
            "accessibility": { # Mocked or calculated
                "primary_on_background": 5.0,
                "primary_on_background_pass": True,
                "on_primary_text_color": "#FFFFFF"
            } 
        }

    def generate_core_spectrum(self):
        # Extract key colors from the generated palettes
        # Since TonalPalette.keyColor is not available in this lib, we usage Tone 40 as representative
        
        def get_tone(role, tone=40):
            return hexFromArgb(self.palettes[role].tone(tone))
            
        return {
            "primary": self.seed_hex,
            "secondary": get_tone('secondary'),
            "tertiary": get_tone('tertiary'),
            "neutral": get_tone('neutral'),
            "neutralVariant": get_tone('neutralVariant'),
            "error": get_tone('error'),
            "warning": '#FBC02D',
            "success": '#388E3C'
        }

    def generate_android_system(self):
        roles = ['primary', 'secondary', 'tertiary', 'neutral', 'neutral_variant', 'error']
        pal_map = {
             'primary': 'primary', 'secondary': 'secondary', 'tertiary': 'tertiary',
             'neutral': 'neutral', 'neutral_variant': 'neutralVariant', 'error': 'error'
        }
        tones = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]
        output = {}
        
        for role_key, pal_key in pal_map.items():
            palette = self.palettes[pal_key]
            for tone in tones:
                output[f"{role_key}_{tone}"] = hexFromArgb(palette.tone(tone))
        
        # Add special semantics
        output['surface'] = output['neutral_98']
        # Calculate tone 6 explicitly as it wasn't in the generic loop
        output['surface_dark'] = hexFromArgb(self.palettes['neutral'].tone(6)) 
        output['primary_container'] = output['primary_90']
        output['on_primary_container'] = output['primary_10']
        
        return output

    def generate_ios_system(self, core):
        # Approximate the frontend logic for iOS Semantic Colors
        def make_dynamic(base_hex):
            hct = Hct.fromInt(argbFromHex(base_hex))
            light = Hct.fromHct(hct.hue, hct.chroma, 50.0).toInt()
            dark = Hct.fromHct(hct.hue, hct.chroma, 70.0).toInt()
            return { "light": hexFromArgb(light), "dark": hexFromArgb(dark) }

        return {
            "systemPrimary": make_dynamic(core['primary']),
            "systemSecondary": make_dynamic(core['secondary']),
            "systemTertiary": make_dynamic(core['tertiary']),
            "systemBackground": { "light": "#FFFFFF", "dark": "#000000" },
            "systemGroupedBackground": { "light": "#F2F2F7", "dark": "#1C1C1E" },
            "systemGreen": make_dynamic(core['success']),
            "systemRed": make_dynamic(core['error']),
            "systemYellow": make_dynamic(core['warning']),
        }

    def generate_web_system(self):
        output = {}
        # Tailwind mapping
        tw_map = {
            '50': 95, '100': 90, '200': 80, '300': 70, '400': 60,
            '500': 50, '600': 40, '700': 30, '800': 20, '900': 10, '950': 5
        }
        
        pal_keys = {
            'primary': 'primary', 'secondary': 'secondary', 'tertiary': 'tertiary',
            'neutral': 'neutral', 'error': 'error'
        }
        
        for role_name, pal_key in pal_keys.items():
            palette = self.palettes[pal_key]
            for tw, tone in tw_map.items():
                output[f"{role_name}-{tw}"] = hexFromArgb(palette.tone(tone))
                
        return output

def generate_core_palette(seed_hex: str, secondary_hex: str = None, tertiary_hex: str = None):
    """
    Wrapper to maintain backward compatibility but return full system.
    """
    generator = DesignSystemGenerator(seed_hex, secondary_hex, tertiary_hex)
    return generator.generate_all()
