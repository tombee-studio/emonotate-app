import React, { useEffect, useRef, useState } from "react";
import { 
    FormControl,
    FormLabel,
    Box,
    TextField,
    Button,
    Autocomplete,
    Switch,
    FormControlLabel} from "@mui/material";
import "video.js/dist/video-js.css";
import CurveYouTubeComponent from "../../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../../components/curve-page/CurveVideoComponent";
import ContentsListAPI from "../../helper/ContentsListAPI";
import ValueTypeListAPI from "../../helper/ValueTypeListAPI";
import CurvesListAPI from "../../helper/CurvesListAPI";
import ValueTypeComponent from "../common/ValueTypeComponent";
import EmailAddressList from "./EmailAddressList";

const createNewCurveComponent = (curve, setCurveData) => {
    if(curve.content.video_id) {
        return <Box m={2}>
            <CurveYouTubeComponent 
                curve={curve} 
                videoId={curve.content.video_id}
                onChangeCurve={(curve, sections) => setCurveData(curve, sections)} />
        </Box>;
    } else {
        return <Box m={2}>
            <CurveVideoComponent 
                curve={curve} 
                onChangeCurve={(curve, sections) => setCurveData(curve, sections)} />
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
    const [isRequiredFreeHand, setRequiredFreeHand] = useState(request.is_required_free_hand);

    const [curve, setCurve] = useState({
        "values": request.values,
        "version": "0.1.1",
        "room_name": "",
        "locked": false,
        "user": django.user.id,
        "content": content,
        "value_type": valueType,
    });

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
        });
    }, []);

    useEffect(() => {
        const {
            title, description, content, value_type, values, participants, section, is_required_free_hand
        } = request;
        setTitle(title);
        setDescription(description);
        setContent(content);
        setValueType(value_type);
        setRequiredFreeHand(is_required_free_hand);
    });

    const createTitleComponent = () => <>
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
        </>;
    const createDescriptionComponent = () => <>
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
    </>
    const createSelectContentComponent = () => <>
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
    </>;
    const createValueTypeComponent = () => <>
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
    </>;
    const createLoadContentButton = () => <>
        <Button onClick={() => loadContentAndValueType(request)}>ロード</Button>
    </>;
    const createFreeHandButton = () => <>
        <Box m={2}>
            <FormControlLabel
                label="フリーハンドで入力を要求する" 
                control={
                    <Switch
                        checked={isRequiredFreeHand}
                        onChange={ev => {
                            const flag = ev.target.checked;
                            const req = {...request};
                            req.is_required_free_hand = flag;
                            setRequiredFreeHand(flag);
                            onChange(req);
                        }}
                    />}
            />
        </Box>
    </>;
    const createEmailAddressList = () => <>
        <EmailAddressList
            request={request}
        />
    </>
    const createDivider = () => <hr />

    const domList = [];
    domList.push(createTitleComponent());
    domList.push(createDivider());
    domList.push(createDescriptionComponent());
    domList.push(createDivider());
    domList.push(createSelectContentComponent());
    domList.push(createDivider());
    domList.push(createValueTypeComponent());
    domList.push(createDivider());
    domList.push(createLoadContentButton());
    domList.push(createDivider());
    if(curve.content && curve.value_type) {
        domList.push(createNewCurveComponent(
            curve, (_curve, _sections) => {
                const req = {...request};
                req.values = _curve.values;
                req.section = _sections;
                onChange(req);
                setCurve(_curve);
            }));
    }
    domList.push(createDivider());
    domList.push(createFreeHandButton());
    domList.push(createDivider());
    domList.push(createEmailAddressList());

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            { domList }
        </FormControl>
    );
};

export default ObserverComponent;
