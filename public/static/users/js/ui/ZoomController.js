function ZoomController(uiID, graphView) {
    this.uiID = uiID;
    this.graphView = graphView;
    this.stage = acgraph.create(uiID);
    this.layer = this.stage.layer();
    this.width = 640;
    this.height = 20;

    this.initialize = function() {
        this.bgArea = this.layer
            .rect(0, 0, this.width , this.height)
            .fill("#dddddd");
    }.bind(this);
}
