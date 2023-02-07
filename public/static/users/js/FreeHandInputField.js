window.onload = function() {
    var valueTypeList = new ValueTypeList("search", "value_types");
    var graphView = new GraphView(graphViewId, curve, request);
    var onPlayerReady = function(event) {
        var { target } = event;
        if(option == "new") {
            graphView.curve.values = [
                {"x": 0.0, "y": 0.0},
                {"x": target.getDuration(), "y": 0.0}
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
    valueTypeList.initialize();
};