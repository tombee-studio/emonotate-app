import React, { useEffect, useState, useRef } from "react";
import { 
    FormControl,
    FormLabel,
    Box,
    TextField } from "@mui/material";
import "video.js/dist/video-js.css";
import CurveYouTubeComponent from "../../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../../components/curve-page/CurveVideoComponent";
import EmailAddressList from "./EmailAddressList";
import ContentsListAPI from "../../helper/ContentsListAPI";
import ValueTypeListAPI from "../../helper/ValueTypeListAPI";
import CurvesListAPI from "../../helper/CurvesListAPI";
import CurvesListComponent from "../common/CurvesListComponent";
import Autocomplete from '@mui/material/Autocomplete';

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
    const { onChange } = props;
    const [contents, setContents] = useState([]);
    const [valueTypes, setValueTypes] = useState([]);
    const [request, setRequest] = useState(props.request);
    const [curve, setCurve] = useState({
        "values": request.values,
        "version": "0.1.1",
        "room_name": "",
        "locked": false,
        "user": django.user.id,
        "content": null,
        "value_type": null 
    });
    const [curvesList, setCurvesList] = useState(false);
    
    const onChangeEmailList = (participants) => {
        const req = {...request};
        req.participants = participants;
        setRequest(req);
        onChange(req);
    };

    const loadContentAndValueType = (request) => {
        const contentAPI = new ContentsListAPI();
        const valueTypeListAPI = new ValueTypeListAPI();
        Promise.all([
            contentAPI.getItem(request.content, {
                "format": "json"
            }).catch(message => {
                console.log(message);
            }),
            valueTypeListAPI.getItem(request.value_type, {
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

    const contentRef = useRef(request.content);
    const valueTypeRef = useRef(request.value_type);
    useEffect(() => {
        contentRef.current = request.content;
        valueTypeRef.current = request.value_type;
    });
    
    useEffect(() => {
        const api = new CurvesListAPI();
        api.list({
            'format': 'json',
            'search': request.room_name
        }).then(curves => {
            setCurvesList(curves);
        });
        loadContentAndValueType(request);
    }, []);

    const handlePaginate = (e, page) => {
        this.api.list({
            'format': 'json',
            'search': request.room_name,
            'page': page
        })
          .then(res => {
            return res.json()
          })
          .then(curves => {
            this.setState({
              curves: curves
            })
          })
          .catch(err => {
            console.log(err)
          });
      };

    if((contentRef.current != request.content) || (valueTypeRef.current != request.value_type)) {
        loadContentAndValueType(request);
    }

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <FormLabel>タイトル</FormLabel>
            <TextField 
                id="title" 
                value={request.title}
                onChange={ev => {
                    const req = { ...request };
                    req.title = ev.target.value;
                    setRequest(req);
                    onChange(req);
                }} />
            <hr />
            <FormLabel>説明</FormLabel>
            <TextField 
                id="description" 
                multiline
                rows={4}
                value={request.description}
                onChange={ev => {
                    const req = { ...request };
                    req.description = ev.target.value;
                    setRequest(req);
                    onChange(req);
                }} />
            <hr />
            <FormLabel>コンテンツ</FormLabel>
            { curve.content && <Autocomplete 
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
                    req.content = content.id;
                    curve.values = [];
                    setRequest(req);
                    onChange(req);
                }}
            /> }
            <hr />
            <FormLabel>種類</FormLabel>
            { curve.value_type && <Autocomplete 
                options={valueTypes}
                defaultValue={curve.value_type}
                getOptionLabel={value_type => value_type.title}
                renderInput={params => <TextField {...params}/>}
                onInputChange={(event, value) => {
                    const api = new ValueTypeListAPI();
                    api.list({
                        'format': 'json',
                        'search': value
                    }).then(data => {
                        setValueTypes(data.models);
                    });
                }}
                onChange={(_, valueType) => {
                    if(!valueType) return;
                    const req = { ...request };
                    req.value_type = valueType.id;
                    curve.values = [];
                    setRequest(req);
                    onChange(req);
                }}
            /> }
            <hr />
            { (curve.content && curve.value_type) && createNewCurveComponent(
                curve, (_curve) => {
                    const req = {...request};
                    req.values = _curve.values;
                    setRequest(req);
                    onChange(req);
                    setCurve(_curve);
                })}
            <hr />
            <EmailAddressList 
                participants={request.participants} 
                onChangeEmailList={onChangeEmailList} />
            { curvesList && <CurvesListComponent curves={curvesList} handlePaginate={handlePaginate} /> }
        </FormControl>
    );
};

export default ObserverComponent;
