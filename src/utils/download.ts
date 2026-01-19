export const downloadPaletteAsPng = (colors: { hex: string }[]) => {
    // Create an in-memory canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2d context');
        return;
    }

    // Reset canvas
    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.font = 'bold 48px Inter, sans-serif';
    ctx.fillStyle = '#111827';
    ctx.fillText('Color Palette', 60, 80);

    // Date
    ctx.font = '24px Inter, sans-serif';
    ctx.fillStyle = '#6B7280';
    ctx.fillText(new Date().toLocaleDateString(), 60, 120);

    // Draw Colors
    const barWidth = (width - 120) / colors.length;
    const startY = 160;
    const barHeight = 350;

    colors.forEach((color, i) => {
        const x = 60 + (i * barWidth);

        // Color Rect
        ctx.fillStyle = color.hex;
        ctx.fillRect(x, startY, barWidth, barHeight);

        // Hex Code
        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.fillText(color.hex, x + (barWidth / 2), startY + barHeight + 40);

        // Name/Number
        ctx.font = '16px Inter, sans-serif';
        ctx.fillStyle = '#6B7280';
        ctx.fillText(`Color ${i + 1}`, x + (barWidth / 2), startY + barHeight + 70);
    });

    // Branding
    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.textAlign = 'right';
    ctx.fillText('Made with PalettePro', width - 60, height - 40);

    // Download using Blob
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error('Canvas to Blob failed');
            alert('Failed to generate image. Please try again.');
            return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `palette-pro-${new Date().getTime()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Delay revocation to ensure download starts
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }, 'image/png');
};
