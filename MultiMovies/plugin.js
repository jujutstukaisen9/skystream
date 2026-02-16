// MultiMovies Plugin for SkyStream
// Simplified conversion from CloudStream-Extensions-Phisher

class MultiMoviesProvider {
    constructor() {
        this.mainUrl = "https://multimovies.space";
        this.name = "MultiMovies";
        this.lang = "hi";
        this.supportedTypes = ["Movie", "TvSeries"];
    }

    // Search for content
    async search(query) {
        try {
            const searchUrl = `${this.mainUrl}/search/${encodeURIComponent(query)}`;
            const response = await fetch(searchUrl);
            const html = await response.text();
            
            const results = [];
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Parse search results
            const items = doc.querySelectorAll('.item');
            for (const item of items) {
                const link = item.querySelector('a');
                const img = item.querySelector('img');
                const title = item.querySelector('.title');
                
                if (link && title) {
                    results.push({
                        name: title.textContent.trim(),
                        url: link.getAttribute('href'),
                        posterUrl: img ? img.getAttribute('src') : null,
                        type: link.getAttribute('href').includes('/series/') ? 'TvSeries' : 'Movie'
                    });
                }
            }
            
            return results;
        } catch (error) {
            console.error('MultiMovies search error:', error);
            return [];
        }
    }

    // Load movie/series details
    async load(url) {
        try {
            const fullUrl = url.startsWith('http') ? url : `${this.mainUrl}${url}`;
            const response = await fetch(fullUrl);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const result = {
                name: doc.querySelector('.title')?.textContent.trim(),
                url: url,
                posterUrl: doc.querySelector('.poster img')?.getAttribute('src'),
                plot: doc.querySelector('.description')?.textContent.trim(),
                type: url.includes('/series/') ? 'TvSeries' : 'Movie'
            };
            
            // For TV series, get episodes
            if (result.type === 'TvSeries') {
                result.episodes = this.parseEpisodes(doc);
            }
            
            return result;
        } catch (error) {
            console.error('MultiMovies load error:', error);
            return null;
        }
    }

    // Parse episodes from page
    parseEpisodes(doc) {
        const episodes = [];
        const episodeElements = doc.querySelectorAll('.episode-item');
        
        for (const ep of episodeElements) {
            const link = ep.querySelector('a');
            const epNum = ep.getAttribute('data-episode');
            const season = ep.getAttribute('data-season') || '1';
            
            if (link) {
                episodes.push({
                    name: `Episode ${epNum}`,
                    season: parseInt(season),
                    episode: parseInt(epNum),
                    url: link.getAttribute('href')
                });
            }
        }
        
        return episodes;
    }

    // Load video sources
    async loadLinks(url) {
        try {
            const fullUrl = url.startsWith('http') ? url : `${this.mainUrl}${url}`;
            const response = await fetch(fullUrl);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const sources = [];
            const videoElements = doc.querySelectorAll('.video-source');
            
            for (const video of videoElements) {
                const src = video.getAttribute('data-src') || video.getAttribute('src');
                const quality = video.getAttribute('data-quality') || 'Auto';
                
                if (src) {
                    sources.push({
                        url: src,
                        quality: quality,
                        isM3U8: src.includes('.m3u8')
                    });
                }
            }
            
            // Fallback: look for iframe sources
            if (sources.length === 0) {
                const iframes = doc.querySelectorAll('iframe');
                for (const iframe of iframes) {
                    const src = iframe.getAttribute('src');
                    if (src && !src.includes('facebook') && !src.includes('twitter')) {
                        sources.push({
                            url: src,
                            quality: 'Unknown',
                            isM3U8: false
                        });
                    }
                }
            }
            
            return sources;
        } catch (error) {
            console.error('MultiMovies loadLinks error:', error);
            return [];
        }
    }
}

// Export the provider
window.MultiMoviesProvider = MultiMoviesProvider;
