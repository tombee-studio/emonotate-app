import React, { useEffect, useState } from "react";

import { Box, Button, Chip, IconButton } from "@mui/material";
import { 
    DataGrid,
    GridToolbarContainer
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import FaceIcon from '@mui/icons-material/Face';

import "./styles.css";
import ParticipantAPI from "../../helper/ParticipantAPI";

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
        field: 'sended_mail',
        headerName: 'メール送信済み',
        width: 150,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: params => {
            if(params.row.sended_mail) 
                return <CheckIcon />;
            return "";
        }
    },
    {
        field: 'sended_mail_message',
        headerName: '送信状態',
        width: 150,
        editable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: params => {
            if(params.row.sended_mail) 
                return "OK";
            return params.row.sended_mail_message;
        }
    }
];

const EmailAddressList = props => {
    const { request } = props;
    const [numParticipants, setNumParticipants] = useState(0);
    const [participants, setParticipants] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        const api = new ParticipantAPI();
        api.list(request.id)
            .then(data => {
                if(data.is_error) {
                    setNumParticipants(data.number);
                } else {
                    const { participants } = data;
                    setParticipants(participants);
                    setNumParticipants(participants.length);
                }
            });
    }, []);
    const addParticipant = () => {
        const id = (participants.length == 0)? 1 : Math.max(...participants.map(v => v.id)) + 1;
        const newParticipant = { 
            id: id, 
            username: "", 
            email: ""
        };
        setParticipants([...participants, newParticipant]);
    };
    const replayAction = () => {
        const api = new ParticipantAPI();
        api.create(request.id, { 
            "emails": participants.map(participant => participant.email) 
        })
        .then(data => {
            if(data.is_error) {
                setNumParticipants(data.number);
            } else {
                const { participants } = data;
                setParticipants(participants);
                setNumParticipants(participants.length);
            }
        });
    };
    const CustomToolBar = () => (
        <GridToolbarContainer>
            <Chip icon={<FaceIcon />} label={`参加者数: ${numParticipants}`}/>
            <Button color="primary" 
                startIcon={<AddIcon />} 
                onClick={addParticipant}>
                    メールアドレスを入力
            </Button>
            <Button color="primary" 
                disabled={selectedRows.length == 0}
                startIcon={<DeleteIcon />} 
                onClick={handleOnDelete}>
                    選択された参加者を削除
            </Button>
            <Button color="primary" 
                startIcon={<ReplayIcon />} 
                onClick={replayAction}>
                    参加者を追加
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
        setParticipants(_participants);
    };
    const handleOnDelete = (v) => {
        const _participants = [...participants.filter(participant => 
            !selectedRows.includes(participant.id))];
        setParticipants(_participants);
    };
    const handleOnPaste = (ev) => {
        const pattern = /^.+@{1}[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/;
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
    };
    return (<Box style={{ width: '100%' }} onPaste={handleOnPaste} >
        <DataGrid
            columns={COLUMNS}
            rows={participants}
            components={{
                Toolbar: CustomToolBar
            }}
            onCellEditCommit={handleOnCellEditCommit}
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(v) => selectedRows(v)}
            density='compact' 
            autoHeight
        />
    </Box>);
};

export default EmailAddressList;
