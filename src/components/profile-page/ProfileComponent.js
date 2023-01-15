import React, { useEffect, useState } from 'react';
import { 
    FormControl, 
    Stack,
    FormLabel, 
    TextField, 
    Divider, 
    ButtonGroup, 
    Button, 
    Alert,
    Collapse,
    IconButton,
    InputAdornment,
    OutlinedInput
} from '@mui/material';
import Typography from '@mui/material/Typography';
import UserAPI from '../../helper/UserAPI';
import AuthenticateAPI from '../../helper/AuthenticateAPI';
import { Close, GppBad, Verified } from '@mui/icons-material';

const ProfileComponent = props => {
    const { user } = props;
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [message, setMessage] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const [isVerified, setVerified] = useState(user.is_verified);

    useEffect(() => {
        if(user.notifications.profile.length > 0) {
            setMessage(user.notifications.profile[0]);
            setSeverity("warning");
            setOpen(true);
        }
    }, []);

    const handleOnUpdate = _ => {
        const api = new UserAPI();
        const _user = { ...user };

        _user.username = username;
        _user.email = email;
        _user.inviting_users = []

        const promise = api.update(_user.id, _user)
        promise.then(json => {
            setMessage("ユーザ設定を更新しました");
            setSeverity("success");
            setOpen(true);
            setUsername(json.username);
            setEmail(json.email);
            setVerified(json.is_verified);
        })
        promise.catch(res => res.text()
        .then(message => {
            setMessage(message);
            setSeverity("error");
            setOpen(true);
        }));
    };

    const handleOnSendingVerificationMail = _ => {
        const api = new AuthenticateAPI();
        const promise = api.sendVerificationMail();
        promise.then(message => {
                setMessage(message);
                setSeverity("success");
                setOpen(true);
            });
        promise.catch(res => res.text())
            .then(message => {
                setMessage(message);
                setSeverity("error");
                setOpen(true);
            });
    };

    const generateIconButton = () => {
        if(isVerified) {
            return <IconButton>
                <Verified />
            </IconButton>;
        } else {
            return <IconButton>
                <GppBad />
            </IconButton>
        }
    };

    const items = [];
    items.push(<Typography
        component="div"
        variant="h5"
        color="textPrimary">
        {`プロファイル`}
    </Typography>);
    items.push(<Divider />);
    items.push(<Collapse in={isOpen}>
        <Alert 
            severity={severity}
            action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <Close fontSize="inherit" />
                </IconButton>
              }>
            { message }
        </Alert>
    </Collapse>);
    items.push(<FormControl variant="outlined">
        <FormLabel>ユーザ名</FormLabel>
        <TextField 
            id="username" 
            value={username}
            onChange={ev => {
                setUsername(ev.target.value);
            }} />
    </FormControl>);
    items.push(<FormControl variant="outlined">
        <FormLabel>メールアドレス</FormLabel>
        <OutlinedInput
            id="email"
            value={email}
            onChange={ev => {
                setEmail(ev.target.value);
            }}
            endAdornment={
                <InputAdornment position="end">
                    { generateIconButton() }
                </InputAdornment>
            } />
    </FormControl>);

    items.push(<Stack spacing={2} direction="row">
        <ButtonGroup spacing={2}>
            <Button
                disabled={isOpen}
                onClick={handleOnUpdate}>
                更新
            </Button>
        </ButtonGroup>
        <ButtonGroup spacing={2}>
            <Button
                color="error"
                disabled={isVerified}
                onClick={handleOnSendingVerificationMail}>
                認証メールを送信
            </Button>
        </ButtonGroup>
    </Stack>);

    return (<Stack m={2} spacing={2}>
        { items }
    </Stack>);
};

export default ProfileComponent;
