import React, { useState } from 'react';
import { 
    ButtonGroup,
    Box,
    Button,
    Snackbar,
    Grid,
} from '@mui/material';
import ObserverComponent from './ObserverComponent';

import RequestListAPI from "../../helper/RequestListAPI";
import EmonotateAPI from '../../helper/EmonotateAPI';

const EditRequestComponent = props => {
    const { request, setRequest } = props;
    const [usingSnackbar, setSnackbar] = useState({
        isOpened: false,
        data: {}
    });

    const [_selectedRows, selectedRows] = useState([]);

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
                setRequest(json);
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
                return fetch(`/api/send/${json.id}`);
            })
            .then(res => {
                if(res.status == 200) return res.json();
                else throw res;
            })
            .then(data => {
                setRequest(data);
                handleClick(data, "メール送信成功しました");
            });
    };

    const resendMails = ev => {
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
                return fetch(`/api/send/${json.id}`);
            })
            .then(res => {
                if(res.status == 200) return res.json();
                else throw res;
            })
            .then(data => {
                setRequest(data);
                handleClick(data, "再送信成功しました");
            });
    };

    const sendMailsToSelectedUsers = () => {
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
                const url = `/api/send/${json.id}?targets=${_selectedRows.join(";")}`;
                return fetch(url);
            })
            .then(res => {
                if(res.status == 200) return res.json();
                else throw res;
            })
            .then(data => {
                setRequest(data);
                handleClick(data, "選択されたユーザに送信成功しました");
            });
    };

    const download = (ev) => {
        const api = new EmonotateAPI();
        api.getRequestItemAPI("get_download_curve_data", request.id)
        .then(json => {
            const transport = (json) => {
                const req = { ...request };
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.href = json["url"];
                link.setAttribute('download', json["file_name"]);
                link.click();
                document.body.removeChild(link);

                handleClick(req, "ダウンロードが成功しました");
            }
            transport(json);
        })
        .catch(err => {
            alert(err);
        });
    };

    const resetEmailAddresses = (event, reason) => {
        const message = "すべての参加者のメールアドレスをリセットしますか？（この操作は取り消しできません）";
        if(window.confirm(message)) {
            const api = new EmonotateAPI();
            api.getRequestItemAPI("reset_email_addresses", request.id)
            .then(req => {
                setRequest(req);
                handleClick(req, "すべてのメールアドレスを消去しました");
            });
        }
    };

    const handleClick = (json, message) => {
        const _useSnackbar = { ...usingSnackbar }
        _useSnackbar.isOpened = true;
        _useSnackbar.message = message;
        _useSnackbar.data = json;
        setSnackbar(_useSnackbar);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        const _useSnackbar = { ...usingSnackbar }
        _useSnackbar.isOpened = false;
        setSnackbar(_useSnackbar);
    };

    const createSendButtons = participants => {
        const buttons = [
            <Button 
                variant="outlined" 
                onClick={sendMails}>
                すべての参加者にメール送信
            </Button>
        ];
        if(_selectedRows.length != 0) {
            buttons.push(<Button 
                variant="outlined"
                onClick={sendMailsToSelectedUsers}>
                選択された人にメール送信
            </Button>);
        }
        if(!participants.every(participant => participant.sended_mail)) {
            buttons.push(<Button 
                variant="outlined" 
                color="error"
                onClick={resendMails}>
                再送信
            </Button>);
        }
        return <ButtonGroup>{ buttons }</ButtonGroup>;
    };

    return <Box m={2}>
        <ObserverComponent 
            request={ request } 
            onChange={ req => setRequest(req)}
            selectedRows={selectedRows}
            _selectedRows={_selectedRows} />
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
                </ButtonGroup>
            </Grid>
            <Grid item>
                {createSendButtons(request.participants)}
            </Grid>
            <Grid item>
                <ButtonGroup>
                    <Button 
                        variant="outlined" 
                        color="error"
                        onClick={resetEmailAddresses}>
                        メールアドレスを消去
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
        <Snackbar
            open={usingSnackbar.isOpened}
            autoHideDuration={3000}
            onClose={handleClose}
            message={usingSnackbar.message}
        />
    </Box>;
};

export default EditRequestComponent;
