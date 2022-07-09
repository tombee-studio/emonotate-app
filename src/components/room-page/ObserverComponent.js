import React, { useEffect, useState } from "react";
import { 
    FormControl,
    FormLabel,
    Box,
    TextField,
    Button,
    Autocomplete } from "@mui/material";
import "video.js/dist/video-js.css";
import CurveYouTubeComponent from "../../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../../components/curve-page/CurveVideoComponent";
import EmailAddressList from "./EmailAddressList";
import ContentsListAPI from "../../helper/ContentsListAPI";
import ValueTypeListAPI from "../../helper/ValueTypeListAPI";
import CurvesListAPI from "../../helper/CurvesListAPI";
import ValueTypeComponent from "../common/ValueTypeComponent";

const createNewCurveComponent = (curve, setCurveData) => {
    if(curve.content.video_id) {
        return <Box m={2}>
            <CurveYouTubeComponent 
                curve={curve} 
                videoId={curve.content.video_id}
                onChangeCurve={curve => setCurveData(curve)} />
        </Box>;
    } else {
        return <Box m={2}>
            <CurveVideoComponent 
                curve={curve} 
                onChangeCurve={curve => setCurveData(curve)} />
        </Box>;
    }
};

const ObserverComponent = (props) => {
    const { django } = window;
    const { request, onChange } = props;
    const [contents, setContents] = useState([]);

    const [title, setTitle] = useState(request.title);
    const [description, setDescription] = useState(request.description);
    const [content, setContent] = useState(request.content);
    const [valueType, setValueType] = useState(request.value_type);
    const [participants, setParticipants] = useState(request.participants);
    const [values, setValues] = useState([]);

    const [curve, setCurve] = useState({
        "values": request.values,
        "version": "0.1.1",
        "room_name": "",
        "locked": false,
        "user": django.user.id,
        "content": content,
        "value_type": valueType 
    });
    const [curvesList, setCurvesList] = useState([]);

    const loadContentAndValueType = (request) => {
        const contentAPI = new ContentsListAPI();
        const valueTypeListAPI = new ValueTypeListAPI();
        Promise.all([
            contentAPI.getItem(content.id, {
                "format": "json"
            }).catch(message => {
                console.log(message);
            }),
            valueTypeListAPI.getItem(valueType.id, {
                "format": "json"
            }).catch(message => {
                console.log(message);
            })
        ]).then(result => {
            const [content, valueType] = result;
            if(!content || !valueType) return;
            const _curve = {...curve};
            _curve.content = content;
            _curve.value_type = valueType;
            setCurve(_curve);
        });
    };
    
    useEffect(() => {
        const api = new CurvesListAPI();
        api.list({
            'format': 'json',
            'search': request.room_name
        }).then(curves => {
            setCurvesList(curves.models);
        });
    }, []);

    useEffect(() => {
        const {
            title, description, content, value_type, values, participants
        } = request;
        setTitle(title);
        setDescription(description);
        setContent(content);
        setValueType(value_type);
        setValues(values);
        setParticipants(participants);
    });

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <FormLabel>タイトル</FormLabel>
            <TextField 
                id="title" 
                value={title}
                onChange={ev => {
                    const req = { ...request };
                    req.title = ev.target.value;
                    setTitle(ev.target.value);
                    onChange(req);
                }} />
            <hr />
            <FormLabel>説明</FormLabel>
            <TextField 
                id="description" 
                multiline
                rows={4}
                value={description}
                onChange={ev => {
                    const req = { ...request };
                    req.description = ev.target.value;
                    setDescription(ev.target.value);
                    onChange(req);
                }} />
            <hr />
            <FormLabel>コンテンツ</FormLabel>
            <Autocomplete 
                options={contents}
                defaultValue={curve.content}
                getOptionLabel={content => content.title}
                renderInput={params => <TextField {...params}/>}
                onInputChange={(event, value) => {
                    const api = new ContentsListAPI();
                    api.list({
                        'format': 'json',
                        'search': value
                    })
                    .then(data => {
                        setContents(data.models);
                    }, err => {
                        console.log(err);
                    })
                }}
                onChange={(_, content) => {
                    if(!content) return;
                    const req = { ...request };
                    req.content = content;
                    curve.values = [];
                    setContent(content);
                    onChange(req);
                }}
            />
            <hr />
            <ValueTypeComponent 
                defaultValue={curve.value_type}
                onChange={(_, value) => {
                    if(!value) return;
                    const req = { ...request };
                    req.value_type = value;
                    curve.values = [];
                    console.log(value);
                    setValueType(value);
                    onChange(req);
                }}
            />
            <hr />
            <Button onClick={() => loadContentAndValueType(request)}>ロード</Button>
            <hr />
            { (curve.content && curve.value_type) && createNewCurveComponent(
                curve, (_curve) => {
                    const req = {...request};
                    req.values = _curve.values;
                    setValues(_curve.values);
                    onChange(req);
                    setCurve(_curve);
                })}
            <hr />
            <EmailAddressList 
                curves={curvesList}
                participants={participants} 
                onChangeEmailList={(participants) => {
                    const req = { ...request };
                    req.participants = participants;
                    setParticipants(participants);
                    onChange(req);
                }}/>
        </FormControl>
    );
};

export default ObserverComponent;
