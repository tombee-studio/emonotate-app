window.onload = function() {
    var graphView = new FoldLineGraphView(graphViewId, curve, request);
    var onPlayerReady = function(event) {
        var { target } = event;
        graphView.initialize(target);
        window.buttonAction = new ButtonAction(graphView, youtubeView);
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