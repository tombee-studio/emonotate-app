import React, { useState } from "react";
import { 
    Typography, 
    Box, 
    Divider,
    Autocomplete, 
    TextField,
    List, 
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormControl,
    Tooltip,
    Stack} from "@mui/material";
import RequestListAPI from "../../helper/RequestListAPI";
import RequestItemComponent from "./RequestItemComponent";
import { Assignment } from "@mui/icons-material";

const PassportComponent = props => {
    const [requestList, setRequestList] = useState([]);
    const [selectedRequestList, setSelectedRequestList] = useState([]);
    const query = selectedRequestList.length > 0 
        ? `?passport=${selectedRequestList.map(item => item.id).join(",")}`
        : "";
    const url = `${
        process.env.REACT_APP_APP_URL
    }api/login/${query}`;
    const deleteAction = request => {
        const index = selectedRequestList.findIndex(item => 
            item.room_name == request.room_name);
        selectedRequestList.splice(index, 1)
        setSelectedRequestList([...selectedRequestList]);
    };
    return <Box m={2}>
        <Typography
            component="span"
            variant="h6"
            color="textPrimary">
            ワンクリック参加URLの作成
            <Typography 
                color="textSecondary"
                variant="body1">
                シングルサインオンでリクエストに参加可能なURLを作成します。<br />
                メールなどに作成されたURLを記載することで、参加者はURLをクリックしリクエストに参加することができます。
            </Typography>
        </Typography>
        <Divider />
        <Box m={2}>
            <FormControl variant='outlined'>
                <OutlinedInput 
                    readOnly={true}
                    value={url}
                    endAdornment={
                        <InputAdornment position="end">
                            <Tooltip
                                arrow
                                placement='top'
                                title='クリップボードにURLをコピーします'>
                                <IconButton
                                    type="button"
                                    disabled={url === ''}
                                    onClick={ev => {
                                        ev.preventDefault();
                                        navigator.clipboard.writeText(url);
                                    }}>
                                    <Assignment />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
        <Box m={2}>
            <Stack>
                <Autocomplete 
                    options={requestList}
                    renderInput={params => <TextField 
                        {...params} 
                        label="追加したいリクエストのタイトルを入力してください"/>}
                    getOptionLabel={request => request.title}
                    onInputChange={(event, value) => {
                        const api = new RequestListAPI();
                        api.get({
                            "format": "json",
                            "search": value,
                            "role": "owner"
                        })
                        .then(data => {
                            setRequestList(data.models);
                        }, err => {
                            console.log(err);
                        })
                    }}
                    onChange={(_, request) => {
                        if(!request) return;
                        const tmpArray = [...selectedRequestList];
                        tmpArray.push(request);
                        setSelectedRequestList(tmpArray);
                    }}
                />
                <List>
                    {
                    selectedRequestList.map(request => 
                        <RequestItemComponent 
                            request={request} 
                            deleteAction={deleteAction} />)
                    }
                </List>
            </Stack>
        </Box>
    </Box>;
};

export default PassportComponent;
