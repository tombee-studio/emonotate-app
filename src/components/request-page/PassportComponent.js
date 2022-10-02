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
    Tooltip} from "@mui/material";
import RequestListAPI from "../../helper/RequestListAPI";
import RequestItemComponent from "./RequestItemComponent";
import { Assignment } from "@mui/icons-material";

const PassportComponent = props => {
    const [requestList, setRequestList] = useState([]);
    const [selectedRequestList, setSelectedRequestList] = useState([]);
    const url = `${
        process.env.REACT_APP_API_URL
    }api/login/?passport=${
        selectedRequestList.map(item => item.id).join(",")
    }`;
    return <Box m={2}>
        <Typography
            component="span"
            variant="h6"
            color="textPrimary"
        >
            パスポートの作成
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
                                disableHoverListener
                                placement='top'
                                title='Copied!'>
                                <IconButton
                                    disabled={url === ''}
                                >
                                    <Assignment />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </Box>
        <Box m={2}>
            <Autocomplete 
                options={requestList}
                renderInput={params => <TextField {...params}/>}
                getOptionLabel={request => request.title}
                onInputChange={(event, value) => {
                    const api = new RequestListAPI();
                    api.get({
                        "format": "json",
                        "search": value,
                        'role': "owner"
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
                selectedRequestList.map(item => 
                    <RequestItemComponent request={item} />)
                }
            </List>
        </Box>
    </Box>;
};

export default PassportComponent;
