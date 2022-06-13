import React, { useState } from "react";

import { Box, Button } from "@mui/material";
import { 
    DataGrid,
    GridToolbarContainer
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import "./styles.css";

const COLUMNS = [
    { 
        field: 'id', 
        headerName: 'ID', 
        width: 90
    },
    {
        field: 'username',
        headerName: 'ユーザ名',
        width: 150,
        editable: false,
    },
    {
        field: 'email',
        headerName: 'メールアドレス',
        width: 300,
        editable: true,
    },
    {
        field: 'is_input_ended',
        headerName: '入力済み',
        width: 150,
        editable: false,
        renderCell: params => {
            if(params.row.is_input_ended) return <CheckIcon />
            return "";
        }
    }
];

const EmailAddressList = props => {
    const { participants, curves, onChangeEmailList } = props;
    const selectedRows = React.useRef([]);
    const addParticipant = () => {
        const id = (participants.length == 0)? 1 : Math.max(...participants.map(v => v.id)) + 1;
        const newParticipant = { 
            id: id, 
            username: "", 
            email: ""
        };
        onChangeEmailList([...participants, newParticipant]);
    };
    const replayAction = () => {};
    const CustomToolBar = () => (
        <GridToolbarContainer>
            <Button color="primary" 
                startIcon={<AddIcon />} 
                onClick={addParticipant}>
                    参加者を追加
            </Button>
            <Button color="primary" 
                disabled={selectedRows.current.length == 0}
                startIcon={<DeleteIcon />} 
                onClick={handleOnDelete}>
                    選択された参加者を削除
            </Button>
            <Button color="primary" 
                startIcon={<ReplayIcon />} 
                onClick={replayAction}>
                    リロード
            </Button>
        </GridToolbarContainer>
    );
    const checkDuplicateEmail = (array, email) => 
        array.map(participant => participant.email).includes(email);

    const handleOnCellEditCommit = (params, event) => {
        const _participants = [...participants];
        const index = _participants.findIndex(participant => participant.id == params.id);
        if(!checkDuplicateEmail(_participants, params.value)) {
            _participants[index][params.field] = params.value;
        } else {
            _participants[index][params.field] = "";
        }
        onChangeEmailList(_participants);
    };
    const handleOnDelete = (v) => {
        const _participants = [...participants.filter(participant => 
            !selectedRows.current.includes(participant.id))];
        onChangeEmailList(_participants);
    };
    const handleOnPaste = (ev) => {
        const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
        const data = ev.clipboardData.getData("text");
        const table = [...participants];
        for(const line of data.split(/[\n\r]+/)) {
            if(!pattern.test(line)) continue;
            const email = line;
            if(checkDuplicateEmail(table, email)) continue;
            const id = (table.length == 0)? 1 : Math.max(...table.map(v => v.id)) + 1;
            const newParticipant = { 
                id: id, 
                username: "", 
                email: email
            };
            table.push(newParticipant);
        }
        onChangeEmailList(table);
    };
    return (<Box style={{ width: '100%' }} onPaste={handleOnPaste} >
        <DataGrid
            columns={COLUMNS}
            rows={participants.map(participant => {
                const curve = curves.find(curve => curve.user.id == participant.id);
                const is_input_ended = curve != undefined;
                return {
                    ...participant,
                    is_input_ended: is_input_ended
                };
            })}
            components={{
                Toolbar: CustomToolBar
            }}
            onCellEditCommit={handleOnCellEditCommit}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(v) => selectedRows.current = v}
            density='compact' 
            autoHeight
        />
    </Box>);
};

export default EmailAddressList;
