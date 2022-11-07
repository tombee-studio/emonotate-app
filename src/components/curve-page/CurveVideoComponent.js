import React, { Component } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import InputField from "./InputField";
import VideoComponent from "./VideoComponent";

class CurveVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadedVideoFlag: false
        };
        this.onReady = this.onReady.bind(this);
        this.initCurveComponent = this.initCurveComponent.bind(this);
        this.createVideoComponent = this.createVideoComponent.bind(this);
    }

    initCurveComponent(player, curve) {
        const { onChangeCurve } = this.props;
        const curveClone = { ...curve };
        if(!curveClone.values || curveClone.values.length < 2) {
            curveClone.values = [{
                id: 0,
                x: 0,
                y: 0,
                axis: 'v',
                type: 'fixed',
                text:   "",
                reason: "",
            }, {
                id: 1,
                x: player.duration,
                y: 0,
                axis: 'v',
                type: 'fixed',
                text:   "",
                reason: "",
            }];
        }
        if(!curveClone.room_name) {
            curveClone.room_name = `${curve.content.title}-${1}`;
        }
        this.getCurrent = () => player.currentTime;
        this.setCurrent = (value) => player.currentTime = value;
        onChangeCurve(curveClone);

        this.setState({
            isLoadedVideoFlag: true,
            duration: player.duration
        });
    }

    onReady(video) {
        const { curve } = this.props;
        this.initCurveComponent(video, curve);
    }

    createVideoComponent(curve, child) {
        return  <VideoComponent 
            url={curve.content.url} 
            onReady={this.onReady} 
            details={child}/>;
    };

    render() {
        const { curve, details, onChangeCurve } = this.props;
        const { section } = curve;
        const { isLoadedVideoFlag, duration } = this.state;
        const changeValuesInCurve = (_values, _sections) => {
            const stateData = { ...this.state };
            stateData.values = _values;
            this.setState(stateData);

            const _curve = { ...curve };
            _curve.values = _values;
            onChangeCurve(_curve, _sections);
        };
        if(section) {
            return (<Box>
                <Grid container spacing={2}>
                    { this.createVideoComponent(curve, details) }
                     <Grid item xs={12}>
                        {!isLoadedVideoFlag ? (<Box><CircularProgress /></Box>) : 
                            (<InputField 
                                changeValuesInCurve={changeValuesInCurve}
                                duration={duration} 
                                data={curve.values}
                                sectionsData={section.values || []}
                                setCurrent={this.setCurrent}
                                getCurrent={this.getCurrent} />)}
                     </Grid>
                 </Grid>
            </Box>);
        } else {
            return (<Box>
                <Grid container spacing={2}>
                    { this.createVideoComponent(curve, details) }
                     <Grid item xs={12}>
                        {!isLoadedVideoFlag ? (<Box><CircularProgress /></Box>) : 
                            (<InputField 
                                changeValuesInCurve={changeValuesInCurve}
                                duration={duration} 
                                data={curve.values}
                                setCurrent={this.setCurrent}
                                getCurrent={this.getCurrent} />)}
                     </Grid>
                 </Grid>
            </Box>);
        }
    }
}

export default CurveVideoComponent;
