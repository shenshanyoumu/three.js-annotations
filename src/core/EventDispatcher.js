/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

//  事件触发器
function EventDispatcher() {}

Object.assign(EventDispatcher.prototype, {
  // 在给定事件类型上添加事件处理器
  addEventListener: function(type, listener) {
    if (this._listeners === undefined) this._listeners = {};

    var listeners = this._listeners;

    if (listeners[type] === undefined) {
      listeners[type] = [];
    }

    if (listeners[type].indexOf(listener) === -1) {
      listeners[type].push(listener);
    }
  },

  // 判断事件触发器是否含有特定事件类型和对应的监听器
  hasEventListener: function(type, listener) {
    if (this._listeners === undefined) return false;

    var listeners = this._listeners;

    return (
      listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1
    );
  },

  // 移除事件监听器
  removeEventListener: function(type, listener) {
    if (this._listeners === undefined) return;

    var listeners = this._listeners;
    var listenerArray = listeners[type];

    if (listenerArray !== undefined) {
      var index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  },

  // 触发事件对象，并调用对应的监听器
  dispatchEvent: function(event) {
    if (this._listeners === undefined) return;

    var listeners = this._listeners;
    var listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      var array = listenerArray.slice(0);

      for (var i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }
});

export { EventDispatcher };
