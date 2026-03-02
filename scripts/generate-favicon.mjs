import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateFavicon() {
  console.log("🎨 Generating custom favicon with DALL-E...");

  const prompt = `A minimalist, abstract icon design for a favicon. Create a unique, simple geometric symbol or pictogram using a warm olive green and oatmeal/cream color palette. The icon should be clean, modern, and memorable - something unexpected and creative like a stylized acorn, a geometric leaf pattern, an abstract compass, or another distinctive symbol. The design must work well at small sizes (32x32 pixels). Use a soft oatmeal/cream background with the icon in olive green. The style should be elegant and professional.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    console.log("✓ Image generated successfully");
    console.log("📥 Downloading image...");

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save as PNG first
    const publicDir = path.join(__dirname, "..", "public");
    const pngPath = path.join(publicDir, "favicon-generated.png");

    fs.writeFileSync(pngPath, buffer);
    console.log(`✓ Saved PNG to: ${pngPath}`);
    console.log("\nNext steps:");
    console.log("1. Review the generated favicon-generated.png");
    console.log("2. If you like it, you can:");
    console.log("   - Convert it to a 32x32 favicon.ico using an online tool");
    console.log("   - Or create an SVG version manually");
    console.log("   - Or replace the current favicon.svg with this design");
    console.log("\nImage URL (expires soon):");
    console.log(imageUrl);
  } catch (error) {
    console.error("❌ Error generating favicon:", error.message);
    process.exit(1);
  }
}

generateFavicon();
