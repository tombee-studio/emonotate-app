import { 
    ButtonGroup,
    Box,
    Button,
    Snackbar,
} from '@mui/material';
import React, { useState } from 'react';
import ObserverComponent from './ObserverComponent';

import RequestListAPI from "../../helper/RequestListAPI"
import SectionAPI from '../../helper/SectionAPI';

const CreateRequestComponent = props => {
    const { request, setRequest } = props;
    const [_selectedRows, selectedRows] = useState([]);
    const [usingSnackbar, setSnackbar] = useState({
        isOpened: false,
        data: {}
    });
    const create = ev => {
        const sectionAPI = new SectionAPI();
        const { 
            content, owner, value_type, values, section, is_required_free_hand
        } = request;
        sectionAPI.create({
            "title": request.title,
            "content": content.id,
            "values": section
        }).then(sectionData => {
            const api = new RequestListAPI();
            const req = { ...request };
            req.content = content.id;
            req.owner = owner;
            req.value_type = value_type.id;
            req.enquetes = [1];
            req.section = sectionData.id;
            req.is_required_free_hand = is_required_free_hand;
            req.values = values.map(point => {
                const p = {...point};
                p.y = 0;
                p.axis = "v";
                p.type = "fixed";
                return p;
            });
            req.participants = req.participants.map(participant => participant.email);
            console.log(req);
            return api.create(req);
        }).then(json => {
            handleClick(json, "作成しました");
        })
        .catch(err => {
            console.log(err);
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
            onChange={ setRequest }
            selectedRows={selectedRows}
            _selectedRows={_selectedRows} />
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
