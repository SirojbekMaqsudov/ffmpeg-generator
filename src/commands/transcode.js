import {program} from "../../bin/index.js";
import * as fs from "node:fs";
import path from "path";
import Video from "../core/video.js";

program
  .command('transcode')
  .description('Transcode a video file to different qualities')

  .argument('<input>', 'Input video file path')
  .argument('<output>', 'Output directory path')
  .option('-l, --logo <path>', 'Path to logo file')
  .option('-s, --speed <speed>', 'FFmpeg preset speed: (placebo, slow, medium, fast, faster, veryfast, superfast, ultrafast)', 'veryfast')
  .option('-t, --time <time>', 'FFmpeg segment time in seconds', '6')
  .option('--exo', 'Customized for Mobile (Exo Player)', false)
  .action(transcode)


function transcode(input, output, options) {
  const {logo, speed, time, exo} = options;

  if (!input) {
    console.error('❌ You forgot the video file path');
    process.exit(1);
  }

  if (!output) {
    console.error('❌ You forgot the output directory path');
    process.exit(1);
  }

  if (!fs.existsSync(output)) fs.mkdirSync(output, {recursive: true});

  if (!fs.existsSync(input)) {
    console.error(`❌ Input file does not exist: ${input}`);
    process.exit(1);
  }

  const supportedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm'];
  if (!supportedExtensions.includes(path.extname(input).toLowerCase())) {
    console.error(`❌ Unsupported file format: ${path.extname(input)}`);
    process.exit(1);
  }

  const video = new Video(input, output);

  const {audios, videos} = video;

}