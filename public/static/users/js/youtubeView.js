function YouTubeView(
    youtubePlayerID, 
    videoId, 
    onPlayerReady,
    onStateChange
    ) {
    this.onYouTubeIframeAPIReady = function() {
        this.player = new YT.Player(youtubePlayerID, {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady.bind(this),
                'onStateChange': onStateChange.bind(this)
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
