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

const SignupComponent = props => {
    const [open, setOpen] = React.useState(false);
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
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

    const getLoginURL = (search) => {
        const queries = convertQuery(new URLSearchParams(search));
        const query = Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&');
        const signupURL = `/app/login/${query == "" ? "" : '?' + query}`;
        return signupURL;
    };

    const signupAction = ev => {
        const params = new URLSearchParams(search);
        const api = new AuthenticateAPI()
        const data = {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        };
        const queries = convertQuery(params);
        queries['format'] = 'json';
        const promise = api.signup(data, queries);
        promise.then(json => {
            window.location = json.url;
        });
        promise.catch(error => {
            setOpen(true);
            setUsername("");
            setEmail("");
            setPassword1("");
            setPassword2("");
            setError(error.message);
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
                setPassword1("");
                setPassword2("");
            });
    };

    const buttons = [];
    buttons.push(<Button 
        variant="contained" 
        color="secondary"
        startIcon={<SendIcon />} 
        href={getLoginURL(search)} >
        ログイン
    </Button>);
    
    const queries = convertQuery(new URLSearchParams(search));
    if(!"inviting" in queries) {
        buttons.push(<Button 
            variant="outlined" 
            color="secondary"
            startIcon={<SendIcon />} 
            onClick={loginGuestAction} >
            ゲストユーザとしてログイン
        </Button>);
    }

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
                                {error}
                            </Alert>
                        </Collapse>

                        <TextField 
                            id="username" 
                            label="ユーザ名" 
                            value={username} 
                            onChange={ev => setUsername(ev.target.value)} />
                        <FormHelperText></FormHelperText>

                        <TextField 
                            id="email" 
                            label="メールアドレス" 
                            value={email} 
                            onChange={ev => setEmail(ev.target.value)} />
                        <FormHelperText></FormHelperText>

                        <TextField 
                            id="password" 
                            label="パスワード" 
                            type="password"
                            value={password1} 
                            onChange={ev => setPassword1(ev.target.value)} />
                        <FormHelperText></FormHelperText>

                        <TextField 
                            id="password" 
                            label="確認用パスワード" 
                            type="password"
                            value={password2} 
                            onChange={ev => setPassword2(ev.target.value)} />
                        <FormHelperText></FormHelperText>
            
                        <Button disabled={
                            !(username != "" && password1 != "" && password2 != "")
                        } variant="contained" startIcon={<SendIcon />} onClick={signupAction}>
                            ユーザ登録
                        </Button>
                    </Stack>
                </Box>
                <Box>
                    <Stack spacing={1} direction="column">
                        { buttons }
                    </Stack>
                </Box>
            </Stack>
        </FormGroup>
    );
};

export default SignupComponent;
