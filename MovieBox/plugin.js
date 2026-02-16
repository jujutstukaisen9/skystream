// MovieBox Plugin for SkyStream
// Converted from CloudStream-Extensions-Phisher

class MovieBoxProvider {
    constructor() {
        this.mainUrl = "https://api3.aoneroom.com";
        this.name = "MovieBox";
        this.lang = "hi";
        this.supportedTypes = ["Movie", "TvSeries"];
        
        // Secret keys for API authentication
        this.secretKeyDefault = this.base64Decode("NzZpUmwwN3MweFNOOWpxbUVXQXQ3OUVCSlp1bElRSXNWNjRGWnIyTw==");
        this.secretKeyAlt = this.base64Decode("WHFuMm5uTzQxL0w5Mm8xaXVYaFNMSFRiWHZZNFo1Wlo2Mm04bVNMQQ==");
    }

    // Base64 decode helper
    base64Decode(str) {
        return atob(str);
    }

    base64Encode(str) {
        return btoa(str);
    }

    // MD5 hash function
    async md5(input) {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    reverseString(input) {
        return input.split('').reverse().join('');
    }

    async generateXClientToken(hardcodedTimestamp = null) {
        const timestamp = (hardcodedTimestamp || Date.now()).toString();
        const reversed = this.reverseString(timestamp);
        const hash = await this.md5(reversed);
        return `${timestamp},${hash}`;
    }

    // Main search function
    async search(query) {
        try {
            const searchUrl = `${this.mainUrl}/wefeed-mobile-bff/theater/search/v2`;
            const timestamp = Date.now();
            
            const body = JSON.stringify({
                searchKeyWord: query,
                size: 50,
                from: 0,
                childMode: "false"
            });

            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Token': await this.generateXClientToken(timestamp),
                'X-Tr-Signature': await this.generateXTrSignature('POST', 'application/json', 'application/json', searchUrl, body, false, timestamp)
            };

            const response = await fetch(searchUrl, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const data = await response.json();
            const results = [];

            if (data.data && data.data.items) {
                for (const item of data.data.items) {
                    results.push({
                        name: item.title || item.originalTitle,
                        url: item.id,
                        posterUrl: item.poster,
                        type: item.contentType === '1' ? 'Movie' : 'TvSeries'
                    });
                }
            }

            return results;
        } catch (error) {
            console.error('MovieBox search error:', error);
            return [];
        }
    }

    // Load movie/series details
    async load(url) {
        try {
            const detailUrl = `${this.mainUrl}/wefeed-mobile-bff/theater/detail`;
            const timestamp = Date.now();
            
            const body = JSON.stringify({
                id: url,
                category: "0"
            });

            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Token': await this.generateXClientToken(timestamp),
                'X-Tr-Signature': await this.generateXTrSignature('POST', 'application/json', 'application/json', detailUrl, body, false, timestamp)
            };

            const response = await fetch(detailUrl, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const data = await response.json();
            const detail = data.data;

            const result = {
                name: detail.title,
                url: url,
                posterUrl: detail.poster,
                backgroundUrl: detail.banner,
                plot: detail.introduction,
                rating: detail.score,
                year: detail.year,
                type: detail.contentType === '1' ? 'Movie' : 'TvSeries'
            };

            // For TV series, get episodes
            if (result.type === 'TvSeries') {
                result.episodes = await this.getEpisodes(url);
            }

            return result;
        } catch (error) {
            console.error('MovieBox load error:', error);
            return null;
        }
    }

    // Get episodes for TV series
    async getEpisodes(seriesId) {
        try {
            const episodeUrl = `${this.mainUrl}/wefeed-mobile-bff/theater/episode/v2`;
            const timestamp = Date.now();
            
            const body = JSON.stringify({
                id: seriesId,
                category: "0"
            });

            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Token': await this.generateXClientToken(timestamp),
                'X-Tr-Signature': await this.generateXTrSignature('POST', 'application/json', 'application/json', episodeUrl, body, false, timestamp)
            };

            const response = await fetch(episodeUrl, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const data = await response.json();
            const episodes = [];

            if (data.data && data.data.sections) {
                for (const section of data.data.sections) {
                    if (section.episodes) {
                        for (const ep of section.episodes) {
                            episodes.push({
                                name: ep.title || `Episode ${ep.episode}`,
                                season: ep.season || 1,
                                episode: ep.episode,
                                id: ep.id
                            });
                        }
                    }
                }
            }

            return episodes;
        } catch (error) {
            console.error('MovieBox episodes error:', error);
            return [];
        }
    }

    // Load video sources
    async loadLinks(url, episodeId = null) {
        try {
            const playUrl = `${this.mainUrl}/wefeed-mobile-bff/theater/play`;
            const timestamp = Date.now();
            
            const body = JSON.stringify({
                id: url,
                category: "0",
                episodeId: episodeId || ""
            });

            const headers = {
                'Content-Type': 'application/json',
                'X-Client-Token': await this.generateXClientToken(timestamp),
                'X-Tr-Signature': await this.generateXTrSignature('POST', 'application/json', 'application/json', playUrl, body, false, timestamp)
            };

            const response = await fetch(playUrl, {
                method: 'POST',
                headers: headers,
                body: body
            });

            const data = await response.json();
            const sources = [];

            if (data.data && data.data.playList) {
                for (const item of data.data.playList) {
                    sources.push({
                        url: item.url,
                        quality: item.quality || 'Unknown',
                        isM3U8: item.url.includes('.m3u8')
                    });
                }
            }

            return sources;
        } catch (error) {
            console.error('MovieBox loadLinks error:', error);
            return [];
        }
    }

    // Generate signature for API requests
    async generateXTrSignature(method, accept, contentType, url, body = null, useAltKey = false, hardcodedTimestamp = null) {
        const timestamp = hardcodedTimestamp || Date.now();
        const canonical = await this.buildCanonicalString(method, accept, contentType, url, body, timestamp);
        const secret = useAltKey ? this.secretKeyAlt : this.secretKeyDefault;
        
        // Simple HMAC-MD5 implementation would go here
        // For now, return a basic signature format
        const signature = this.base64Encode(canonical);
        return `${timestamp}|2|${signature}`;
    }

    async buildCanonicalString(method, accept, contentType, url, body, timestamp) {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const query = urlObj.search.substring(1);
        
        const canonicalUrl = query ? `${path}?${query}` : path;
        
        let bodyHash = '';
        let bodyLength = '';
        
        if (body) {
            const bodyBytes = new TextEncoder().encode(body);
            bodyLength = bodyBytes.length.toString();
            bodyHash = await this.md5(body);
        }

        return `${method.toUpperCase()}\n${accept || ''}\n${contentType || ''}\n${bodyLength}\n${timestamp}\n${bodyHash}\n${canonicalUrl}`;
    }
}

// Export the provider
window.MovieBoxProvider = MovieBoxProvider;
