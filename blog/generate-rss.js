#!/usr/bin/env node

/**
 * RSS Feed Generator for Blog
 * Run this script with Node.js to regenerate feed.xml whenever you add new blog posts
 *
 * Usage: node generate-rss.js
 */

const fs = require('fs');
const path = require('path');

// Load blog configuration
const blogConfig = require('./blog-config.js');

/**
 * Format date to RFC 822 format for RSS
 */
function formatRFC822Date(dateString) {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getUTCDay()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayName}, ${day} ${month} ${year} 00:00:00 +0000`;
}

/**
 * Escape XML special characters
 */
function escapeXML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Generate RSS feed
 */
function generateRSS() {
    const { siteTitle, blogUrl, description, author, blogPosts, rss } = blogConfig;

    // Sort posts by date (newest first)
    const sortedPosts = blogPosts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, rss.itemCount);

    // Get current date for lastBuildDate
    const now = new Date();
    const lastBuildDate = formatRFC822Date(now.toISOString());

    // Build RSS XML
    let rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXML(siteTitle)}</title>
    <description>${escapeXML(description)}</description>
    <link>${blogUrl}</link>
    <atom:link href="${blogUrl}${rss.feedPath}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
`;

    // Add items
    sortedPosts.forEach(post => {
        const postUrl = `${blogUrl}${post.id}.html`;
        const pubDate = formatRFC822Date(post.date);

        rssXML += `
    <item>
      <title>${escapeXML(post.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXML(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${postUrl}</guid>`;

        // Add categories (tags)
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
                rssXML += `
      <category>${escapeXML(tag)}</category>`;
            });
        }

        rssXML += `
    </item>
`;
    });

    rssXML += `
  </channel>
</rss>`;

    return rssXML;
}

/**
 * Main function
 */
function main() {
    try {
        console.log('Generating RSS feed...');

        const rssContent = generateRSS();
        const outputPath = path.join(__dirname, 'feed.xml');

        fs.writeFileSync(outputPath, rssContent, 'utf8');

        console.log(`✓ RSS feed generated successfully: ${outputPath}`);
        console.log(`  Total items: ${blogConfig.blogPosts.length}`);
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateRSS, formatRFC822Date, escapeXML };
