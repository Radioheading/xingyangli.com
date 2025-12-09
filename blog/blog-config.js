/**
 * Blog Configuration
 * Central configuration file for all blog posts
 * Add new posts to the blogPosts array
 */

const blogConfig = {
    // Site information
    siteTitle: "Xingyang Li's Blog",
    siteUrl: "https://acm.sjtu.edu.cn/~xyli",
    blogUrl: "https://acm.sjtu.edu.cn/~xyli/blog/",
    author: "Xingyang Li",
    authorEmail: "brucelee_sjtu@sjtu.edu.cn",
    description: "Thoughts on research and life",

    // Blog posts metadata
    blogPosts: [
        {
            id: 'neurips2025',
            title: '[Diary] NeurIPS 游记 (12/01/2025-12/07/2025)',
            date: '2025-12-07',
            excerpt: 'My first experience attending NeurIPS conference in San Diego. Meeting pioneers in video generation, presenting Radial Attention, and reflections on AI research and academic community.',
            tags: ['Conference', 'Travel', 'AI Research', 'Video Generation'],
            file: 'neurips2025.md',
            language: 'zh'
        }
        // Add more blog posts here
        // Example:
        // {
        //     id: 'radial-attention',
        //     title: 'Understanding Radial Attention',
        //     date: '2025-06-15',
        //     excerpt: 'An in-depth explanation of our O(n log n) sparse attention mechanism for video generation.',
        //     tags: ['Research', 'Deep Learning', 'Attention Mechanism'],
        //     file: 'radial-attention.md',
        //     language: 'en'
        // }
    ],

    // RSS feed configuration
    rss: {
        enabled: true,
        itemCount: 20, // Number of items to include in RSS feed
        feedPath: 'feed.xml'
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogConfig;
}
