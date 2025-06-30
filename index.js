#!/usr/bin/env node

import {Command} from 'commander';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import inquirer from 'inquirer';

const program = new Command();

program
  .name('ffgen')
  .description('CLI to generate and run FFmpeg commands 💻🎬')
  .version('1.0.0');

const qualities = [
  {name: '2160p', width: 3840, height: 2160, bitrate: 8000},
  {name: '1440p', width: 2560, height: 1440, bitrate: 6000},
  {name: '1080p', width: 1920, height: 1080, bitrate: 5000},
  {name: '720p', width: 1280, height: 720, bitrate: 2800},
  {name: '480p', width: 854, height: 480, bitrate: 1400},
  {name: '360p', width: 640, height: 360, bitrate: 800},
];

(async () => {
  // --- args ---
  console.log('1. Arguments')
  const args = process.argv.slice(2);
  const inputFile = args[0];
  let outputDir = args[1];
  const extraDir = args[2];
  console.log('✅')

  console.log('2. Arguments Validation')
  if (!inputFile) {
    console.error('❌ You forgot the video file path');
    process.exit(1);
  }
  if (!outputDir) {
    console.error('❌ You forgot the output directory path');
    process.exit(1);
  }
  console.log('✅')

  // --- paths ---
  console.log('3. Path Building')
  const inputPath = path.resolve(process.cwd(), inputFile);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file does not exist: ${inputPath}`);
    process.exit(1);
  }
  const outputPath = path.resolve(process.cwd(), extraDir ? path.join(outputDir, extraDir) : outputDir);
  const promptOutputFolder = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure output path is correct? ' + outputPath,
      default: false,
    },
  ]);

  if (promptOutputFolder.confirmation) {
    console.log(`Output path confirmed: ${outputPath}`);
  } else {
    console.log('❌ Cancelled by user.');
    process.exit(0);
  }

  if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath, {recursive: true});
  console.log('✅')

  // --- get video res ---
  console.log('4. Getting Video Resolution')
  const getResolution = () => {
    const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`;
    const output = execSync(cmd).toString().trim();
    const [width, height] = output.split('x').map(Number);
    console.log(`Video resolution: ${width}x${height}`);
    return {width, height};
  };
  getResolution();
  console.log('✅')

  // --- get audio index ---
  console.log('4. Getting Audio Index')
  const getAudioIndex = () => {
    const cmd = `ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "${inputPath}"`;
    const output = execSync(cmd).toString().trim();
    if (!output) {
      console.error('❌ No audio stream found in the input file');
      process.exit(1);
    }

    console.log(`Audio index: ${output}`);
    return Number(output.split('\n')[0]);
  };
  getAudioIndex();
  console.log('✅')

  // --- generate ---
  console.log('\nGenerating FFmpeg Command')

  function generate(resolution, audioIndex) {
    const validQualities = qualities.filter(
      (q) => q.width <= resolution.width && q.height <= resolution.height
    );
    console.log(`Available qualities: ${validQualities.map(q => q.name).join(', ')}`);

    const splitCount = validQualities.length;
    const filterInputs = `[0:v]split=${splitCount}${validQualities.map((_, i) => `[v${i + 1}]`).join('')};`;

    const scaledFilters = validQualities
      .map((q, i) => `[v${i + 1}]scale=${q.width}x${q.height}[vout${i + 1}]`)
      .join(';');

    const filterComplex = `${filterInputs} ${scaledFilters}`;

    const outputCmds = validQualities.map((q, i) => {
      return `-map "[vout${i + 1}]" -map 0:${audioIndex} -preset veryfast -c:v:${i} libx264 -b:v:${i} ${q.bitrate}k -c:a:${i} aac`;
    });

    const streamMap = validQualities.map((_, i) => `v:${i},a:${i}`).join(' ');

    const cmd = `ffmpeg -i "${inputPath}" -filter_complex "${filterComplex}" ${outputCmds.join(' ')} -var_stream_map "${streamMap}" -master_pl_name "master.m3u8" -f hls -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${outputPath}/%v/chunk_%03d.ts" "${outputPath}/%v/playlist.m3u8"`;

    console.log('\nFFMPEG Command: \n');
    console.log(cmd);

    const outputFilePath = path.join(outputPath, 'master.m3u8');
    return outputFilePath;
  }

  try {
    const file = generate(getResolution(), getAudioIndex());

    console.log('\n✅ FFmpeg command generated successfully \n');

    console.log('File path: ');
    console.log(file);
    console.log('\n')
  } catch (e) {
    console.log('💥 Error:', e.message);
  }
})()