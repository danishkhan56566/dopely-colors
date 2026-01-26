
import { DesignState } from './ai-assistant';

// --- 1. INTERNAL DATA STRUCTURE (Single Source of Truth) ---

import { DesignSystemOutput } from './design-system-generator';

export interface ExportData {
  palette_id: string; // uuid or unique string
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  system?: DesignSystemOutput; // Include the full generated system
  mode: 'light' | 'dark';
  contrast: 'AA' | 'AAA'; // scalable
  created_by: string;
}

// Convert AI DesignState to ExportData
export const mapDesignStateToExport = (design: DesignState): ExportData => {
  return {
    palette_id: design.version_id || `dopely-${Date.now()}`,
    name: `Dopely AI System ${design.version_id}`,
    colors: {
      primary: design.brand_colors.primary,
      secondary: design.brand_colors.secondary,
      accent: design.brand_colors.accent,
      background: design.brand_colors.background,
      text: design.brand_colors.text,
    },
    system: design.system,
    mode: design.mode,
    contrast: 'AA', // We assume AA for generated palettes for now
    created_by: 'ai-assistant'
  };
};

// --- 2. EXPORT GENERATORS ---

// 2a. FIGMA EXPORT (JSON for Plugin)
export interface FigmaExport {
  name: string;
  colors: { name: string; hex: string }[];
  mode: string;
  accessibility: string;
}

export const generateFigmaExport = (data: ExportData): FigmaExport => {
  return {
    name: data.name,
    colors: Object.entries(data.colors).map(([key, hex]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      hex: hex
    })),
    mode: data.mode,
    accessibility: `WCAG ${data.contrast}`
  };
};

// 2b. CSS EXPORT (Variables)
// 2b. CSS EXPORT (Variables)
export const generateCSSExport = (data: ExportData): string => {
  // If we have the full Material System
  if (data.system) {
    const web = data.system.platforms.web;
    const material = data.system.platforms.android_material;

    // Generate all CSS vars from web scale + material semantic tokens
    const vars = [
      ...Object.entries(web).map(([k, v]) => `  --color-${k}: ${v};`),
      `  /* Material Semantic Tokens */`,
      `  --color-surface: ${material.surface};`,
      `  --color-on-surface: ${material.neutral_10};`, // Approximate
      `  --color-primary-container: ${material.primary_container};`,
      `  --color-on-primary-container: ${material.on_primary_container};`
    ].join('\n');

    return `:root {
${vars}
}

/* Dark Mode Overrides (if using a class-based switch) */
.dark {
  --color-surface: ${material.surface_dark};
  --color-on-surface: ${material.neutral_90};
}`;
  }

  // Fallback Legacy
  return `:root {
  --color-primary: ${data.colors.primary};
  --color-secondary: ${data.colors.secondary};
  --color-accent: ${data.colors.accent};
  --color-bg: ${data.colors.background};
  --color-text: ${data.colors.text};
}

/* Dark Mode Support */
[data-theme="dark"] {
  --color-bg: ${data.mode === 'dark' ? data.colors.background : '#1E272E'};
  --color-text: ${data.mode === 'dark' ? data.colors.text : '#FFFFFF'};
}

/* Usage Example */
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text);
}`;
};

// 2c. TAILWIND EXPORT (Config)
// 2c. TAILWIND EXPORT (Config)
export const generateTailwindExport = (data: ExportData): string => {

  if (data.system) {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: ${JSON.stringify(data.system.platforms.web, null, 8).replace('}', '      }')}
    }
  }
}`;
  }

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '${data.colors.primary}',
        secondary: '${data.colors.secondary}',
        accent: '${data.colors.accent}',
        background: '${data.colors.background}',
        text: '${data.colors.text}'
      }
    }
  }
}`;
};

// 2d. ANDROID EXPORT (XML)
export const generateAndroidExport = (data: ExportData): string => {
  if (data.system) {
    const material = data.system.platforms.android_material;

    // Generate XML items
    const colorItems = Object.entries(material).map(([name, hex]) =>
      `    <color name="${name}">${hex}</color>`
    ).join('\n');

    return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- M3 Tonal Palette -->
${colorItems}
</resources>`;
  }

  // Fallback
  return `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">${data.colors.primary}</color>
    <color name="secondary">${data.colors.secondary}</color>
    <color name="accent">${data.colors.accent}</color>
    <color name="background">${data.colors.background}</color>
    <color name="text">${data.colors.text}</color>
</resources>`;
};

// 2e. IOS EXPORT (Swift)
export const generateIOSExport = (data: ExportData): string => {
  if (data.system) {
    const ios = data.system.platforms.ios_hig;

    const extensions = Object.entries(ios).map(([name, val]) => {
      if (typeof val === 'object') {
        return `    static let ${name} = Color(light: "${val.light}", dark: "${val.dark}")`;
      }
      return '';
    }).join('\n');

    return `import SwiftUI

extension Color {
${extensions}

    init(light: String, dark: String) {
        self.init(UIColor { traitCollection in
            return traitCollection.userInterfaceStyle == .dark ? UIColor(hex: dark) : UIColor(hex: light)
        })
    }
}

extension UIColor {
    convenience init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(red: CGFloat(r) / 255, green: CGFloat(g) / 255, blue: CGFloat(b) / 255, alpha: CGFloat(a) / 255)
    }
}`;
  }

  return `import SwiftUI

extension Color {
    static let primary = Color(hex: "${data.colors.primary}")
    static let secondary = Color(hex: "${data.colors.secondary}")
    static let accent = Color(hex: "${data.colors.accent}")
}`;
};

// --- 3. DOWNLOAD UTILS ---

export const downloadFile = async (content: string, filename: string, type: 'json' | 'css' | 'js' | 'xml' | 'swift') => {
  const mimeTypes = {
    json: 'application/json',
    css: 'text/css',
    js: 'text/javascript',
    xml: 'text/xml',
    swift: 'text/plain'
  };

  // Verify content
  if (!content) {
    console.error('Download failed: Content is empty');
    return;
  }

  console.log(`Downloading ${filename} via Server Form POST...`);

  try {
    // STRATEGY: Hidden Form POST (The robust "Nuclear Option")
    // 1. Create a hidden form.
    // 2. Base64 encode content to ensure safe transport through HTML Form.
    // 3. Submit. Browser handles this as a native download navigation.
    // 4. If successful, user stays on page and file downloads.

    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.action = '/api/export';
    form.target = '_self';

    const appendInput = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    // Encode content to Base64 to prevent form encoding issues with special chars
    const b64Content = btoa(unescape(encodeURIComponent(content)));

    appendInput('filename', filename);
    appendInput('content', b64Content);
    appendInput('isBase64', 'true');
    appendInput('contentType', `${mimeTypes[type]};charset=utf-8`);

    document.body.appendChild(form);
    form.submit();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(form);
    }, 2000);

  } catch (err) {
    console.error('Download error:', err);
    alert('Download failed. Please check console.');
  }
};
