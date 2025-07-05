import {execSync} from "child_process";
import {qualities} from "./consts.js";

export const getResolution = (inputPath) => {
  const cmd = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${inputPath}"`;
  const output = execSync(cmd).toString().trim();
  const [width, height] = output.split('x').map(Number);
  return {width, height};
};

export const getResolutions = (inputPath) => {
  const resolution = getResolution(inputPath);
  return qualities.filter(q => q.width <= resolution.width && q.height <= resolution.height);
}

export const getDuration = (inputPath) => {
  const cmd = `ffprobe -v error -show_entries format=duration -of csv=p=0 "${inputPath}"`;
  const output = execSync(cmd).toString().trim();
  return parseFloat(output);
}

export const getAudioIndex = (inputPath) => {
  const cmd = `ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "${inputPath}"`;
  const output = execSync(cmd).toString().trim();
  if (!output) {
    console.error('❌ No audio stream found in the input file');
    process.exit(1);
  }

  return Number(output.split('\n')[0]);
};

export const getAudioStreams = (inputPath) => {
  const cmd = `ffprobe -v error -select_streams a -show_entries stream=index,codec_name,codec_type,:stream_tags=language -of json "${inputPath}"`;
  const output = execSync(cmd).toString().trim();

  const audioStreams = JSON.parse(output).streams;
  if (!audioStreams) {
    console.error('❌ No audio streams found in the input file');
    process.exit(1);
  }

  return audioStreams.map(stream => ({
    index: stream.index,
    codec: stream.codec_name,
    type: stream.codec_type,
    language: stream.tags ? stream.tags.language : 'und'
  }));
}