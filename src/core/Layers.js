// 图层对象。mask属性指示是否遮罩
function Layers() {
  this.mask = 1 | 0;
}

// 图层采样多通道技术来实现
Object.assign(Layers.prototype, {
  set: function(channel) {
    this.mask = (1 << channel) | 0;
  },

  enable: function(channel) {
    this.mask |= (1 << channel) | 0;
  },

  // 交换层
  toggle: function(channel) {
    this.mask ^= (1 << channel) | 0;
  },

  // 禁止某一图层
  disable: function(channel) {
    this.mask &= ~((1 << channel) | 0);
  },

  // 测试某一图层
  test: function(layers) {
    return (this.mask & layers.mask) !== 0;
  }
});

export { Layers };
