function playAudio() {
    var myAudio = document.getElementById("mp3");
    if( myAudio.paused ) {
        myAudio.play();
        document.getElementById("audioButton").style.backgroundImage = "url(img/pause.svg)";
        myAudio.addEventListener('ended', function() {
            document.getElementById("audioButton").style.backgroundImage = "url(img/play.svg)";
            myAudio.pause();
        });
    } else {
        document.getElementById("audioButton").style.backgroundImage = "url(img/play.svg)";
        myAudio.pause();
    }
}