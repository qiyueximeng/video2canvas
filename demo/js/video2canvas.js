/**
 * video 视频转 canvas
 * Author: June
 * Created on Apr 10 2018
 */
(function(win, doc, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory(win, doc)
    : typeof define === 'function' && define.amd
      ? define(function() {factory(win, doc)})
      : (win.VideoToCanvas = factory(win, doc));
}(window, document, (function(win, doc) { 'use strict';
  var canvas,
      ctx,
      newVideo,
      timer = null,
      dpr = win.devicePixelRatio || 1;
  var requestAnimationFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      window.msCancelAnimationFrame ||
      window.webkitCancelRequestAnimationFrame ||
      window.mozCancelRequestAnimationFrame;
  
  /**
   * 初始化画板
   * 
   * @param { Element } elm - 视频元素对象
   */
  function createCanvas(elm) {
    var w = elm.offsetWidth ||
        elm.parentNode.offsetWidth ||
        document.documentElement.clientWidth;
    var h = elm.offsetHeight ||
        elm.parentNode.offsetHeight ||
        document.documentElement.clientHeight;
    canvas = document.createElement('canvas');
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx = canvas.getContext('2d');
  }

  /**
   * 初始化视频配置，并用 canvas 替换 video 元素
   * @param { Element } elm - 视频元素对象
   * @param { Object } that - 构造函数实例对象
   */
  function initVideo(elm, that) {
    newVideo = elm.cloneNode(false);
    
    /**
     * 视频播放事件句柄
     */
    newVideo.addEventListener('play', function draw() {
      ctx.drawImage(newVideo, 0, 0, canvas.width, canvas.height);
      that.fire('playing');
      timer = requestAnimationFrame(draw);
    }, false);
    
    /**
     * 视频暂停事件句柄
     */
    newVideo.addEventListener('pause', function(e) {
      cancelAnimationFrame(timer);
      that.fire('paused');
    }, false);
    
    /**
     * 视频停止事件句柄
     */
    newVideo.addEventListener('ended', function(e) {
      cancelAnimationFrame(timer);
      that.fire('ended');
    }, false);

    elm.parentNode.replaceChild(canvas, elm);
  }

  function VideoToCanvas(videoElm, cb) {
    if(!videoElm || videoElm.nodeType !== 1) throw new Error('请传入 video 元素');

    //自定义事件集合
    this.handlers = {};

    createCanvas(videoElm);
    initVideo(videoElm, this);
  }

  /**
   * 构造函数原型方法
   */
  VideoToCanvas.prototype = {
    constructor: VideoToCanvas,
    /**
     * 播放视频
     */
    play: function() {
      newVideo.play();
    },
    /**
     * 暂停视频
     */
    pause: function() {
      newVideo.pause();
    },
    /**
     * 切换视频播放/暂停状态
     */
    playPause: function() {
      if(newVideo.paused) {
        this.play();
      } else {
        this.pause();
      }
    },
    /**
     * 切换视频源
     * @param { string } src - 新的视频源路径
     */
    changeSource: function(src) {
      if(!utils.matchType(src, 'String')) throw new Error('the param "src" shoud be a string');
      newVideo.src = src;
    },
    /**
     * 销毁画板
     */
    destroy: function() {
      canvas.parentNode.removeChild(canvas);
    },
    /**
     * 添加自定义事件监听
     * @param { string } type - 事件类型
     * @param { Function } handler - 事件处理函数句柄
     */
    addEvent: function(type, handler) {
      if(typeof this.handlers[type] == 'undefined') this.handlers[type] = [];
      this.handlers[type].push(handler);
    },
    /**
     * 事件触发函数
     * @param { string } type - 需要触发的事件类型
     */
    fire: function(type) {
      if(!utils.matchType(this.handlers[type], 'Array')) {
        return false;
      }
      this.handlers[type].forEach(function(item) {
        item();
      });
    }
  }


  // 工具函数对象
  var utils = {
    matchType: function(target, type) {
      return Object.prototype.toString.call(target) === '[object ' + type +']';
    }
  }

  return VideoToCanvas;
})))