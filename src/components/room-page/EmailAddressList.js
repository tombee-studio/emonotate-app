import React, { useState } from "react";

import { Box, Button } from "@mui/material";
import { 
    DataGrid,
    GridToolbarContainer
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';

import "./styles.css";

const COLUMNS = [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 90
    },
    {
        field: 'username',
        headerName: 'User Name',
        width: 150,
        editable: false,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 300,
        editable: true,
    }
];

const EmailAddressList = props => {
    const { request, onChangeEmailList } = props;
    const [participants, setParticipants] = useState(request.participants || []);
    const addParticipant = () => {
        const id = (participants.length == 0)? 1 : Math.max(...participants.map(v => v.id)) + 1;
        const newParticipant = { 
            id: id, 
            username: "", 
            email: ""
        };
        setParticipants([...participants, newParticipant]);
    };
    const replayAction = () => {};
    const CustomToolBar = () => (
        <GridToolbarContainer>
            <Button color="primary" startIcon={<AddIcon />} onClick={addParticipant}>参加者を追加</Button>
            <Button color="primary" startIcon={<ReplayIcon />} onClick={replayAction}>リロード</Button>
        </GridToolbarContainer>
    );
    const actionOnCellEditCommit = (params, event) => {
        const _participants = [...participants];
        const index = _participants.findIndex(participant => participant.id == params.id);
        if(!_participants.map(participant => participant.email).includes(params.value)) {
            _participants[index][params.field] = params.value;
        } else {
            _participants[index][params.field] = "";
        }
        setParticipants(_participants);
        onChangeEmailList(request, _participants);
    };
    return (<Box style={{ width: '100%' }}>
        <DataGrid
            columns={COLUMNS}
            rows={participants}
            components={{
                Toolbar: CustomToolBar
            }}
            onCellEditCommit={actionOnCellEditCommit}
            density='compact' 
            autoHeight
        />
    </Box>);
};

export default EmailAddressList;
