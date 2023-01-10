window.onload = function() {
    var graphView = new GraphView(graphViewId, curve);
    var onPlayerReady = function(event) {
        var { target } = event;
        graphView.initialize(target.getDuration());
    };
    var onStateChange = function(event) {
        // var { data } = event;
    };
    var youtubeView = new YouTubeView(
        youtubePlayerID, 
        youtubeID,
        onPlayerReady,
        onStateChange);
    youtubeView.initialize();
};