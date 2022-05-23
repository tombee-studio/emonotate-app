import React, { Component, memo } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import InputField from "./InputField";
import VideoComponent from "./VideoComponent";

class UpdateCurveVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedVideoFlag: false
        };
        this.onReady = this.onReady.bind(this);
        this.initCurveComponent = this.initCurveComponent.bind(this);
        this.createVideoComponent = this.createVideoComponent.bind(this);
    }

    initCurveComponent(player) {
        this.getCurrent = () => player.currentTime;
        this.setCurrent = (value) => player.currentTime = value;
        this.setState({
            isLoadedVideoFlag: true,
            duration: player.duration
        });
    }

    onReady(video) {
        const { curve } = this.props;
        this.initCurveComponent(video, curve);
    }

    createVideoComponent(curve) {
        return  <VideoComponent url={curve.content.url} onReady={this.onReady} />;
    };

    render() {
        const { curve } = this.props;
        const { isLoadedVideoFlag, duration } = this.state;

        return (<Box>
            <Grid container spacing={2}>
                { this.createVideoComponent(curve) }
                 <Grid item xs={12}>
                    {!isLoadedVideoFlag ? (<Box><CircularProgress /></Box>) : 
                        (<InputField 
                            duration={duration} 
                            data={curve.values}
                            setCurrent={this.setCurrent}
                            getCurrent={this.getCurrent} />)}
                 </Grid>
             </Grid>
        </Box>);
    }
}

export default memo(UpdateCurveVideoComponent);
