# Blog System Documentation

This is a lightweight, client-side blog system with Markdown support, math rendering, syntax highlighting, and RSS feed generation.

## Features

- ✅ Client-side Markdown rendering (no build process needed)
- ✅ Math equations support with KaTeX (inline `$...$` and display `$$...$$`)
- ✅ Syntax highlighting for code blocks
- ✅ Automatic table of contents generation
- ✅ Image gallery support (side-by-side layouts)
- ✅ Responsive design
- ✅ RSS feed for subscribers
- ✅ Bilingual support (English & Chinese)
- ✅ Automatic reading time calculation

## File Structure

```
blog/
├── index.html              # Blog listing page
├── neurips2025.html        # Example blog post page
├── blog-config.js          # Blog metadata configuration
├── generate-rss.js         # RSS feed generator (Node.js)
├── feed.xml                # RSS feed (auto-generated)
├── source/                 # Markdown source files
│   └── neurips2025.md      # Example blog post
└── README.md               # This file

stylesheets/
└── blog.css                # Blog-specific styles

javascripts/
└── blog-renderer.js        # Markdown rendering engine
```

## Accessing Your Blog

Your blog is accessible at:
- **Blog listing**: `https://acm.sjtu.edu.cn/~xyli/blog/`
- **Individual posts**: `https://acm.sjtu.edu.cn/~xyli/blog/neurips2025.html`
- **RSS feed**: `https://acm.sjtu.edu.cn/~xyli/blog/feed.xml`

Since there's no link from the main homepage, the blog is semi-private (only accessible to those who know the URL).

## Adding a New Blog Post

### Step 1: Create the Markdown File

Create a new `.md` file in `blog/source/` with frontmatter:

```markdown
---
title: "Your Blog Post Title"
date: "2025-12-10"
excerpt: "A brief description of your blog post for the listing page."
tags: ["Tag1", "Tag2", "Tag3"]
---

# Your Blog Post Title

Your content here...

## Section 1

Content with **bold**, *italic*, and [links](https://example.com).

### Math Support

Inline math: $E = mc^2$

Display math:
$$
\mathcal{O}(n \log n)
$$

### Code Blocks

```python
def hello_world():
    print("Hello, World!")
```

### Images

Single image:
![Alt text](../images/blog/your-post/image.png)

Side-by-side images:
<div style="display: flex; align-items: center;">
  <img src="../images/blog/your-post/img1.png" style="width:45%; margin-right:10px;">
  <img src="../images/blog/your-post/img2.png" style="width:45%;">
</div>
```

### Step 2: Update Blog Configuration

Add your post to `blog/blog-config.js`:

```javascript
{
    id: 'your-post-id',
    title: 'Your Blog Post Title',
    date: '2025-12-10',
    excerpt: 'Brief description...',
    tags: ['Tag1', 'Tag2'],
    file: 'source/your-post-id.md',
    language: 'en'  // or 'zh' for Chinese
}
```

### Step 3: Create HTML Page

Create `blog/your-post-id.html` (you can copy and modify `neurips2025.html`):

```html
<!doctype html>
<html>
<head>
    <!-- Copy the head section from neurips2025.html -->
    <title>Your Post Title - Xingyang Li</title>
    <!-- ... other head content ... -->
</head>
<body class="blog-page">
    <div class="post-container">
        <!-- Copy the structure from neurips2025.html -->
    </div>

    <!-- Update the script to load your markdown file -->
    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            const renderer = new BlogRenderer();
            await renderer.renderBlogPost('your-post-id', 'source/your-post-id.md');
        });
    </script>
</body>
</html>
```

### Step 4: Organize Images

1. Create a directory: `images/blog/your-post-id/`
2. Place your images there
3. Reference them in Markdown: `../images/blog/your-post-id/image.png`

### Step 5: Update RSS Feed

If you have Node.js installed:
```bash
cd blog
node generate-rss.js
```

Or manually edit `blog/feed.xml` to add your new post.

### Step 6: Test Locally

```bash
# From the project root
python3 -m http.server 8000

# Visit http://localhost:8000/blog/
```

## Markdown Features

### Supported Syntax

- Headers: `#`, `##`, `###`
- Bold: `**text**`
- Italic: `*text*`
- Links: `[text](url)`
- Lists: `- item` or `1. item`
- Code blocks: ` ```language ... ``` `
- Blockquotes: `> quote`
- Math: `$inline$` or `$$display$$`

### Image Layouts

**Single centered image:**
```markdown
![Description](path/to/image.png)
```

**Side-by-side images:**
```html
<div style="display: flex; align-items: center;">
  <img src="image1.png" style="width:45%; margin-right:10px;">
  <img src="image2.png" style="width:45%;">
</div>
```

**Three images in a row:**
```html
<div style="display: flex; align-items: center;">
  <img src="img1.png" style="width:30%; margin-right:10px;">
  <img src="img2.png" style="width:30%; margin-right:10px;">
  <img src="img3.png" style="width:30%;">
</div>
```

## Customization

### Styling

Edit `stylesheets/blog.css` to customize:
- Colors (primary: `#1772d0`, hover: `#f09228`)
- Typography (Lato font)
- Layout widths
- Card designs

### Blog Configuration

Edit `blog/blog-config.js`:
- Site information
- RSS settings
- Number of posts in feed

### JavaScript Libraries

The blog uses CDN-hosted libraries:
- **marked.js** v11.1.1 - Markdown parsing
- **KaTeX** v0.16.9 - Math rendering
- **highlight.js** v11.9.0 - Syntax highlighting

## RSS Feed

Subscribers can add `https://acm.sjtu.edu.cn/~xyli/blog/feed.xml` to their RSS reader.

### Regenerating RSS Feed

**With Node.js:**
```bash
cd blog
node generate-rss.js
```

**Manual update:**
Edit `blog/feed.xml` directly following the existing format.

## Tips

1. **Image sizes**: Keep images under 1MB for fast loading
2. **Math rendering**: Test complex equations - KaTeX may not support all LaTeX
3. **Code highlighting**: Specify language in code blocks for better highlighting
4. **Reading time**: Automatically calculated (200 words/min English, 300 chars/min Chinese)
5. **Mobile**: Test on mobile - images will stack vertically

## Troubleshooting

**Blog post not rendering:**
- Check browser console for JavaScript errors
- Verify markdown file path in the HTML file
- Ensure frontmatter is properly formatted

**Math not displaying:**
- Check for proper `$` or `$$` delimiters
- Escape special characters if needed
- Verify KaTeX CDN is loading

**Images not showing:**
- Check image paths (relative to HTML file location)
- Verify images exist in the correct directory
- Check browser console for 404 errors

## Future Enhancements

Possible additions:
- Search functionality
- Post categories/filtering
- Dark mode toggle
- Comments system (if desired)
- Social media sharing buttons
- View counter

## Questions?

For issues or questions about the blog system, check:
1. Browser console for JavaScript errors
2. Network tab for failed resource loads
3. This README for common solutions
