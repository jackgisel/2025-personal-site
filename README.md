# Jack Gisel's Personal Site

This is the source code for my personal website and blog, built with [Astro](https://astro.build/).

## Tech Stack

- **Framework**: Astro
- **Deployment**: Cloudflare Pages
- **Content**: MDX for blog posts
- **Styling**: Tailwind CSS v4 with custom olive/oatmeal color palette
- **Fonts**: Instrument Serif (display), Inter (body)
- **AI**: DALL-E 3 for automated blog post image generation

## Development

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

## Building

Build the site for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Creating New Blog Posts

This site includes an automated blog post generator that creates new posts with AI-generated hero images.

### Setup

1. Copy `.env.example` to `.env`
2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

### Usage

Create a new blog post with an AI-generated image:

```bash
npm run new-post "Your Post Title" "A brief description of your post"
```

**Example:**
```bash
npm run new-post "Building with Astro" "My experience building a personal site with Astro and Tailwind"
```

This will:
- Generate a unique AI image in the olive/oatmeal color palette
- Create a new markdown file in `src/content/blog/`
- Set up the frontmatter with title, description, date, and hero image
- Provide a template to start writing

**Optional custom slug:**
```bash
npm run new-post "My Post Title" "Description" custom-slug-name
```

The generated post will be immediately available in your dev server at `/blog/your-post-slug`.

## Deployment

Deploy to Cloudflare Pages:
```bash
npm run deploy
```

## Project Structure

```
├── public/
│   └── blog/            # Blog post hero images
├── scripts/
│   └── new-blog-post.mjs # Automated blog post generator
├── src/
│   ├── components/      # Reusable Astro components
│   ├── content/
│   │   └── blog/       # Blog posts (MDX)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Site pages and routing
│   └── styles/         # Global styles (Tailwind CSS)
├── astro.config.mjs    # Astro configuration
├── postcss.config.mjs  # PostCSS configuration
└── package.json
```

## License

MIT
