#!/usr/bin/env node

import {Command} from 'commander';
import path from 'path';
import {getResolution} from "../src/core/video.js";
import {getAudioIndex} from "../src/core/audio.js";
import {qualities} from "../src/utils/consts.js";

const program = new Command();

program
    .name('ffgen')
    .description('CLI to generate and run FFmpeg commands 💻🎬')
    .version('1.2.1', '-v, --version', 'Display version information')

    // .argument('<input>', 'input video file (.mp4)')
    // .argument('<output>', 'output folder')
    // .argument('[subfolder]', 'optional subfolder inside output')
    // .option('-l, --logo <path>', 'path to logo file')
    // .option('-s, --speed <speed>',  'FFmpeg preset speed: (placebo, slow, medium, fast, faster, veryfast, superfast, ultrafast)', 'veryfast')
    // .option('-t, --time <time>',  'FFmpeg segment time in seconds', '6')
    // .option('-e, --exo',  'Customized for Mobile Safe (Exo Player)', false)
    // // .option('-seperate',  'Seperate Generation: Audios, Videos, Master File', false)
    // .action(async (...args) => {
    //   const [input, output, extra, options] = args;
    //   const {logo, speed, time, exo} = options;
    //   console.log(options)
    //
    //   console.log('1. Arguments')
    //   if (!input) {
    //     console.error('❌ You forgot the video file path');
    //     process.exit(1);
    //   }
    //   if (!output) {
    //     console.error('❌ You forgot the output directory path');
    //     process.exit(1);
    //   }
    //
    //   if (logo && !fs.existsSync(logo)) {
    //     console.error(`❌ Logo file does not exist: ${logo}`);
    //     process.exit(1);
    //   }
    //
    //   console.log('✅')
    //
    //   // --- paths ---
    //   console.log('2. Path Building')
    //   const inputPath = path.resolve(process.cwd(), input);
    //   if (!fs.existsSync(inputPath)) {
    //     console.error(`❌ Input file does not exist: ${inputPath}`);
    //     process.exit(1);
    //   }
    //
    //   const outputPath = path.resolve(extra ? path.join(output, extra) : output);
    //   const promptOutputFolder = await inquirer.prompt([
    //     {
    //       type: 'confirm',
    //       name: 'confirmation',
    //       message: 'Are you sure output path is correct? ' + outputPath,
    //       default: false,
    //     },
    //   ]);
    //
    //   if (promptOutputFolder.confirmation) {
    //     console.log(`Output path confirmed: ${outputPath}`);
    //   } else {
    //     console.log('❌ Cancelled by user.');
    //     process.exit(0);
    //   }
    //
    //   if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, {recursive: true});
    //   console.log('✅')
    //
    //   try {
    //     console.log('\nGenerating FFmpeg Command')
    //
    //     const file = generate({ logo, speed, time, exo, inputPath, outputPath });
    //
    //     console.log('\n✅ FFmpeg command generated successfully \n');
    //
    //     console.log('File path: ');
    //     console.log(file);
    //     console.log('\n')
    //   } catch (e) {
    //     console.log('💥 Error:', e.message);
    //   }
    // })
    // .helpOption('-h, --help', 'Display help information')
    // .parse();

function generate(options = {}) {
  const {logo, speed, time, exo, inputPath, outputPath} = options;

  const audioIndex = getAudioIndex(inputPath);
  const resolution = getResolution(inputPath);

  const validQualities = qualities.filter(
    (q) => q.width <= resolution.width && q.height <= resolution.height
  );
  console.log(`Available qualities: ${validQualities.map(q => q.name).join(', ')}`);

  const splitCount = validQualities.length;
  let filterInputs = `[0:v]split=${splitCount}${validQualities.map((_, i) => `[v${i + 1}]`).join('')};`;

  const scaledFilters = validQualities
    .map((q, i) => `[v${i + 1}]scale=${q.width}x${q.height}[vs${i + 1}]`)
    .join(';');

  const logoFilter = logo
    ? validQualities
    .map((q, i) => `[1:v]scale=${Math.floor(q.width / 8)}:-1[logo${i + 1}]`)
    .join(';') + ';'
    : '';

  const overlayFilters = logo
    ? validQualities
      .map((_, i) => `[vs${i + 1}][logo${i + 1}]overlay=W-w-25:25[vout${i + 1}]`)
      .join(';')
    : validQualities
      .map((_, i) => `[vs${i + 1}][vout${i + 1}]`)
      .join(';');

  const filterComplex = `${logoFilter} ${filterInputs} ${scaledFilters}; ${overlayFilters}`;

  const outputCmds = validQualities.map((q, i) => {
    const base = `-map "[vout${i + 1}]" -map 0:${audioIndex} -preset ${speed} -c:v:${i} libx264 -b:v:${i} ${q.bitrate}k -c:a:${i} aac`
    const exoPatch = exo ? `-level:v:${i} 3.0 -profile:v:${i} baseline -pix_fmt yuv420p` : '';
    return `${base} ${exoPatch}`;
  });

  const streamMap = validQualities.map((_, i) => `v:${i},a:${i}`).join(' ');

  const cmd = `ffmpeg -i "${inputPath}" ${logo ? `-i "${logo}"` : ''} -filter_complex "${filterComplex}" ${outputCmds.join(' ')} -var_stream_map "${streamMap}" -master_pl_name "master.m3u8" -f hls -hls_time ${time} -hls_playlist_type vod -hls_segment_filename "${outputPath}/%v/chunk_%03d.ts" "${outputPath}/%v/playlist.m3u8"`;

  console.log('\nFFMPEG Command: \n');
  console.log(cmd);

  const outputFilePath = path.join(outputPath, 'master.m3u8');
  return outputFilePath;
}

export {program};