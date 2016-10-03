(function () {
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var ctx;

// Initialize context
function initContext() {
  if (ctx === undefined) {
    ctx = document.getElementById("canvas").getContext("2d");
  }
}

var requestId;

// Start/Stop noise animation 
function startNoiseAnimation(start) {
  if (start) {
    if (!requestId) {
      drawNoiseAnimatedFrame();
    }
  } else {
    if (requestId) {
      clear();
      window.cancelAnimationFrame(requestId);
      requestId = undefined;
    }
  }
}

// Clear out frame
function clear() {
  var w = ctx.canvas.width,
    h = ctx.canvas.height,
    idata = ctx.createImageData(w, h);
  ctx.putImageData(idata, 0, 0);
}

var frame = 0;

// Update animation frames
function drawNoiseAnimatedFrame() {
  initContext();
  frame += 1;
  if (frame % 3) {
    requestId = requestAnimationFrame(drawNoiseAnimatedFrame);
    return;
  }
  noise(ctx);
  requestId = requestAnimationFrame(drawNoiseAnimatedFrame);
}

// Create pixel noise
function noise(ctx) {
  var w = ctx.canvas.width,
    h = ctx.canvas.height,
    idata = ctx.createImageData(w, h),
    buffer32 = new Uint32Array(idata.data.buffer),
    len = buffer32.length,
    run = 0,
    color = 0,
    m = Math.random() * 6 + 4,
    band = Math.random() * 256 * 256,
    p = 0,
    i = 0;

  for (; i < len;) {
    if (run < 0) {
      run = m * Math.random();
      p = Math.pow(Math.random(), 0.25);
      if (i > band && i < band + 48 * 256) {
        p = Math.random();
      }
      color = (255 * p) << 24;
    }
    run -= 1;
    buffer32[i++] = color;
  }
  ctx.putImageData(idata, 0, 0);
}