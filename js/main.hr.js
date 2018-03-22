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
function enableNoiseAnimation(start) {
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
var animationDelay = 3200;
var flickerInterval = 500;
var tickerAnimationTimer = null;
var wobbleAnimationTimer = null;
var flickerAnimationTimer = null;

// Clears the given timer
function clearTimer(timer) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

// Returns given element or null
function getElement(elementId) {
  return document.getElementById(elementId);
}

// Add or remove the given class to an element 
function addClassToElement(className, elementId, add) {
  var element = getElement(elementId);
  if (element !== null) {
    if (add) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
}

// Called after page load
function onLoad() {
  startAnimations(animationDelay);
}

// Start ticker, noise & wobble animations
function startAnimations(animationDelay) {
  tickerAnimationTimer = setTimeout(function () { enableTickerAnimation(true); }, animationDelay);
  wobbleAnimationTimer = setTimeout(function () { enableWobbleAnimation(true); }, animationDelay);
  flickerAnimationTimer = setTimeout(function () { startFlickerAnimation(); }, animationDelay);
}

// Toggle the animation of the tickerText
function enableTickerAnimation(start) {
  addClassToElement("tickerMove", "tickerText", start);
  showNewsTicker(start);
}

// Show/hide tickerText (toggle color)
function showNewsTicker(visible) {
  var element = getElement("tickerText");
  if (element !== null) {
    if (visible) {
      element.style.color = "white";
    } else {
      element.style.color = "black";
    }
  }
}

// Add the wobble class to content
function enableWobbleAnimation(start) {
  addClassToElement("wobble", "content", start);
}

// Start the flickering animation (random start/stop noise animation)
function startFlickerAnimation() {
  enableNoiseAnimation(true);
  flickerAnimationTimer = setTimeout(function () { restartFlickerAnimation(); }, Math.random() * flickerInterval);
}

// Stops and restarts flickering noise animation after random timeout
function restartFlickerAnimation() {
  stopFlickerAnimation();
  flickerAnimationTimer = setTimeout(function () { startFlickerAnimation(); }, Math.random() * flickerInterval);
}

// Stop the flickering noise animation
function stopFlickerAnimation() {
  clearTimer(flickerAnimationTimer);
  enableNoiseAnimation(false);
}

// Stop the ticker animation
function stopTickerAnimation() {
  clearTimer(tickerAnimationTimer);
  enableTickerAnimation(false);
}

// Stop the wobble animation
function stopWobbleAnimation() {
  clearTimer(wobbleAnimationTimer);
  enableWobbleAnimation(false);
}

// Stop noise, wobble & ticker animations
function stopAnimations() {
  stopFlickerAnimation();
  stopWobbleAnimation();
  stopTickerAnimation();
}

// Callback onClick for turnaround-container
function onTurnaroundContainerClicked() {
  toggleAudioStreamPlayback();
}

// Toggle audio stream playback & toggle UI
function toggleAudioStreamPlayback() {
  var myAudio = getElement("mp3");
  if (myAudio !== null) {
    if (myAudio.paused) {
      myAudio.play();
      myAudio.addEventListener('ended', function () {
        toggleAudioUiState(true);
        myAudio.pause();
      });
    } else {
      myAudio.pause();
    }
    toggleAudioUiState(myAudio.paused);
  }
}

// Toggle the audio buttons, ticker visibility & animations
function toggleAudioUiState(audioPaused) {
  toggleAudioPlayButtons(audioPaused);
  if (audioPaused) {
    startAnimations(animationDelay);
  } else {
    stopAnimations();
  }
  stopLogoZoomLoop(audioPaused);
  stopLogoRotation(audioPaused);
}

// Toggle audio play / pause button image
function toggleAudioPlayButtons(audioPaused) {
  var element = getElement("audioButton");
  if (element !== null) {
    if (audioPaused) {
      element.style.backgroundImage = "url(img/play.svg)";
    } else {
      element.style.backgroundImage = "url(img/pause.svg)";
    }
  }
}

// Remove the zoomLoop class from logo
function stopLogoZoomLoop(stop) {
  addClassToElement("zoomLoop", "logo", !stop);
}

// Remove the rotateY360 class from turnaroundLogo
function stopLogoRotation(stop) {
  addClassToElement("rotateY360", "turnaroundLogo", !stop);
}
