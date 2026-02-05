#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run new-post "Blog Post Title" "Description of the post" [optional-slug]');
  console.error('Example: npm run new-post "My Amazing Post" "This post is about amazing things" my-amazing-post');
  process.exit(1);
}

const title = args[0];
const description = args[1];
const slug = args[2] || title.toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

// Get OpenAI API key from environment variable
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.');
  console.error('Set it with: export OPENAI_API_KEY=your-api-key');
  process.exit(1);
}

console.log(`Creating new blog post: "${title}"`);
console.log(`Slug: ${slug}`);
console.log(`Description: ${description}`);

// Generate image prompt based on the description
const imagePrompt = `Abstract minimalist blog header image representing: ${description}. Use an olive green and oatmeal beige color palette. Clean, modern, serene aesthetic with gentle geometric shapes. No text.`;

console.log('\nGenerating AI image with DALL-E 3...');

try {
  // Call OpenAI DALL-E API
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: imagePrompt,
      n: 1,
      size: '1792x1024',
      quality: 'standard',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  const imageUrl = data.data[0].url;

  console.log('Image generated successfully!');
  console.log('Downloading image...');

  // Download the image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = await imageResponse.arrayBuffer();

  // Ensure public/blog directory exists
  await mkdir(join(__dirname, '..', 'public', 'blog'), { recursive: true });

  // Save image
  const imagePath = join(__dirname, '..', 'public', 'blog', `${slug}.png`);
  await writeFile(imagePath, Buffer.from(imageBuffer));

  console.log(`Image saved to: public/blog/${slug}.png`);

  // Create blog post markdown
  const today = new Date().toISOString().split('T')[0];
  const markdownContent = `---
title: ${title}
description: ${description}
pubDate: ${today}
heroImage: /blog/${slug}.png
---

Write your blog post content here.

## Section 1

Your content...

## Section 2

More content...
`;

  // Ensure src/content/blog directory exists
  await mkdir(join(__dirname, '..', 'src', 'content', 'blog'), { recursive: true });

  // Save markdown file
  const markdownPath = join(__dirname, '..', 'src', 'content', 'blog', `${slug}.md`);
  await writeFile(markdownPath, markdownContent);

  console.log(`Blog post created: src/content/blog/${slug}.md`);
  console.log('\n✨ Done! Your new blog post is ready to edit.');
  console.log(`View it at: http://localhost:4321/blog/${slug}`);

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
