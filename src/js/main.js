var animationDelay = 3200;
var flickerInterval = 500;
var noiseAnimationTimer = null;
var wobbleAnimationTimer = null;
var tickerAnimationTimer = null;

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
function startTickerAnimation( start ) {
  if( start ) {
    document.getElementById("tickerText").classList.add("tickerMove");
  } else {
    document.getElementById("tickerText").classList.remove("tickerMove");
  }
  toggleTickerVisibility( start );
}

// Toggle the visibility of the tickerText (by color)
function toggleTickerVisibility( audioPaused ) {
  if( audioPaused ) {
    document.getElementById("tickerText").style.color = "white";
  } else {
    document.getElementById("tickerText").style.color = "black";
  }
}

// Add the wobble class to content
function startWobbleAnimation( start ) {
  if( start ) {
    document.getElementById("content").classList.add("wobble");
  } else {
    document.getElementById("content").classList.remove("wobble");    
  }
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
  if (noiseAnimationTimer) {
    clearTimeout(noiseAnimationTimer);
    noiseAnimationTimer = null;
  }
  enableNoiseAnimation(false);
}

// Stop the ticker animation
function stopTickerAnimation() {
  if (tickerAnimationTimer) {
    clearTimeout(tickerAnimationTimer);
    tickerAnimationTimer = null;
  }
  startTickerAnimation(false);
}

// Stop the wobble animation
function stopWobbleAnimation() {
  if (wobbleAnimationTimer) {
    clearTimeout(wobbleAnimationTimer);
    wobbleAnimationTimer = null;
  }
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
  var myAudio = document.getElementById("mp3");
  if( myAudio.paused ) {
      myAudio.play();
      myAudio.addEventListener('ended', function() {
        toggleAudioUiState( true );
        myAudio.pause();
      });
  } else {
    myAudio.pause();
  }
  toggleAudioUiState( myAudio.paused );
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
function toggleAudioPlayButtons( audioPaused ) {
  if( audioPaused ) {
    document.getElementById("audioButton").style.backgroundImage = "url(img/play.svg)";
  } else {
    document.getElementById("audioButton").style.backgroundImage = "url(img/pause.svg)";
  }
}

// Remove the zoomLoop class from logo
function stopLogoZoomLoop( stop ) {
  if( stop ) {
    document.getElementById("logo").classList.remove("zoomLoop");        
  } else {   
    document.getElementById("logo").classList.add("zoomLoop");
  }
}

// Remove the rotateY360 class from turnaroundLogo
function stopLogoRotation( stop ) {
  if( stop ) {
    document.getElementById("turnaroundLogo").classList.remove("rotateY360");
  } else {
    document.getElementById("turnaroundLogo").classList.add("rotateY360");
  }
}
