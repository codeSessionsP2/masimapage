var animationDelay = 3200;
var flickerInterval = 500;
var noiseAnimationTimer = null;
var wobbleAnimationTimer = null;
var tickerAnimationTimer = null;

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
  tickerAnimationTimer = setTimeout(function() { startTickerAnimation(true); }, animationDelay);
  wobbleAnimationTimer = setTimeout(function() { startWobbleAnimation(true); }, animationDelay);
  noiseAnimationTimer = setTimeout(function() { startFlickerAnimation(); }, animationDelay);
}

// Toggle the animation of the tickerText
function startTickerAnimation(start) {
  addClassToElement("tickerMove", "tickerText", start);
  toggleTickerVisibility(start);
}

// Toggle the visibility of the tickerText (by color)
function toggleTickerVisibility(audioPaused) {
  var element = getElement("tickerText");
  if (element !== null) {
    if (audioPaused) {
      element.style.color = "white";
    } else {
      element.style.color = "black";
    }
  }
}

// Add the wobble class to content
function startWobbleAnimation(start) {
  addClassToElement("wobble", "content", start);
}

// Start the flickering noise animation
function startFlickerAnimation() {
  enableNoiseAnimation(true);
  noiseAnimationTimer = setTimeout(function() { restartFlickerAnimation(); }, Math.random()*flickerInterval);
}

// Stops and restarts flickering noise animation after random timeout
function restartFlickerAnimation() {
  stopNoiseAnimation();
  noiseAnimationTimer = setTimeout(function() { startFlickerAnimation(); }, Math.random()*flickerInterval);
}

// Stop the flickering noise animation
function stopNoiseAnimation() {
  clearTimer(noiseAnimationTimer);
  enableNoiseAnimation(false);
}

// Stop the ticker animation
function stopTickerAnimation() {
  clearTimer(tickerAnimationTimer);
  startTickerAnimation(false);
}

// Stop the wobble animation
function stopWobbleAnimation() {
  clearTimer(wobbleAnimationTimer);
  startWobbleAnimation(false);
}

// Stop noise, wobble & ticker animations
function stopAnimations() {
  stopNoiseAnimation();
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
function toggleAudioUiState( audioPaused ) {
    toggleAudioPlayButtons( audioPaused );
    if( audioPaused ) {
      startAnimations(animationDelay);
    } else {
      stopAnimations();
    }
    stopLogoZoomLoop( audioPaused );
    stopLogoRotation( audioPaused );
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
function stopLogoZoomLoop( stop ) {
  addClassToElement("zoomLoop", "logo", !stop);
}

// Remove the rotateY360 class from turnaroundLogo
function stopLogoRotation( stop ) {
  addClassToElement("rotateY360", "turnaroundLogo", !stop);
}
