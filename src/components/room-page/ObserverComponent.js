import React, { useEffect, useState, useRef } from "react";
import { 
    FormControl,
    FormLabel,
    TextField } from "@mui/material";
import "video.js/dist/video-js.css";
import CurveYouTubeComponent from "../../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../../components/curve-page/CurveVideoComponent";
import EmailAddressList from "./EmailAddressList";
import ContentsListAPI from "../../helper/ContentsListAPI";
import ValueTypeListAPI from "../../helper/ValueTypeListAPI";
import CurvesListAPI from "../../helper/CurvesListAPI";
import CurvesListComponent from "../common/CurvesListComponent";

const createNewCurveComponent = (curve, setCurveData) => {
    if(curve.content.video_id) {
        return <CurveYouTubeComponent 
            curve={curve} 
            videoId={curve.content.video_id}
            onChangeCurve={curve => setCurveData(curve)} />;
    } else {
        return <CurveVideoComponent 
            curve={curve} 
            onChangeCurve={curve => setCurveData(curve)} />
    }
};

const ObserverComponent = (props) => {
    const { django } = window;
    const { onChange } = props;
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
            curve.content = content;
            curve.value_type = valueType;
            setCurve(curve);
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
            <TextField 
                id="content" 
                value={request.content}
                onChange={ev => {
                    const req = { ...request };
                    req.content = Number(ev.target.value);
                    setRequest(req);
                    onChange(req);
                }} />
            <hr />
            <FormLabel>種類</FormLabel>
            <TextField 
                id="value_type" 
                value={request.value_type} 
                onChange={ev => {
                    const req = { ...request };
                    req.value_type = Number(ev.target.value);
                    setRequest(req);
                    onChange(req);
                }} />
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
