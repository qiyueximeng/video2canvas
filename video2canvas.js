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
  var requestAnimationFrame = window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.msRequestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame
    || window.webkitCancelAnimationFrame
    || window.mozCancelAnimationFrame
    || window.msCancelAnimationFrame
    || window.webkitCancelRequestAnimationFrame
    || window.mozCancelRequestAnimationFrame;
  

  function createCanvas(elm) {
    var w = elm.offsetWidth || elm.parentNode.offsetWidth || document.documentElement.clientWidth;
    var h = elm.offsetHeight || elm.parentNode.offsetHeight || document.documentElement.clientHeight;
    canvas = document.createElement('canvas');
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx = canvas.getContext('2d');
  }

  function initVideo(elm) {
    newVideo = elm.cloneNode(false);
    newVideo.addEventListener('play', draw, false);
    newVideo.addEventListener('pause', stopDraw, false);
    newVideo.addEventListener('ended', stopDraw, false);
    elm.parentNode.replaceChild(canvas, elm);
  }

  function draw() {
    ctx.drawImage(newVideo, 0, 0, canvas.width, canvas.height);
    timer = requestAnimationFrame(draw);
  }

  function stopDraw() {
    cancelAnimationFrame(timer);
  }

  function VideoToCanvas(videoElm) {
    if(!videoElm || videoElm.nodeType !== 1) {
      console.error('params error', '请传入 video 元素');
      return;
    }
    createCanvas(videoElm);
    initVideo(videoElm);
  }

  VideoToCanvas.prototype.play = function() {
    console.log('play');
    newVideo.play();
  };

  VideoToCanvas.prototype.pause = function() {
    newVideo.pause();
  };

  VideoToCanvas.prototype.target = function() {
    if (newVideo.paused) {
      this.play();
    } else {
      this.pause();
    }
  };

  return VideoToCanvas;
})))