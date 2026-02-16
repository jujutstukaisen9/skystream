# CloudStream Phisher Extensions → SkyStream Conversion

This repository contains lightweight versions of popular CloudStream extensions converted to work with SkyStream.

## 📦 Converted Extensions

### ✅ Ready to Use:
1. **MovieBox** - Multi-language movies and TV shows with API authentication
2. **MultiMovies** - Multi-quality content provider
3. **ShowFlix** - Movies and series provider

## 🚀 How to Add to SkyStream

### Method 1: Using Repository URL (Recommended)

1. **Open SkyStream App**
2. **Go to Extensions/Settings**
3. **Add Repository**
4. **Paste this URL:**
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/repository.json
   ```
5. **Install desired extensions** from the list

### Method 2: Using Direct Plugin URLs

If SkyStream supports direct plugin installation:

#### MovieBox:
```
https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/MovieBox/plugin.js
```

#### MultiMovies:
```
https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/MultiMovies/plugin.js
```

#### ShowFlix:
```
https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/ShowFlix/plugin.js
```

### Method 3: Manual Installation (Local Files)

1. **Download the plugin folder** (e.g., `MovieBox/`)
2. **Copy to SkyStream's plugin directory:**
   - Android: `/storage/emulated/0/SkyStream/plugins/com.phisher98.lite/`
   - iOS: `Documents/SkyStream/plugins/com.phisher98.lite/`
3. **Restart SkyStream**

## 📋 Repository Structure

```
repository.json          # Main repository manifest
plugins.json            # List of all available plugins
MovieBox/
  └── plugin.js         # MovieBox provider
MultiMovies/
  └── plugin.js         # MultiMovies provider
ShowFlix/
  └── plugin.js         # ShowFlix provider (coming soon)
```

## 🔧 Plugin Format

Each plugin is a JavaScript file that exports a provider class with these methods:

### Required Methods:
- `search(query)` - Search for content
- `load(url)` - Load content details
- `loadLinks(url, episodeId?)` - Get video sources

### Example Usage in Plugin:
```javascript
class MovieBoxProvider {
    async search(query) {
        // Return array of search results
        return [{
            name: "Movie Name",
            url: "/movie/123",
            posterUrl: "https://...",
            type: "Movie"
        }];
    }
    
    async load(url) {
        // Return content details
        return {
            name: "Movie Name",
            url: url,
            posterUrl: "https://...",
            plot: "Description...",
            type: "Movie",
            episodes: [] // For TV series
        };
    }
    
    async loadLinks(url, episodeId) {
        // Return video sources
        return [{
            url: "https://video.m3u8",
            quality: "1080p",
            isM3U8: true
        }];
    }
}
```

## 📝 Repository JSON Format

```json
{
  "name": "Your Repository Name",
  "id": "com.yourname.repo",
  "description": "Repository description",
  "manifestVersion": 1,
  "iconUrl": "https://your-icon-url.png",
  "pluginLists": [
    "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/plugins.json"
  ]
}
```

## 📝 Plugin Metadata Format (plugins.json)

```json
[
  {
    "id": "com.phisher98.lite.moviebox",
    "name": "MovieBox",
    "internalName": "MovieBox",
    "url": "https://...../plugin.js",
    "version": 1,
    "status": 1,
    "iconUrl": "https://...../icon.png",
    "authors": ["Author Name"],
    "description": "Plugin description",
    "tvTypes": ["Movie", "TvSeries"],
    "language": "hi",
    "fileSize": 12500
  }
]
```

### Plugin Metadata Fields:
- `id`: Unique identifier (e.g., "com.phisher98.lite.moviebox")
- `name`: Display name
- `internalName`: Internal class name
- `url`: Direct URL to plugin.js file
- `version`: Version number (increment on updates)
- `status`: 0=Down, 1=OK, 2=Slow, 3=Beta
- `iconUrl`: Plugin icon URL
- `authors`: Array of author names
- `description`: Short description
- `tvTypes`: ["Movie", "TvSeries", "Anime", etc.]
- `language`: Language code (e.g., "hi", "en", "es")
- `fileSize`: File size in bytes

## 🔐 Authentication (MovieBox Example)

MovieBox uses HMAC-MD5 signatures for API authentication. The conversion includes:
- X-Client-Token generation
- X-Tr-Signature HMAC signing
- Timestamp-based request signing

## ⚠️ Important Notes

1. **GitHub Hosting**: Upload these files to your GitHub repository and update all `YOUR_USERNAME` placeholders
2. **CORS Issues**: Some providers may have CORS restrictions. SkyStream should handle this
3. **API Changes**: Original CloudStream providers may update. Keep plugins synchronized
4. **Testing**: Test each plugin thoroughly before public release
5. **Rate Limiting**: Be respectful of API rate limits

## 🛠️ Customization

### To Add More Extensions:

1. **Convert Kotlin to JavaScript:**
   - Analyze the CloudStream provider (`.kt` file)
   - Identify main methods: search, load, loadLinks
   - Convert HTTP requests to `fetch()` API
   - Convert Jsoup parsing to `DOMParser` or regex

2. **Create Plugin File:**
   ```javascript
   class YourProvider {
       constructor() {
           this.mainUrl = "https://...";
           this.name = "Provider Name";
       }
       
       async search(query) { /* ... */ }
       async load(url) { /* ... */ }
       async loadLinks(url) { /* ... */ }
   }
   
   window.YourProvider = YourProvider;
   ```

3. **Add to plugins.json:**
   ```json
   {
       "id": "com.phisher98.lite.yourprovider",
       "name": "Your Provider",
       "url": "https://.../plugin.js",
       ...
   }
   ```

## 📚 Conversion Notes

### Key Differences CloudStream vs SkyStream:

| Feature | CloudStream (Kotlin) | SkyStream (JavaScript) |
|---------|---------------------|------------------------|
| Language | Kotlin | JavaScript |
| HTTP | OkHttp | Fetch API |
| HTML Parsing | Jsoup | DOMParser |
| Async | Coroutines | async/await |
| Crypto | Java Crypto | Web Crypto API |
| Format | APK | JS Plugin |

### Common Conversion Patterns:

**CloudStream (Kotlin):**
```kotlin
val doc = app.get(url).document
val title = doc.selectFirst(".title")?.text()
```

**SkyStream (JavaScript):**
```javascript
const response = await fetch(url);
const html = await response.text();
const doc = new DOMParser().parseFromString(html, 'text/html');
const title = doc.querySelector('.title')?.textContent;
```

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/NewProvider`)
3. Commit your changes (`git commit -am 'Add NewProvider'`)
4. Push to the branch (`git push origin feature/NewProvider`)
5. Create a Pull Request

## 📄 License

These conversions are based on the original CloudStream-Extensions-Phisher repository.
Original work by Phisher98 and contributors.

## 🙏 Credits

- **Original CloudStream Extensions**: [Phisher98](https://github.com/phisher98/cloudstream-extensions-phisher)
- **SkyStream**: The SkyStream development team
- **Conversion**: Created for educational purposes

## ⚠️ Disclaimer

This repository is for educational purposes. Users are responsible for complying with their local laws and the terms of service of the content providers.

---

## 🆘 Troubleshooting

### Plugin Not Showing Up:
1. Check repository URL is correct
2. Ensure plugins.json is accessible
3. Verify JSON syntax is valid
4. Clear SkyStream cache

### Video Not Playing:
1. Check if source URL is valid
2. Verify CORS isn't blocking requests
3. Test in browser console first
4. Check SkyStream logs

### Search Returns No Results:
1. Verify API endpoint is correct
2. Check if website changed structure
3. Test search URL directly in browser
4. Update scraping logic if needed

---

**Need Help?** Open an issue in this repository or check SkyStream's official documentation.
