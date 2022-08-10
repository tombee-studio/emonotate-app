import React, { useState } from "react";
import { 
    FormGroup,
    ButtonGroup,
    TextField,
    FormHelperText,
    Button,
    Stack,
} from "@mui/material";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from 'react-router-dom';

import AuthenticateAPI from "../../helper/AuthenticateAPI";

const LoginComponent = props => {
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { search } = useLocation();

    const convertQuery = params => {
        const queries = {};
        for(const [key, value] of params) {
            queries[key] = value;
        }
        return queries;
    };

    const loginAction = ev => {
        const params = new URLSearchParams(search);
        const api = new AuthenticateAPI()
        const data = {
            username: username,
            password: password
        };
        const queries = convertQuery(params);
        queries['format'] = 'json';
        api.login(data, queries)
            .then(res => {
                window.location = '/';
            })
            .catch(feedback => {
                setOpen(true);
                setUsername("");
                setPassword("");
            });
    };

    const loginGuestAction = ev => {
        const params = new URLSearchParams(search);
        const api = new AuthenticateAPI();
        const data = {};
        const queries = convertQuery(params);
        queries['format'] = 'json';
        queries['guest'] = 'true';
        api.login(data, queries).then(res => {
                window.location = '/';
            })
            .catch(feedback => {
                setOpen(true);
                setUsername("");
                setPassword("");
            });
    };

    const createButtons = () => {
        if(username == "" && password == "") {
            return <Button variant="outlined" color="secondary" endIcon={<SendIcon />} onClick={loginGuestAction}>
                ゲストユーザとしてログイン
            </Button>;
        } else {
            return <Button disabled={
                !(username != "" && password != "")
            } variant="contained" endIcon={<SendIcon />} onClick={loginAction}>
                ログイン
            </Button>;
        }
    };

    return (
        <FormGroup>
            <Stack direction="column" spacing={1}>
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
                        ユーザ名またはパスワードが間違っています
                    </Alert>
                </Collapse>
                <TextField 
                    id="username" 
                    label="ユーザ名" 
                    value={username} 
                    onChange={ev => setUsername(ev.target.value)} />
                <FormHelperText></FormHelperText>
                
                <TextField 
                    id="password" 
                    label="パスワード" 
                    type="password"
                    value={password} 
                    onChange={ev => setPassword(ev.target.value)} />
                <FormHelperText></FormHelperText>
    
                {createButtons()}
            </Stack>
        </FormGroup>
    );
};

export default LoginComponent;
