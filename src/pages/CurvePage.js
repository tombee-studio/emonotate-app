import { 
    CircularProgress,
    ButtonGroup,
    Box,
    Button,
    Snackbar,
    Grid,
    Stack,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';

import CurvesListAPI from "../helper/CurvesListAPI";
import CurveWithYouTubeAPI from "../helper/CurveWithYouTubeAPI";
import ContentListAPI from "../helper/ContentsListAPI";
import RequestListAPI from "../helper/RequestListAPI";
import CurveYouTubeComponent from "../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../components/curve-page/CurveVideoComponent";
import UpdateCurveYouTubeComponent from '../components/curve-page/UpdateCurveYouTubeComponent';
import YouTubeDataAPI from '../helper/YouTubeDataAPI';
import UpdateCurveVideoComponent from '../components/curve-page/UpdateCurveVideoComponent';
import YouTubeContentListAPI from '../helper/YouTubeContentListAPI';
import RequestDetailComponent from '../components/curve-page/RequestDetailComponent';
import EnqueteAnswerListComponent from '../components/curve-page/EnqueteAnswerListComponent';

const createNewCurveComponent = (curve, setCurveData, request) => {
    const { video_id } = curve.content;
    if(curve.content.video_id) {
        return <CurveYouTubeComponent 
            curve={curve} 
            videoId={video_id}
            details={
                <RequestDetailComponent request={request} />
            }
            onChangeCurve={curve => setCurveData(curve)} />;
    } else {
        return <CurveVideoComponent curve={curve} 
            details={
                <RequestDetailComponent request={request} />
            }
            onChangeCurve={curve => setCurveData(curve)} />
    }
};

const createUpdateCurveComponent = (curve, setCurveData) => {
    const { video_id } = curve.content;
    if(curve.content.is_youtube) {
        return <UpdateCurveYouTubeComponent 
            curve={curve} 
            videoId={video_id}
            onChangeCurve={curve => setCurveData(curve)} />;
    } else {
        return <UpdateCurveVideoComponent 
            curve={curve} 
            videoId={curve.content.video_id}
            onChangeCurve={curve => setCurveData(curve)} />;
    }
}

const CurvePage = props => {
    const { django } = window;
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const videoId = params.get('videoId');
    const contentId = params.get('content');
    const requestId = params.get('request');
    const { id }  = props;
    const [useSnackbar, setSnackbar] = useState(false);
    const [curve, setCurveData] = useState({
        "values": [],
        "version": "0.1.1",
        "room_name": "",
        "locked": true,
        "user": django.user.id,
        "content": null,
        "value_type": null,
        "enquete": []
    });
    const [request, setRequest] = useState({});
    const [isLoadedFlag, setLoadedFlag] = useState(false);
    const create = ev => {
        const _curve = {...curve};
        if(videoId) {
            Promise.all([
                (new Promise(resolve => {
                    const api = new YouTubeContentListAPI();
                    api.list({
                        'format': 'json',
                        'search': videoId
                    })
                    .then(json => resolve(json));
                })).then(res => {
                    if(res.models.length == 1) {
                        return res.models[0];
                    } else if(res.models.length == 0) {
                        const api = new YouTubeContentListAPI();
                        return api.create(curve.content)
                            .then(res => res.json());
                    }
                }).then(res => res.id),
                curve.value_type.id
            ]).then(result => {
                const api = new CurvesListAPI();
                const [content, value_type] = result;
                _curve.content = content;
                _curve.value_type = value_type;
                return api.create(_curve);
            }).then(handleClick);
        } else {
            const curvesListAPI = new CurvesListAPI();
            const curveClone = { ...curve };
            curveClone["user"] = django.user.id;
            curveClone["content"] = curve.content.id;
            curveClone["value_type"] = curve.value_type.id;
            curvesListAPI.create(curveClone)
            .then(json => {
                if(request.has_google_form) {
                    const { google_form } = request;
                    window.open(`${google_form.url}?${
                        google_form.username_entry_field}=${
                            window.django.user.username}&${
                                google_form.curve_id_entry_field}=${json.id}`);
                }
                handleClick();
            }).catch(err => {
                const { body } = err;
                const reader = body.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                      // 次の関数は各データチャンクを処理します
                      function push() {
                        // done は Boolean で、value は Uint8Array です
                        reader.read().then(({ done, value }) => {
                          // 読み取るデータはもうありませんか？
                          if (done) {
                            // データの送信が完了したことをブラウザーに伝えます
                            controller.close();
                            return;
                          }
                
                          // データを取得し、コントローラー経由でブラウザーに送信します
                          console.log(new TextDecoder().decode(value));
                          push();
                        });
                      };
                
                      push();
                    }
                });
            });
        }
    };
    const update = ev => {
        const api = new CurveWithYouTubeAPI();
        const curvesListAPI = new CurvesListAPI();
        api.update(curve)
            .then(json => {
                handleClick();
            })
            .catch(err => {
                const curveClone = curve;
                curveClone["user"] = curve.user.id;
                curveClone["content"] = curve.content.id;
                curveClone["value_type"] = curve.value_type.id;
                return curvesListAPI.update(curveClone);
            })
            .then(json => {
                handleClick();
            });
    };
    const handleClick = () => {
        setSnackbar(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar(false);
        window.location.href = '/';
    };
    useEffect(() => {
        if(id) {
            const api = new CurvesListAPI();
            api.getItem(id, {
                'format': 'json'
            }).then(curve => {
                setCurveData(curve);
                setLoadedFlag(true);
            }).catch(message => {
                alert(message);
            });
        } else if(requestId) {
            const api = new RequestListAPI();
            api.getItem(requestId, { 'format': 'json' })
                .then(req => {
                    setCurveData({
                        "values": req.values,
                        "version": "0.1.1",
                        "room_name": req.room_name,
                        "locked": true,
                        "user": django.user.id,
                        "content": req.content,
                        "value_type": req.value_type,
                        "enquete": req.enquetes.map(enquete => {
                            const enqueteClone = {...enquete};
                            enqueteClone["answer"] = "";
                            return enqueteClone;
                        })
                    });
                    setRequest(req);
                    setLoadedFlag(true);
                });
        } else {
            const { YOUTUBE_API_KEY } = window.django;
            (new Promise((resolve) => {
                if(videoId) {
                    resolve("youtube");
                } else if(contentId) {
                    resolve("video");
                } else {
                    console.log("ERROR");
                }
            })).then(flag => {
                if(flag === "youtube") {
                    const youtubeAPI = new YouTubeDataAPI()
                    return youtubeAPI.videos({
                        key: YOUTUBE_API_KEY,
                        id: videoId,
                        part: 'snippet'
                    }).then(res => {
                        return res.items[0].snippet.title;
                    }).then(title => {
                        setCurveData({
                            "values": null,
                            "version": "0.1.1",
                            "room_name": "",
                            "locked": false,
                            "user": django.user.id,
                            "content": {
                                "title": title,
                                "url": `https://www.youtube.com/watch?v=${videoId}`,
                                "video_id": videoId,
                                "user": django.user.id
                            },
                            "value_type": {
                                "title": "幸福度",
                                "axis_type": 1,
                                "user": 1
                            },
                            "enquete": []
                        });
                        setLoadedFlag(true);
                    });
                } else if(flag === "video") {
                    const contentAPI = new ContentListAPI();
                    return contentAPI.getItem(contentId)
                        .then(contentData => {
                            setCurveData({
                                "values": null,
                                "version": "0.1.1",
                                "room_name": "",
                                "locked": false,
                                "user": django.user.id,
                                "content": contentData,
                                "value_type": {
                                    "title": "幸福度",
                                    "axis_type": 1,
                                    "user": 1
                                },
                                "enquete": []
                            });
                            setLoadedFlag(true);
                        });
                }
            });
        }
    }, []);
    const setAnswers = answers => {
        const curveClone = { ...curve };
        curveClone.enquete = answers;
        setCurveData(curveClone);
    };
    return (
        <Route render={
            props => {
                if(!isLoadedFlag) {
                    return <Box m={2}>
                        <CircularProgress />
                    </Box>
                } else if(id) {
                    return (<Box p={2}>
                        <Stack>
                            { createUpdateCurveComponent(curve, setCurveData) }
                            <EnqueteAnswerListComponent 
                                enquetes={curve.enquete}
                                setAnswers={setAnswers} />
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ButtonGroup>
                                        <Button 
                                            variant="outlined" 
                                            onClick={update}
                                            disabled={curve.locked}>更新</Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                            <Snackbar
                                open={useSnackbar}
                                autoHideDuration={3000}
                                onClose={handleClose}
                                message="更新しました"
                            />
                        </Stack>
                    </Box>);
                } else {
                    return (<Box p={2}>
                        <Stack>
                            { createNewCurveComponent(curve, setCurveData, request) }
                            <EnqueteAnswerListComponent
                                setAnswers={setAnswers}
                                enquetes={request.enquetes} />
                            <ButtonGroup>
                                <Button variant="outlined" onClick={create}>作成</Button>
                            </ButtonGroup>
                            <Snackbar
                                open={useSnackbar}
                                autoHideDuration={3000}
                                onClose={handleClose}
                                message="作成しました"
                            />
                        </Stack>
                    </Box>);
                }
            } 
        }/>
    );
}

export default CurvePage;