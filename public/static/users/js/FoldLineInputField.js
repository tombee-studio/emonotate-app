window.onload = function() {
    var graphView = new FoldLineGraphView(graphViewId, curve, request);
    var onPlayerReady = function(event) {
        var { target } = event;
        if(option == "new") {
            graphView.curve.values = [
                {"x": 0.0, "y": 0.0, "axis": "v"},
                {"x": target.getDuration(), "y": 0.0, "axis": "v"}
            ];
        }
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