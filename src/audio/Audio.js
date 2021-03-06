/**
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

import { Object3D } from "../core/Object3D.js";

// Audio继承自Object3D对象，注意Audio对象所有方法都是对listener.context对象方法的封装
// 因此listener.context才是最关键的部分
function Audio(listener) {
  Object3D.call(this);

  this.type = "Audio";

  // 这一行很关键，说明真正控制音频播放的还是开发者传入的音频对象
  this.context = listener.context;

  // 音频的增益功能
  this.gain = this.context.createGain();

  // 音频数据源与控制对象的增益链接
  this.gain.connect(listener.getInput());

  this.autoplay = false;

  this.buffer = null;
  this.loop = false;
  this.startTime = 0;
  this.offset = 0;
  this.playbackRate = 1;
  this.isPlaying = false;
  this.hasPlaybackControl = true;
  this.sourceType = "empty";

  this.filters = [];
}

Audio.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Audio,

  getOutput: function() {
    return this.gain;
  },

  // 在DOM上设置节点，该节点容器用于音频功能
  setNodeSource: function(audioNode) {
    this.hasPlaybackControl = false;
    this.sourceType = "audioNode";
    this.source = audioNode;
    this.connect();

    return this;
  },

  // 音频的缓冲
  setBuffer: function(audioBuffer) {
    this.buffer = audioBuffer;
    this.sourceType = "buffer";

    if (this.autoplay) this.play();

    return this;
  },

  play: function() {
    if (this.isPlaying === true) {
      console.warn("THREE.Audio: Audio is already playing.");
      return;
    }

    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }

    var source = this.context.createBufferSource();

    source.buffer = this.buffer;
    source.loop = this.loop;
    source.onended = this.onEnded.bind(this);
    source.playbackRate.setValueAtTime(this.playbackRate, this.startTime);
    this.startTime = this.context.currentTime;
    source.start(this.startTime, this.offset);

    this.isPlaying = true;

    this.source = source;

    return this.connect();
  },

  // 音频暂停
  pause: function() {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }

    if (this.isPlaying === true) {
      this.source.stop();
      this.offset +=
        (this.context.currentTime - this.startTime) * this.playbackRate;
      this.isPlaying = false;
    }

    return this;
  },

  // 暂停功能下的停止
  stop: function() {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }

    this.source.stop();
    this.offset = 0;
    this.isPlaying = false;

    return this;
  },

  // 音频源到播放之间的一些filter中间件
  connect: function() {
    if (this.filters.length > 0) {
      this.source.connect(this.filters[0]);

      for (var i = 1, l = this.filters.length; i < l; i++) {
        this.filters[i - 1].connect(this.filters[i]);
      }

      this.filters[this.filters.length - 1].connect(this.getOutput());
    } else {
      this.source.connect(this.getOutput());
    }

    return this;
  },

  disconnect: function() {
    if (this.filters.length > 0) {
      this.source.disconnect(this.filters[0]);

      for (var i = 1, l = this.filters.length; i < l; i++) {
        this.filters[i - 1].disconnect(this.filters[i]);
      }

      this.filters[this.filters.length - 1].disconnect(this.getOutput());
    } else {
      this.source.disconnect(this.getOutput());
    }

    return this;
  },

  getFilters: function() {
    return this.filters;
  },

  setFilters: function(value) {
    if (!value) value = [];

    if (this.isPlaying === true) {
      this.disconnect();
      this.filters = value;
      this.connect();
    } else {
      this.filters = value;
    }

    return this;
  },

  getFilter: function() {
    return this.getFilters()[0];
  },

  setFilter: function(filter) {
    return this.setFilters(filter ? [filter] : []);
  },

  // 设置重放进度
  setPlaybackRate: function(value) {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }

    this.playbackRate = value;

    if (this.isPlaying === true) {
      this.source.playbackRate.setValueAtTime(
        this.playbackRate,
        this.context.currentTime
      );
    }

    return this;
  },

  getPlaybackRate: function() {
    return this.playbackRate;
  },

  onEnded: function() {
    this.isPlaying = false;
  },

  getLoop: function() {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return false;
    }

    return this.loop;
  },

  // 设置循环播放
  setLoop: function(value) {
    if (this.hasPlaybackControl === false) {
      console.warn("THREE.Audio: this Audio has no playback control.");
      return;
    }

    this.loop = value;

    if (this.isPlaying === true) {
      this.source.loop = this.loop;
    }

    return this;
  },

  // 音量
  getVolume: function() {
    return this.gain.gain.value;
  },

  setVolume: function(value) {
    this.gain.gain.value = value;

    return this;
  }
});

export { Audio };
