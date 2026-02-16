// ShowFlix Plugin for SkyStream
// Simplified conversion from CloudStream-Extensions-Phisher

class ShowFlixProvider {
    constructor() {
        this.mainUrl = "https://www.showflix.in";
        this.name = "ShowFlix";
        this.lang = "hi";
        this.supportedTypes = ["Movie", "TvSeries"];
    }

    // Helper function to extract data from script tags
    extractFromScript(html, pattern) {
        const regex = new RegExp(pattern, 'i');
        const match = html.match(regex);
        return match ? match[1] : null;
    }

    // Search for content
    async search(query) {
        try {
            const searchUrl = `${this.mainUrl}/?s=${encodeURIComponent(query)}`;
            const response = await fetch(searchUrl);
            const html = await response.text();
            
            const results = [];
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Parse search results
            const articles = doc.querySelectorAll('article.item');
            for (const article of articles) {
                const link = article.querySelector('a.lnk-blk');
                const img = article.querySelector('img.lazy');
                const title = article.querySelector('.entry-title');
                const type = article.querySelector('.type');
                
                if (link && title) {
                    results.push({
                        name: title.textContent.trim(),
                        url: link.getAttribute('href'),
                        posterUrl: img ? (img.getAttribute('data-src') || img.getAttribute('src')) : null,
                        type: type && type.textContent.includes('TV') ? 'TvSeries' : 'Movie'
                    });
                }
            }
            
            return results;
        } catch (error) {
            console.error('ShowFlix search error:', error);
            return [];
        }
    }

    // Load movie/series details
    async load(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const result = {
                name: doc.querySelector('.entry-title')?.textContent.trim(),
                url: url,
                posterUrl: doc.querySelector('.featured-img img')?.getAttribute('src'),
                backgroundUrl: doc.querySelector('.backdrop img')?.getAttribute('src'),
                plot: doc.querySelector('.entry-content p')?.textContent.trim(),
                rating: doc.querySelector('.rating')?.textContent.trim(),
                year: this.extractYear(doc.querySelector('.year')?.textContent),
                type: doc.querySelector('.type')?.textContent.includes('TV') ? 'TvSeries' : 'Movie'
            };
            
            // Extract additional metadata
            const metaItems = doc.querySelectorAll('.meta-item');
            for (const item of metaItems) {
                const label = item.querySelector('.label')?.textContent.trim();
                const value = item.querySelector('.value')?.textContent.trim();
                
                if (label === 'Genre') result.genres = value?.split(',').map(g => g.trim());
                if (label === 'Duration') result.duration = value;
                if (label === 'Country') result.country = value;
            }
            
            // For TV series, get episodes
            if (result.type === 'TvSeries') {
                result.episodes = await this.getEpisodes(url);
            }
            
            return result;
        } catch (error) {
            console.error('ShowFlix load error:', error);
            return null;
        }
    }

    extractYear(text) {
        if (!text) return null;
        const match = text.match(/\d{4}/);
        return match ? parseInt(match[0]) : null;
    }

    // Get episodes for TV series
    async getEpisodes(seriesUrl) {
        try {
            const response = await fetch(seriesUrl);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const episodes = [];
            const seasonDivs = doc.querySelectorAll('.season-wrapper');
            
            for (const seasonDiv of seasonDivs) {
                const seasonNum = parseInt(seasonDiv.getAttribute('data-season') || '1');
                const episodeItems = seasonDiv.querySelectorAll('.episode-item');
                
                for (const item of episodeItems) {
                    const link = item.querySelector('a');
                    const epNum = item.getAttribute('data-episode');
                    const title = item.querySelector('.episode-title')?.textContent.trim();
                    
                    if (link && epNum) {
                        episodes.push({
                            name: title || `Episode ${epNum}`,
                            season: seasonNum,
                            episode: parseInt(epNum),
                            url: link.getAttribute('href')
                        });
                    }
                }
            }
            
            return episodes;
        } catch (error) {
            console.error('ShowFlix episodes error:', error);
            return [];
        }
    }

    // Load video sources
    async loadLinks(url) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            
            const sources = [];
            
            // Method 1: Look for player data in scripts
            const playerDataMatch = html.match(/playerData\s*=\s*({[^}]+})/);
            if (playerDataMatch) {
                try {
                    const playerData = JSON.parse(playerDataMatch[1]);
                    if (playerData.sources) {
                        for (const source of playerData.sources) {
                            sources.push({
                                url: source.file || source.url,
                                quality: source.label || source.quality || 'Auto',
                                isM3U8: (source.file || source.url).includes('.m3u8')
                            });
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse player data:', e);
                }
            }
            
            // Method 2: Look for direct video sources
            if (sources.length === 0) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const videoElements = doc.querySelectorAll('source, video');
                for (const video of videoElements) {
                    const src = video.getAttribute('src') || video.getAttribute('data-src');
                    if (src && !src.includes('trailer')) {
                        sources.push({
                            url: src,
                            quality: video.getAttribute('data-quality') || 'Auto',
                            isM3U8: src.includes('.m3u8')
                        });
                    }
                }
            }
            
            // Method 3: Look for iframe embeds
            if (sources.length === 0) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                const iframes = doc.querySelectorAll('iframe.player-iframe');
                for (const iframe of iframes) {
                    const src = iframe.getAttribute('src') || iframe.getAttribute('data-src');
                    if (src) {
                        // Fetch iframe content to extract actual video URL
                        const embedSources = await this.extractFromEmbed(src);
                        sources.push(...embedSources);
                    }
                }
            }
            
            return sources;
        } catch (error) {
            console.error('ShowFlix loadLinks error:', error);
            return [];
        }
    }

    // Extract video sources from embed pages
    async extractFromEmbed(embedUrl) {
        try {
            const response = await fetch(embedUrl);
            const html = await response.text();
            
            const sources = [];
            
            // Look for m3u8 URLs
            const m3u8Match = html.match(/(https?:\/\/[^\s"']+\.m3u8[^\s"']*)/g);
            if (m3u8Match) {
                for (const url of m3u8Match) {
                    sources.push({
                        url: url,
                        quality: 'Auto',
                        isM3U8: true
                    });
                }
            }
            
            // Look for mp4 URLs
            const mp4Match = html.match(/(https?:\/\/[^\s"']+\.mp4[^\s"']*)/g);
            if (mp4Match) {
                for (const url of mp4Match) {
                    sources.push({
                        url: url,
                        quality: this.extractQualityFromUrl(url),
                        isM3U8: false
                    });
                }
            }
            
            return sources;
        } catch (error) {
            console.error('ShowFlix embed extraction error:', error);
            return [];
        }
    }

    extractQualityFromUrl(url) {
        const qualities = ['2160p', '1080p', '720p', '480p', '360p'];
        for (const quality of qualities) {
            if (url.toLowerCase().includes(quality)) {
                return quality;
            }
        }
        return 'Unknown';
    }
}

// Export the provider
window.ShowFlixProvider = ShowFlixProvider;
                              
