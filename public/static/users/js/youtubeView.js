function YouTubeView(youtubePlayerID, videoId) {
    this.onYouTubeIframeAPIReady = function() {
        this.player = new YT.Player(youtubePlayerID, {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                }.bind(this),
                'onStateChange': function(event) {
                    if (event.data == YT.PlayerState.PLAYING && !done) {
                        setTimeout(stopVideo, 6000);
                        done = true;
                    }
                }.bind(this)
            }
        });
    }.bind(this);

    this.stopVideo = function() {
        this.player.stopVideo();
    }.bind(this);

    this.initialize = function() {
        YT.ready(this.onYouTubeIframeAPIReady);
    }.bind(this);
}
