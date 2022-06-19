import { 
    ButtonGroup,
    Box,
    Button,
    Snackbar,
} from '@mui/material';
import React, { useState } from 'react';
import ObserverComponent from './ObserverComponent';

import RequestListAPI from "../../helper/RequestListAPI"

const CreateRequestComponent = props => {
    const { request, setRequest } = props;
    const [usingSnackbar, setSnackbar] = useState({
        isOpened: false,
        data: {}
    });
    const create = ev => {
        const api = new RequestListAPI();
        const req = { ...request };
        const { 
            questionaire, content, owner, value_type, values 
        } = request;
        req.content = content.id;
        req.owner = owner;
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
        console.log(req);
        api.create(req)
            .then(json => {
                handleClick(json, "作成しました");
            })
            .catch(err => {
                alert(err);
            });
    };
    const handleClick = (json, message) => {
        const _useSnackbar = { ...usingSnackbar };
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
        window.location.href = `/app/rooms/${_useSnackbar.data.id}`;
    };
    return <Box m={2}>
        <ObserverComponent 
            request={ request } 
            onChange={ setRequest } />
        <ButtonGroup>
            <Button variant="outlined" onClick={create}>作成</Button>
        </ButtonGroup>
        <Snackbar
            open={usingSnackbar.isOpened}
            autoHideDuration={3000}
            onClose={handleClose}
            message={usingSnackbar.message}
        />
    </Box>;
};

export default CreateRequestComponent;
