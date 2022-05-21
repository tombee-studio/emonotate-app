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
import CurveYouTubeComponent from "../components/curve-page/CurveYouTubeComponent";
import CurveVideoComponent from "../components/curve-page/CurveVideoComponent";
import UpdateCurveYouTubeComponent from '../components/curve-page/UpdateCurveYouTubeComponent';
import YouTubeDataAPI from '../helper/YouTubeDataAPI';
import UpdateCurveVideoComponent from '../components/curve-page/UpdateCurveVideoComponent';

const createNewCurveComponent = (curve, setCurveData, videoId) => {
    if(curve.content.video_id) {
        console.log(curve);
        return <CurveYouTubeComponent 
            curve={curve} 
            videoId={videoId}
            onChangeCurve={curve => setCurveData(curve)} />;
    } else {
        return <CurveVideoComponent curve={curve} 
            onChangeCurve={curve => setCurveData(curve)} />
    }
};

const createUpdateCurveComponent = (curve, setCurveData) => {
    if(curve.content.is_youtube) {
        return <UpdateCurveYouTubeComponent 
            curve={curve} 
            videoId={curve.content.video_id}
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
    const { id }  = props;
    const [useSnackbar, setSnackbar] = useState(false);
    const [curve, setCurveData] = useState({});
    const [isLoadedFlag, setLoadedFlag] = useState(false);
    const create = ev => {
        const api = new CurveWithYouTubeAPI();
        const curvesListAPI = new CurvesListAPI();
        curve["youtube"] = curve["content"]
        api.create(curve)
            .then(json => {
                handleClick();
            })
            .catch(err => {
                const curveClone = curve;
                curveClone["user"] = curve.user.id;
                curveClone["content"] = curve.content.id;
                curveClone["value_type"] = curve.value_type.id;
                return curvesListAPI.create(curveClone);
            })
            .then(json => {
                handleClick();
            }).catch(err => {
                return err.body;
            }).then(body => {
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
        } else {
            const { YOUTUBE_API_KEY } = window.django;
            (new Promise((resolve) => {
                if(videoId) {
                    resolve("youtube");
                } else if(contentId) {
                    resolve("video");
                }
            })).then(flag => {
                if(flag === "youtube") {
                    const youtubeAPI = new YouTubeDataAPI()
                    return youtubeAPI.videos({
                        key: YOUTUBE_API_KEY,
                        id: videoId,
                        part: 'snippet'
                    }).then(res => {
                        if(res.status === 200) return res.items[0].snippet.title;
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
                            }
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
                                }
                            });
                            setLoadedFlag(true);
                        });
                }
            });
        }
    }, []);
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
                            <Grid container spacing={2}>
                                <Grid item>
                                    <ButtonGroup>
                                        <Button variant="outlined" onClick={update}>更新</Button>
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
                            { createNewCurveComponent(curve, setCurveData, videoId) }
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