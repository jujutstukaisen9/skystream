# 🚀 Quick Start Guide - Add MovieBox to SkyStream

## Option 1: JSON Repository Method (Easiest)

### Step 1: Host Your Files on GitHub

1. **Create a new GitHub repository** (e.g., `skystream-phisher-lite`)
2. **Upload these files:**
   ```
   repository.json
   plugins.json
   MovieBox/plugin.js
   MultiMovies/plugin.js
   ```
3. **Make repository public**

### Step 2: Get Your Repository URL

Your repository URL will be:
```
https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/repository.json
```

Example:
```
https://raw.githubusercontent.com/johndoe/skystream-phisher-lite/main/repository.json
```

### Step 3: Add to SkyStream

1. **Open SkyStream app**
2. **Go to Settings or Extensions section**
3. **Look for "Add Repository" or similar option**
4. **Paste your repository.json URL**
5. **Click Add/Install**
6. **Select MovieBox from the list**
7. **Install and enjoy!**

---

## Option 2: Direct Plugin URL (Alternative)

If SkyStream supports direct plugin installation:

**MovieBox Direct Link:**
```
https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/MovieBox/plugin.js
```

**Steps:**
1. Copy the direct plugin URL above
2. In SkyStream, find "Install Plugin from URL"
3. Paste the URL
4. Install

---

## Option 3: Local Installation (For Testing)

### Android:
1. **Copy MovieBox folder** to:
   ```
   /storage/emulated/0/Android/data/com.skystream/files/plugins/com.phisher98.lite/MovieBox/
   ```
2. **Restart SkyStream**

### iOS:
1. **Copy MovieBox folder** using iTunes File Sharing to:
   ```
   SkyStream/Documents/plugins/com.phisher98.lite/MovieBox/
   ```
2. **Restart SkyStream**

---

## 🎬 Using MovieBox

Once installed:

1. **Search for content:**
   - Open SkyStream
   - Go to Search
   - Type movie/series name (e.g., "Avengers")
   - Look for results from "MovieBox" provider

2. **Browse categories:**
   - MovieBox supports Hindi, Tamil, Telugu content
   - Browse Bollywood, Hollywood, South Indian categories
   - Filter by genres

3. **Watch:**
   - Select quality (360p, 480p, 720p, 1080p)
   - Subtitles may be available depending on content
   - Both streaming and download supported

---

## 📱 SkyStream Configuration

### If JSON format isn't working:

Some SkyStream versions might use different formats. Here's an alternative:

**Simple URL List Format (repositories.txt):**
```
MovieBox|https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/MovieBox/plugin.js|1
MultiMovies|https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/MultiMovies/plugin.js|1
```

**Shortcode Format:**
```
skystream://install?url=https://raw.githubusercontent.com/YOUR_USERNAME/skystream-phisher-lite/main/repository.json
```

---

## ✅ Verification

After installation, verify MovieBox is working:

1. **Check installed providers:**
   - Go to SkyStream settings
   - Look for "Installed Extensions"
   - MovieBox should be listed

2. **Test search:**
   - Search for "RRR" or "Pathaan"
   - Results should appear from MovieBox

3. **Check logs:**
   - If issues occur, check SkyStream logs
   - Look for MovieBox-related errors

---

## 🔧 Troubleshooting

### "Repository not found"
- ✅ Check URL is exactly correct (no typos)
- ✅ Ensure repository is PUBLIC on GitHub
- ✅ Verify all files are uploaded
- ✅ Try accessing repository.json in browser first

### "Plugin failed to load"
- ✅ Check JavaScript console for errors
- ✅ Verify plugin.js syntax is correct
- ✅ Ensure no network/CORS issues
- ✅ Try reinstalling the plugin

### "No video sources found"
- ✅ MovieBox API might be down temporarily
- ✅ Check if website is accessible
- ✅ Try different content
- ✅ Update plugin to latest version

---

## 📞 Support

- **Issues with plugin:** Check this repository's issues
- **Issues with SkyStream:** Contact SkyStream support
- **Want to contribute:** See README.md for contribution guide

---

**Happy Streaming! 🎉**
