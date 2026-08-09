/**
 * Blog Post Renderer
 * Handles Markdown rendering, math equations, syntax highlighting, and TOC generation
 */

class BlogRenderer {
    constructor() {
        this.toc = [];
        this.headingCounter = 0;
    }

    /**
     * Parse frontmatter from markdown
     */
    parseFrontmatter(markdown) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = markdown.match(frontmatterRegex);

        if (!match) {
            return { metadata: {}, content: markdown };
        }

        const frontmatterText = match[1];
        const content = match[2];
        const metadata = {};

        frontmatterText.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();

                // Remove quotes
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }

                // Parse arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.substring(1, value.length - 1)
                        .split(',')
                        .map(v => v.trim().replace(/^["']|["']$/g, ''));
                }

                metadata[key] = value;
            }
        });

        return { metadata, content };
    }

    /**
     * Calculate reading time from text
     */
    calculateReadingTime(text) {
        // Count English words
        const englishWords = text.match(/[a-zA-Z]+/g) || [];
        // Count Chinese characters
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];

        // Average reading speed: 200 English words/min, 300 Chinese chars/min
        const englishTime = englishWords.length / 200;
        const chineseTime = chineseChars.length / 300;

        const totalMinutes = Math.ceil(englishTime + chineseTime);
        return totalMinutes;
    }

    /**
     * Generate table of contents
     */
    generateTOC() {
        if (this.toc.length === 0) return '';

        let html = '<div class="toc-container"><h3>Table of Contents</h3><ul>';

        this.toc.forEach(item => {
            const className = item.level === 3 ? 'toc-h3' : '';
            html += `<li class="${className}"><a href="#${item.id}">${item.text}</a></li>`;
        });

        html += '</ul></div>';
        return html;
    }

    /**
     * Custom marked renderer with heading ID generation
     */
    createMarkedRenderer() {
        const renderer = new marked.Renderer();
        const self = this;

        // Override heading rendering to add IDs and build TOC
        renderer.heading = function(text, level) {
            const escapedText = text.toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const headingId = `heading-${self.headingCounter++}-${escapedText}`;

            // Add to TOC if H2 or H3
            if (level === 2 || level === 3) {
                self.toc.push({
                    level: level,
                    text: text,
                    id: headingId
                });
            }

            return `<h${level} id="${headingId}">${text}</h${level}>`;
        };

        // Override image rendering to handle side-by-side layouts
        renderer.image = function(href, title, text) {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<img src="${href}" alt="${text}"${titleAttr}>`;
        };

        return renderer;
    }

    /**
     * Render markdown to HTML
     */
    async renderMarkdown(markdownFile) {
        try {
            // Fetch markdown file
            const response = await fetch(markdownFile);
            const markdown = await response.text();

            // Parse frontmatter
            const { metadata, content } = this.parseFrontmatter(markdown);

            // Calculate reading time if not provided
            if (!metadata.readingTime) {
                metadata.readingTime = this.calculateReadingTime(content);
            }

            // Configure marked
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: true,
                mangle: false
            });

            // Reset TOC
            this.toc = [];
            this.headingCounter = 0;

            // Render markdown
            const renderer = this.createMarkedRenderer();
            let html = marked.parse(content, { renderer: renderer });

            // Fix image paths: convert ./figs/ to source/figs/
            html = html.replace(/src="\.\/figs\//g, 'src="source/figs/');

            // Process math equations - escape for KaTeX
            // First, protect display math $$...$$
            const displayMathPlaceholders = [];
            html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
                const placeholder = `___DISPLAY_MATH_${displayMathPlaceholders.length}___`;
                displayMathPlaceholders.push(math);
                return placeholder;
            });

            // Then protect inline math $...$
            const inlineMathPlaceholders = [];
            html = html.replace(/\$(.+?)\$/g, (match, math) => {
                const placeholder = `___INLINE_MATH_${inlineMathPlaceholders.length}___`;
                inlineMathPlaceholders.push(math);
                return placeholder;
            });

            // Restore display math
            displayMathPlaceholders.forEach((math, i) => {
                const placeholder = `___DISPLAY_MATH_${i}___`;
                const rendered = katex.renderToString(math, {
                    displayMode: true,
                    throwOnError: false
                });
                html = html.replace(placeholder, rendered);
            });

            // Restore inline math
            inlineMathPlaceholders.forEach((math, i) => {
                const placeholder = `___INLINE_MATH_${i}___`;
                const rendered = katex.renderToString(math, {
                    displayMode: false,
                    throwOnError: false
                });
                html = html.replace(placeholder, rendered);
            });

            return {
                html: html,
                metadata: metadata,
                toc: this.generateTOC()
            };

        } catch (error) {
            console.error('Error rendering markdown:', error);
            throw error;
        }
    }

    /**
     * Apply syntax highlighting to code blocks
     */
    highlightCode() {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }

    /**
     * Format date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Render complete blog post page
     */
    async renderBlogPost(postId, markdownFile) {
        try {
            // Render markdown
            const { html, metadata, toc } = await this.renderMarkdown(markdownFile);

            // Update page title
            if (metadata.title) {
                document.title = `${metadata.title} - Xingyang Li`;
            }

            // Render header
            const headerElement = document.getElementById('post-header');
            if (headerElement && metadata.title) {
                const readingTime = metadata.readingTime || this.calculateReadingTime(html);
                const dateFormatted = metadata.date ? this.formatDate(metadata.date) : '';

                headerElement.innerHTML = `
                    <h1>${metadata.title}</h1>
                    <div class="post-meta">
                        <span class="author">Xingyang Li</span>
                        ${dateFormatted ? `<span>•</span><span class="date">${dateFormatted}</span>` : ''}
                        <span>•</span>
                        <span class="read-time">${readingTime} min read</span>
                    </div>
                `;
            }

            // Render TOC
            const tocElement = document.getElementById('toc');
            if (tocElement && toc) {
                tocElement.innerHTML = toc;
            }

            // Render content
            const contentElement = document.getElementById('post-content');
            if (contentElement) {
                contentElement.innerHTML = html;
            }

            // Apply syntax highlighting
            this.highlightCode();

            // Smooth scroll for TOC links
            this.setupSmoothScroll();

        } catch (error) {
            console.error('Error rendering blog post:', error);
            document.getElementById('post-content').innerHTML = `
                <p style="color: red;">Error loading blog post. Please try again later.</p>
            `;
        }
    }

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Export for use in blog post pages
window.BlogRenderer = BlogRenderer;
