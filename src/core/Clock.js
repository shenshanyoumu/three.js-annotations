//  时钟对象，记录时间的开始与流逝;在渲染性能分析和动画中使用
function Clock(autoStart) {
  this.autoStart = autoStart !== undefined ? autoStart : true;

  this.startTime = 0;
  this.oldTime = 0;
  this.elapsedTime = 0;

  this.running = false;
}

Object.assign(Clock.prototype, {
  start: function() {
    // W3C的performance规范比Date精度更高
    this.startTime = (typeof performance === "undefined"
      ? Date
      : performance
    ).now(); // see #10732

    this.oldTime = this.startTime;
    this.elapsedTime = 0;
    this.running = true;
  },

  stop: function() {
    this.getElapsedTime();
    this.running = false;
    this.autoStart = false;
  },

  getElapsedTime: function() {
    this.getDelta();
    return this.elapsedTime;
  },

  getDelta: function() {
    var diff = 0;

    if (this.autoStart && !this.running) {
      this.start();
      return 0;
    }

    if (this.running) {
      var newTime = (typeof performance === "undefined"
        ? Date
        : performance
      ).now();

      diff = (newTime - this.oldTime) / 1000;
      this.oldTime = newTime;

      // 从开始计时起，保存时间的流逝片段
      this.elapsedTime += diff;
    }

    return diff;
  }
});

export { Clock };
