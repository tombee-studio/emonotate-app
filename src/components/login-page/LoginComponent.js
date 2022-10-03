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
    
    const getSignupURL = (search) => {
        const queries = convertQuery(new URLSearchParams(search));
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        const signupURL = `/app/signup/${query == "" ? "" : '?' + query}`;
        return signupURL;
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
                if(res.url) {
                    window.location = res.url;
                } else {
                    window.location = '/';
                }
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
                if(res.url) {
                    window.location = res.url;
                } else {
                    window.location = '/';
                }
            })
            .catch(feedback => {
                setOpen(true);
                setUsername("");
                setPassword("");
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
            
                        <Button disabled={
                            !(username != "" && password != "")
                        } variant="contained" startIcon={<SendIcon />} onClick={loginAction}>
                            ログイン
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Stack spacing={1} direction="column">
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SendIcon />} 
                            href={getSignupURL(search)} >
                            ユーザ登録
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            startIcon={<SendIcon />} 
                            onClick={loginGuestAction} >
                            ゲストユーザとしてログイン
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </FormGroup>
    );
};

export default LoginComponent;
