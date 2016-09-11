// Called after page load
function onLoad() {
  delayTickerAnimation(3200, true);
}

// Delayed start ticker
function delayTickerAnimation(time, start) {
  setTimeout(function() { toggleTickerAnimation(start); }, time);
}

// Toggle the animation of the tickerText
function toggleTickerAnimation( start ) {
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
      delayTickerAnimation(3200, audioPaused);
    } else {
      toggleTickerAnimation(audioPaused);
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
