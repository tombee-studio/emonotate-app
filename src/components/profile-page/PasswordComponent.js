import React, { useState } from "react";

import { 
    Typography,
    FormControl,
    Stack,
    TextField,
    Divider,
    FormLabel,
    Box,
    ButtonGroup,
    Button,
    Collapse,
    Alert,
    IconButton
} from "@mui/material";
import UserAPI from "../../helper/UserAPI";
import { Close } from "@mui/icons-material";

const PasswordComponent = props => {
    const { user } = props;
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setOpen] = useState(false);
    const [severity, setSeverity] = useState("");

    const resetPassword = () => {
        setPassword("");
        setPassword2("");
    };

    const handleOnUpdate = ev => {
        const api = new UserAPI();
        const promise = api.changePassword(user.id, {
            "password": password,
            "password2": password2
        });
        promise.then(message => {
            setMessage(message);
            setSeverity("success");
            setOpen(true);
            resetPassword();
        });
        promise.catch(res => res.text())
            .then(message => {
                setMessage(message);
                setSeverity("error");
                setOpen(true);
                resetPassword();
            });
    };

    const items = [];
    items.push(<Typography
        component="div"
        variant="h5"
        color="textPrimary">
        パスワードの変更
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
        <FormLabel>
            Password
        </FormLabel>
        <TextField
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)} />
    </FormControl>);
    items.push(<FormControl variant="outlined">
        <FormLabel>
            Password(2回目)
        </FormLabel>
        <TextField
            type="password"
            value={password2}
            onChange={event => setPassword2(event.target.value)} />
    </FormControl>);
    items.push(<Stack spacing={2} direction="row">
        <ButtonGroup spacing={2}>
            <Button
                disabled={isOpen}
                color="warning"
                onClick={handleOnUpdate}>
                パスワードを更新
            </Button>
        </ButtonGroup>
    </Stack>);
    return <Box m={2}>
        <Stack m={2} spacing={2}>{ items }</Stack>
    </Box>;
};

export default PasswordComponent;
