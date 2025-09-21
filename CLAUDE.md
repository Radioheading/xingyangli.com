# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Ji Lin's personal academic homepage website hosted on GitHub Pages (tonylins.github.io). It's a static HTML website showcasing research work, publications, and professional background.

## Tech Stack

- Static HTML website with no build process
- Uses Bootstrap 3 and Font Awesome for styling
- Vanilla JavaScript (minimal usage)
- Hosted on GitHub Pages with custom domain (www.linji.me)

## Common Development Tasks

### Running Local Development Server
```bash
# Use Python's built-in HTTP server
python3 -m http.server 8000

# Then open http://localhost:8000 in browser
```

### Deployment
The site auto-deploys to GitHub Pages when changes are pushed to the master branch. The CNAME file configures the custom domain.

## Project Structure

- `index.html` - Main homepage with all content
- `stylesheets/` - CSS files including Bootstrap, Font Awesome, and custom styles
  - `special.css` - Custom styling overrides
- `javascripts/` - Bootstrap JS and minimal helper scripts
- `images/` - Profile photos and icons
- `files/` - PDF documents (posters, supplementary materials)
- `fonts/` - Font files for Font Awesome icons
- `CNAME` - GitHub Pages custom domain configuration
- `robot.txt` - Search engine crawler rules

## Key Considerations

- This is a single-page static website - all content is in index.html
- No build process or package manager needed
- Changes to index.html are immediately reflected after commit/push
- The site uses Google Analytics (configured in the HTML head)
- Cache control headers are disabled in the HTML to ensure updates are visible immediately