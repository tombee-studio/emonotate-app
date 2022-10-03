import React, { useState } from "react";
import { 
    FormGroup,
    TextField,
    FormHelperText,
    Button,
    Stack,
    Box,
} from "@mui/material";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from 'react-router-dom';
import EmonotateAPI from "../../helper/EmonotateAPI";
import { isObject } from "lodash";

const ChangeEmailComponent = props => {
    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { search } = useLocation();

    const convertQuery = params => {
        const queries = {};
        for(const [key, value] of params) {
            queries[key] = value;
        }
        return queries;
    };

    const changeEmailAction = ev => {
        const params = new URLSearchParams(search);
        const api = new EmonotateAPI();
        const data = {
            email: email
        };
        const queries = convertQuery(params);
        queries['format'] = 'json';
        api.changeEmail(data, queries)
            .then(data => {
                if(isObject(data)) {
                    window.location.href = "/";
                } else {
                    setError(data);
                    setOpen(true);
                }
            });
    };

    return (
        <FormGroup>
            <Stack direction="column" spacing={4}>
                <Box>
                    <Stack spacing={1} direction="column">
                        <Collapse in={open}>
                            <Alert
                                severity="error"
                                action={
                                    <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setOpen(false);
                                    }}
                                    >
                                    <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}>
                                { error }
                            </Alert>
                        </Collapse>
                        
                        <TextField 
                            id="email" 
                            label="メールアドレス" 
                            type="email"
                            value={email} 
                            onChange={ev => setEmail(ev.target.value)} />
                        <FormHelperText></FormHelperText>
            
                        <Button disabled={
                            email == ""
                        } variant="contained" startIcon={<SendIcon />} onClick={changeEmailAction}>
                            メールアドレスを変更
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </FormGroup>
    );
};

export default ChangeEmailComponent;
