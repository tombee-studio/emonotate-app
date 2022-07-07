import React, { Component } from "react";

import { Box, CircularProgress, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import YouTubeVideoComponent from "./YouTubeVideoComponent";
import InputField from "./InputField";

class CurveYouTubeComponent extends Component {
    constructor(props) {
        super(props);
        const { curve } = this.props;
        this.state = {
            isLoadedVideoFlag: false,
            values: curve.values || []
        };
        this.initCurveComponent = this.initCurveComponent.bind(this);
        this.createVideoComponent = this.createVideoComponent.bind(this);
    }

    initCurveComponent(event, curve) {
        const { onChangeCurve } = this.props;
        const player = event.target;
        const videoData = player.getVideoData();
        const curveClone = { ...curve };
        this.getCurrent = () => player.getCurrentTime();
        this.setCurrent = (value) => player.seekTo(value);
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
                x: player.getDuration(),
                y: 0,
                axis: 'v',
                type: 'fixed',
                text:   "",
                reason: "",
            }];
        }
        if(!curveClone.room_name) {
            curveClone.room_name = `${videoData.video_id}-${1}`;
        }
        onChangeCurve(curveClone);

        this.setState({
            isLoadedVideoFlag: true,
            duration: player.getDuration()
        });
    }

    createVideoComponent(videoId, curve) {
        const video_id = videoId;
        return  <YouTubeVideoComponent 
            videoId={video_id}
            onReady={event => this.initCurveComponent(event, curve)} />;
    };

    render() {
        const { curve, videoId, onChangeCurve } = this.props;
        const { isLoadedVideoFlag, duration, values } = this.state;

        const changeValuesInCurve = _values => {
            const stateData = { ...this.state };
            stateData.values = _values;
            this.setState(stateData);

            const _curve = { ...curve };
            _curve.values = _values;
            onChangeCurve(_curve);
        };

        const selectState = (index, value) => {
            const _curve = { ...curve };
            const _values = [...values];
            _values[index].state = value;
            _curve.values = _values;
            onChangeCurve(_curve);
        };

        const columns = [
            { 
                field: 'id' 
            }, { 
                field: 'x' 
            }, { 
                field: 'y'
            }, { 
                field: 'state',
                width: 300,
                renderCell: (params) => {
                    const { id, row } = params;
                    return <RadioGroup 
                        row defaultValue={row.state || "middle"}>
                        <FormControlLabel
                            value="start"
                            control={<Radio onClick={() => selectState(id, "start")} />}
                            label="Start"
                            labelPlacement="top" />
                        <FormControlLabel
                            value="middle"
                            control={<Radio onClick={() => selectState(id, "middle")} />}
                            label="Middle"
                            labelPlacement="top" />
                        <FormControlLabel
                            value="end"
                            control={<Radio onClick={() => selectState(id, "end")} />}
                            label="End"
                            labelPlacement="top" />
                    </RadioGroup>;
                }
            }, { 
                field: 'message',
                width: 300
            }, { 
                field: 'reason',
                width: 300 
            }
        ];

        return (<Box>
            <Grid container spacing={2}>
                { this.createVideoComponent(videoId, curve) }
                <Grid item xs={12}>
                    {!isLoadedVideoFlag ? (<Box><CircularProgress /></Box>) : 
                        (<InputField 
                            changeValuesInCurve={changeValuesInCurve}
                            duration={duration} 
                            data={curve.values}
                            setCurrent={this.setCurrent}
                            getCurrent={this.getCurrent} />)}
                </Grid>
                <Grid item xs={12}>
                    <Box height={300} width="100%" m={2}>
                        <DataGrid 
                            columns={columns}
                            rows={values.map((item, i) => {
                                const newItem = {...item};
                                newItem.id = i;
                                return newItem;
                            })}
                        />
                    </Box>
                 </Grid>
             </Grid>
        </Box>);
    }
}

export default CurveYouTubeComponent;
