import { 
    CircularProgress,
    ButtonGroup,
    Box,
    Button,
    Snackbar,
    Grid,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import ObserverComponent from '../components/room-page/ObserverComponent';

import CurvesListAPI from "../helper/CurvesListAPI";
import RequestListAPI from "../helper/RequestListAPI"

const RoomPage = props => {
    const { id }  = props;
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState({
        owner: window.django.user.id
    });
    const [useSnackbar, setSnackbar] = useState({
        isOpened: false,
        data: {}
    });
    const create = ev => {
        const api = new RequestListAPI();
        const req = { ...request };
        const { questionaire, content, owner, value_type, values } = request;
        req.content = content;
        req.owner = owner;
        req.value_type = value_type;
        req.questionaire = questionaire ? questionaire.id : null;
        req.values = values.map(point => {
            const p = {...point};
            p.y = 0;
            p.axis = "v";
            p.type = "fixed";
            return p;
        });
        req.participants = req.participants.map(participant => participant.email);
        api.create(req)
            .then(json => {
                handleClick(json);
            })
            .catch(err => {
                alert(err);
            });
    };
    const update = ev => {
        const req = { ...request };
        const { questionaire, content, owner, value_type, values } = request;
        const api = new RequestListAPI();
        req.content = content.id;
        req.owner = owner.id;
        req.value_type = value_type.id;
        req.questionaire = questionaire ? questionaire.id : null;
        req.values = values.map(point => {
            const p = {...point};
            p.y = 0;
            p.axis = "v";
            p.type = "fixed";
            return p;
        });
        req.participants = req.participants.map(participant => participant.email);
        api.update(req.id, req)
            .then(json => {
                handleClick(json, "更新しました");
            })
            .catch(err => {
                alert(err);
            });
    };
    const sendMails = ev => {
        const req = { ...request };
        const { questionaire, content, owner, value_type, values } = request;
        const api = new RequestListAPI();
        req.content = content.id;
        req.owner = owner.id;
        req.value_type = value_type.id;
        req.questionaire = questionaire ? questionaire.id : null;
        req.values = values.map(point => {
            const p = {...point};
            p.y = 0;
            p.axis = "v";
            p.type = "fixed";
            return p;
        });
        req.participants = req.participants.map(participant => participant.email);
        api.update(req.id, req)
            .then(json => {
                setRequest(json);
                return fetch(`/api/send/${json.id}`);
            })
            .then(res => {
                if(res.status == 200) return res;
            })
            .then(data => {
                handleClick(data, "メール送信成功しました");
            })
            .catch(err => {
                alert(err);
            });
    };
    const download = (ev) => {
        const api = new CurvesListAPI();
        api.list({
            'format': 'json',
            'search': request.room_name,
            'page_size': 200,
        })
        .then(json => {
            const transport = (exportJson) => {
                const fileName = 'finename.json';
                const data = new Blob([JSON.stringify(exportJson)], { type: 'text/json' });
                const jsonURL = window.URL.createObjectURL(data);
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = jsonURL;
                link.setAttribute('download', fileName);
                link.click();
                document.body.removeChild(link);
            }
            transport(json);
            alert("ダウンロードを終了しました");
        })
        .catch(err => {
            alert(err);
        });
    };
    const handleClick = (json, message) => {
        const _useSnackbar = { ...useSnackbar }
        _useSnackbar.isOpened = true;
        _useSnackbar.message = message;
        setSnackbar(_useSnackbar);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        const _useSnackbar = { ...useSnackbar }
        _useSnackbar.isOpened = false;
        setSnackbar(_useSnackbar);
    };
    useEffect(() => {
        if(id) {
            const api = new RequestListAPI();
            api.getItem(id, {
                'format': 'json'
            }).then(request => {
                if(request.owner.id !== window.django.user.id) 
                    throw 'access denied';
                const req = {...request};
                const length = request.values.length;
                const values = request.values
                    .map((point, index) => {
                        const newPoint = { ...point };
                        if(index != 0 && index != length - 1) {
                            newPoint.axis = "vh";
                            newPoint.type = "custom";
                            return newPoint;
                        } else {
                            return newPoint;
                        }
                    });
                req.values = values;
                setRequest(req);
                setLoading(true);
            }).catch(message => {
                setRequest({
                    redirect: true,
                    message: message
                });
            });
        } else {
            setLoading(true);
        }
    }, []);
    return (
        <Route render={
            props => {
                if(!loading) {
                    return <Box m={2}>
                        <CircularProgress />
                    </Box>
                } else if(id) {
                    return (<Box m={2}>
                        <ObserverComponent 
                            request={ request } 
                            onChange={ req => setRequest(req)} />
                        <Grid container spacing={2}>
                            <Grid item>
                                <ButtonGroup>
                                    <Button 
                                        variant="outlined" 
                                        onClick={update}>
                                        更新
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item>
                                <ButtonGroup>
                                    <Button 
                                        variant="outlined" 
                                        onClick={download}>
                                        ダウンロード
                                    </Button>
                                    <Button 
                                        disabled={!request.is_able_to_send}
                                        variant="outlined" 
                                        onClick={sendMails}>
                                        メール送信
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                        <Snackbar
                            open={useSnackbar.isOpened}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            message={useSnackbar.message}
                        />
                    </Box>);
                } else {
                    return (<Box m={2}>
                        <ObserverComponent 
                            request={ request } 
                            onChange={ (request) => setRequest(request)} />
                        <ButtonGroup>
                            <Button variant="outlined" onClick={create}>作成</Button>
                        </ButtonGroup>
                        <Snackbar
                            open={useSnackbar.isOpened}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            message={useSnackbar.message}
                        />
                    </Box>);
                }
            } 
        }/>
    );
}

export default RoomPage; 