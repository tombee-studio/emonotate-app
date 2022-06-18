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
    return <Box m={2}>
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
    </Box>;
};

export default CreateRequestComponent;
