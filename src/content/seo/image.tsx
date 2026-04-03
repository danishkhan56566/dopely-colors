export const imageSEOData = {
    title: "Image Color Extractor",
    introduction: (
        <>
            <p>
                Our <strong>Image to Palette Extractor</strong> allows you to upload any photo and instantly pull a mathematically accurate color scheme from it. Whether you are building a brand mood board based on nature photography or trying to replicate the exact color grading of a cinematic still, this tool bridges the gap between physical inspiration and digital execution.
            </p>
            <p className="mt-4">
                Unlike primitive tools that just pick random pixels, our engine utilizes <em>K-Means clustering algorithms</em> to understand the dominant color zones within the image, ensuring the generated palette perfectly captures the overall "mood" rather than outlier pixels.
            </p>
        </>
    ),
    howToSteps: [
        {
            title: "Upload Your Image",
            description: "Drag and drop any standard image file (JPG, PNG, WEBP) into the upload area, or click to browse your device. We process images locally in your browser to guarantee 100% privacy."
        },
        {
            title: "Wait for Quantization",
            description: "Our algorithm processes the image pixels, grouping millions of colors into primary clusters to find the true dominant and accent hues."
        },
        {
            title: "Select the Best Matches",
            description: "Click on the generated color swatches below the image. You can select up to 5 colors to form your base palette."
        },
        {
            title: "Refine in the Generator",
            description: "Once selected, click 'Export to Palette' to open these colors in our main generative workspace, where you can convert them into Tailwind CSS scales or check accessibility."
        }
    ],
    benefits: [
        {
            title: "Privacy First (Client-Side)",
            description: "Your confidential client mockups or personal photos are never sent to our servers. All image processing happens directly within your own browser."
        },
        {
            title: "Intelligent Clustering",
            description: "Extracting color isn't just picking pixels. By using clustering math, we find the 'average' of a visual area, ensuring your palette isn't thrown off by digital noise or jpeg artifacts."
        },
        {
            title: "Perfect for Mood Boards",
            description: "Translate real-world inspiration (a sunset, a piece of clothing, an architectural photograph) directly into usable digital hex codes instantly."
        },
        {
            title: "Fast Asset Creation",
            description: "Working with a strict client brand image? Upload their logo or hero image to instantly pull their exact color system without asking for brand guidelines."
        }
    ],
    proTips: [
        "Images with very high noise or a million different colors (like a crowded city street) will result in a 'muddy' palette. Photos with clear, distinct subject matter work best.",
        "If you want to extract a highly specific color (like a tiny red flower in a huge green field), you might need to crop the image first before uploading to ensure the algorithm prioritizes that region.",
        "After extracting, the generated palette might not have perfect UI contrast. Always take it into the Generator and check the WCAG badges before writing production code."
    ],
    faqs: [
        {
            q: "Are my uploaded photos saved?",
            a: "No. The Image to Palette tool runs entirely offline within your local browser cache. We do not have visual access to the images you process."
        },
        {
            q: "What image formats are supported?",
            a: "We support standard web formats including JPEG, PNG, WEBP, and SVG. The maximum file size we recommend is 10MB to prevent your browser from freezing during calculation."
        },
        {
            q: "What is K-Means Clustering?",
            a: "It's an algorithm that groups data points into 'K' number of clusters. In this context, it groups millions of pixels into 5-10 clusters based on color similarity, and returns the average color of each cluster as your palette."
        },
        {
            q: "Can I extract colors from a website?",
            a: "Directly extracting from a URL is blocked by most browsers due to CORS security policies. The best method is to take a screenshot of the website and drag it into our extractor."
        }
    ]
};
