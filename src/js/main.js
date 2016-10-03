var delayTime = 3200;
var noiseAnimationTimer = null;
var tickerAnimationTimer = null;

// Called after page load
function onLoad() {
  startAnimations(delayTime);
}

// Start noise & ticker animations
function startAnimations(delayTime) {
  noiseAnimationTimer = setTimeout(function() { startNoiseAnimation(true); }, delayTime*3);
  tickerAnimationTimer = setTimeout(function() { startTickerAnimation(true); }, delayTime);
}

// Stop noise & ticker animations
function stopAnimations() {
  if (noiseAnimationTimer) {
    clearTimeout(noiseAnimationTimer);
    noiseAnimationTimer = null;
  }
  startNoiseAnimation(false);

  if (tickerAnimationTimer) {
    clearTimeout(tickerAnimationTimer);
    tickerAnimationTimer = null;
  }
  startTickerAnimation(false);
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
      startAnimations(delayTime);
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
