/**
 * @author mrdoob / http://mrdoob.com/
 */

// 数字资产加载器
function LoadingManager(onLoad, onProgress, onError) {
  var scope = this;

  var isLoading = false;
  var itemsLoaded = 0;
  var itemsTotal = 0;
  var urlModifier = undefined;

  // 加载中的一系列钩子函数
  this.onStart = undefined;
  this.onLoad = onLoad;
  this.onProgress = onProgress;
  this.onError = onError;

  this.itemStart = function(url) {
    itemsTotal++;

    if (isLoading === false) {
      if (scope.onStart !== undefined) {
        scope.onStart(url, itemsLoaded, itemsTotal);
      }
    }

    isLoading = true;
  };

  // 加载多个资源文件时显示进度信息
  this.itemEnd = function(url) {
    itemsLoaded++;

    if (scope.onProgress !== undefined) {
      scope.onProgress(url, itemsLoaded, itemsTotal);
    }

    // 对于总共需要加载的文件和已经加载完成的文件数目
    if (itemsLoaded === itemsTotal) {
      isLoading = false;

      if (scope.onLoad !== undefined) {
        scope.onLoad();
      }
    }
  };

  this.itemError = function(url) {
    if (scope.onError !== undefined) {
      scope.onError(url);
    }
  };

  this.resolveURL = function(url) {
    if (urlModifier) {
      return urlModifier(url);
    }

    return url;
  };

  this.setURLModifier = function(transform) {
    urlModifier = transform;
    return this;
  };
}

var DefaultLoadingManager = new LoadingManager();

export { DefaultLoadingManager, LoadingManager };
