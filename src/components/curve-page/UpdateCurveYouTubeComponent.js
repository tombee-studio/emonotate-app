import React, { Component, memo } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import YouTubeVideoComponent from "./YouTubeVideoComponent";
import InputField from "./InputField";

class UpdateCurveYouTubeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedVideoFlag: false
        };
        this.initCurveComponent = this.initCurveComponent.bind(this);
        this.createVideoComponent = this.createVideoComponent.bind(this);
    }

    initCurveComponent(event) {
        const player = event.target;
        
        this.setState({
            isLoadedVideoFlag: true,
            duration: player.getDuration()
        });
    }

    createVideoComponent(videoId, curve) {
        return  <YouTubeVideoComponent 
            videoId={videoId}
            onReady={event => this.initCurveComponent(event, curve)} />;
    };

    render() {
        const { curve, videoId } = this.props;
        const { isLoadedVideoFlag, duration } = this.state;
        if(videoId) {
            return (<Box>
                <Grid container spacing={2}>
                    { this.createVideoComponent(videoId, curve) }
                     <Grid item xs={12}>
                        {!isLoadedVideoFlag ? (<Box><CircularProgress /></Box>) : 
                            (<InputField duration={duration} data={curve.values} />)}
                     </Grid>
                 </Grid>
            </Box>);
        } else {
            return <Box>少々お待ちください</Box>
        }
    }
}

export default memo(UpdateCurveYouTubeComponent);
