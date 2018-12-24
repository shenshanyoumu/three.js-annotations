/**
 * @author mrdoob / http://mrdoob.com/
 */

var context;

// 用于播放音频的上下文对象，该上下文对象一般由浏览器提供
var AudioContext = {
  getContext: function() {
    if (context === undefined) {
      context = new (window.AudioContext || window.webkitAudioContext)();
    }

    return context;
  },

  setContext: function(value) {
    context = value;
  }
};

export { AudioContext };
