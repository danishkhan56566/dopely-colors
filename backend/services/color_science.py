from material_color_utilities_python import themeFromSourceColor, argbFromHex, hexFromArgb

def generate_material_system(primary_hex: str, secondary_hex: str = None, tertiary_hex: str = None):
    """
    Given 1 to 3 hex codes, generates a scalable Material Design palette system
    using the official material-color-utilities-python algorithms.
    """
    
    # Generate the base theme from the primary color
    primary_argb = argbFromHex(primary_hex)
    
    # Custom colors logic for secondary and tertiary if provided
    custom_colors = []
    if secondary_hex:
        custom_colors.append({
            "value": argbFromHex(secondary_hex),
            "name": "secondary",
            "blend": True,
        })
    if tertiary_hex:
        custom_colors.append({
            "value": argbFromHex(tertiary_hex),
            "name": "tertiary",
            "blend": True,
        })

    theme = themeFromSourceColor(primary_argb, customColors=custom_colors)
    
    # Map the generated TonalPalettes into a JSON serializable dict structure
    # Material tonal palettes are mapped from tones 0 to 100
    tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100]
    
    palettes = {
        "primary": {},
        "secondary": {},
        "tertiary": {},
        "neutral": {},
        "neutralVariant": {}
    }
    
    for t in tones:
        palettes["primary"][str(t)] = hexFromArgb(theme.get('palettes').get('primary').tone(t))
        palettes["secondary"][str(t)] = hexFromArgb(theme.get('palettes').get('secondary').tone(t))
        palettes["tertiary"][str(t)] = hexFromArgb(theme.get('palettes').get('tertiary').tone(t))
        palettes["neutral"][str(t)] = hexFromArgb(theme.get('palettes').get('neutral').tone(t))
        palettes["neutralVariant"][str(t)] = hexFromArgb(theme.get('palettes').get('neutralVariant').tone(t))
        
    # Example minimal mapping for Android/Web specific roles
    systems_data = {
        "palettes": palettes,
        "platforms": {
            "android_material": {
                "surface": palettes["neutral"]["98"],
                "neutral_10": palettes["neutral"]["10"],
            }
        }
    }
    
    return systems_data
