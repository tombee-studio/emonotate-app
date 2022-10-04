import React from "react";
import { 
    Box,
    Grid,
} from "@mui/material";
import videojs from 'video.js';
import "video.js/dist/video-js.css";

class VideoComponent extends React.Component {
    constructor(props) {
        super(props);
        const { url } = this.props;
        this.options = {
            controls: true,
            sources: [{
                src: url,
                type: 'video/mp4'
            }]
        };
    }

    componentDidMount() {
        const { onReady } = this.props;
        this.player = videojs(this.videoNode, this.options);
        this.videoNode.onloadedmetadata = function() { onReady(this); };
    }

    render() {
        const { details } = this.props;
        return <Box>
            <Grid container>
                <Grid item xs="auto">
                    <video 
                        width={426}
                        height={240}
                        ref={ node => this.videoNode = node } 
                        className="video-js" />
                </Grid>
                <Grid item xs>
                    { details }
                </Grid>
            </Grid>
        </Box>;
    }
};

export default VideoComponent;
