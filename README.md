# 🎬 ffmpeg-generator — FFmpeg Command Generator CLI

> Scoped as: `ffmpeg-generator`  
> Author: [Sirojbek](https://github.com/sirojbek)  
> Version: `1.0.5`  
> License: MIT

## ⚡ What is `ffmpeg-generator`?

`ffmpeg-generator` is a fast, developer-friendly CLI tool to **generate and run complex FFmpeg commands** for HLS transcoding. It auto-scales videos to multiple resolutions, handles audio streams, and outputs a fully functional `master.m3u8` playlist — ready for streaming 🚀

---

## ✨ Features

- 📦 Converts `.mp4` to multi-quality `.m3u8` (HLS)
- 🔍 Auto-detects video resolution & audio index
- 📂 Smart directory structure with confirmation prompts
- 🧠 Built-in presets for:
    - 2160p, 1440p, 1080p, 720p, 480p, 360p
- 🧪 Built-in `ffprobe` checks before processing
- 💬 Interactive CLI with `inquirer`
- ☁️ Perfect for streaming servers, encoding queues, media tools

---

## 🧑‍💻 Installation

❗ Warning: Make sure you have [ffmpeg](https://ffmpeg.org/) installed and available in your PATH.

```bash
npm install -g ffmpeg-generator
```

### 🚀 Usage

![usage](https://files.catbox.moe/t1m336.gif)

```
ffgen <input-file> <output-dir> [optional-subfolder]
```

### ❓ FAQ

Q: Do I need FFmpeg installed?
A: Yes, both ffmpeg and ffprobe must be in your PATH.

Q: Is it open-source?
A: MIT license. Steal it. Fork it. Build on it.

### 🧠 Author

Built with ❤️ by @sirojbek

“If you manually write FFmpeg commands in 2025…
you need this CLI and a vacation 😭”

### 📜 License

MIT © 2025
Feel free to remix, extend, or publish your own variant.

### Contact
Linked In: [sirojbekmaqsudov](https://www.linkedin.com/in/sirojbek/)  
GitHub: [SirojbekMaqsudov](https://github.com/SirojbekMaqsudov/ffmpeg-generator)