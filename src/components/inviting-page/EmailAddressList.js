import React, { useEffect, useState } from "react";

import { Box, Button, CircularProgress, Divider, IconButton, Typography, Stack } from "@mui/material";
import { 
    DataGrid,
    GridToolbarContainer
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import "./styles.css";
import RelativeUserAPI from "../../helper/RelativeUserAPI";

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
    }
];

const EmailAddressList = props => {
    const [isLoaded, setLoadedFlag] = useState(false);
    const [relativeUsers, setRelativeUsers] = useState([]);
    const items = [];

    useEffect(() => {
        const api = new RelativeUserAPI();
        api.list()
            .then(json => {
                setRelativeUsers(json.users);
                setLoadedFlag(true);
            });
    }, []);
    
    items.push(<Typography
        component="span"
        variant="h6"
        color="textPrimary">
        関係者リスト
        <Typography
            color="textSecondary"
            variant="body1">
            あなたと関連するユーザ
        </Typography>
    </Typography>);
    items.push(<Divider />);
    if(isLoaded) {
        items.push(<DataGrid
            columns={COLUMNS}
            rows={relativeUsers}
            density='compact' 
            autoHeight
        />);
    } else {
        items.push(<CircularProgress />);
    }
    return <Box m={2}>
        <Stack 
            m={2} 
            spacing={2}>
                {items}
        </Stack>
    </Box>;
};

export default EmailAddressList;
