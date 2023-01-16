import React, { useState } from "react";

import { 
    Stack,
    Box,
    TextField,
    Typography,
    Button,
    Collapse,
    Alert,
    IconButton
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import AuthenticateAPI from "../../helper/AuthenticateAPI";

const MailAddressComponent = props => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");
    const sendPasswordResetMail = ev => {
        const api = new AuthenticateAPI();
        const promise = api.sendPasswordResetMail({
            "email": email
        });
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
    const items = [];
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
    items.push(<Typography
        component="div"
        variant="h5"
        color="textPrimary">
            メールによるログイン
    </Typography>);
    items.push(<Typography variant="body1" gutterBottom>
        パスワードを忘れた方は以下にメールアドレスを入力してください。<br />
        ログイン用のURLが記載されたメールが送信されます。
    </Typography>);
    items.push(<TextField
        value={email}
        onChange={ev => setEmail(ev.target.value)}
        label="メールアドレス" />);
    items.push(<Button
        variant="contained"
        color="primary"
        onClick={sendPasswordResetMail}
        startIcon={<Send />} >
        送信
    </Button>);
    return <Box m={2}>
        <Stack m={2} spacing={2}>{ items }</Stack>
    </Box>;
};

export default MailAddressComponent;
