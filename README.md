<h1 align="center">🎬 ffmpeg-generator</h1>
<p align="center">CLI to auto-generate high-quality FFmpeg HLS commands with zero brain power 🧠⚡</p>
<p align="center">
  <img src="https://img.shields.io/npm/v/ffmpeg-generator?color=blue" />
  <img src="https://img.shields.io/npm/dw/ffmpeg-generator?color=green" />
  <img src="https://img.shields.io/badge/ffmpeg-powered-ff0000?logo=ffmpeg&logoColor=white" />
</p>

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

```bash
ffgen input.mp4 output-folder-path
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

---
Made with ☕, bugs, and ffmpeg rage by [Sirojbek](https://github.com/sirojbek), Smash that ⭐ on [GitHub](https://github.com/SirojbekMaqsudov/ffmpeg-generator)

> Devs who know, know.