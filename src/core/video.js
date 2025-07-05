import {getAudioIndex, getAudioStreams, getDuration, getResolution, getResolutions} from "../utils/util.js";

class Video {
  _path;
  _output;

  constructor(path, output) {
    if (!path || !output) {
      throw new Error('Path and output directory are required');
    }

    if (typeof path !== 'string' || typeof output !== 'string') {
      throw new TypeError('Path and output must be strings');
    }

    this._path = path;
    this._output = output;
  };

  get path() {
    return this._path;
  }

  get output() {
    return this._output;
  }

  set output(value) {
    if (!value) {
      throw new Error('Output directory is required');
    }

    if (typeof value !== 'string') {
      throw new TypeError('Output must be a string');
    }

    this._output = value;
  }

  get audio() {
    const audioIndex = getAudioIndex(this._path);
    return audioIndex;
  }

  get audios() {
    const audios = getAudioStreams(this._path);
    return audios;
  }

  get resolution() {
    return getResolution(this._path);
  }

  get resolutions() {
    return getResolutions(this._path);
  }

  get duration() {
    return getDuration(this._path)
  }
}

export default Video;