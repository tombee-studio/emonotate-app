import React, { useEffect, useState } from 'react';
import { Box, FormControl, Stack, Input, InputLabel } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ProfileComponent = props => {
    const { user, setUserData } = props;
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    useEffect(() => {
        const _user = { ...user };
        _user.username = username;
        _user.email = email;
        if(password != "") {
            _user.password = password;
            _user.password2 = password2;
        }
        setUserData(_user);
    }, [username, email, password, password2]);

    return (<Box m={2}>
        <Stack spacing={2}>
            <FormControl sx={{ m: 2 }} variant="outlined">
                <InputLabel htmlFor="component-simple">
                    ユーザ名
                </InputLabel>
                <Input
                    value={username}
                    onChange={event => setUsername(event.target.value)} />
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="outlined">
                <InputLabel htmlFor="component-simple">
                    メールアドレス
                </InputLabel>
                <Input
                    value={email}
                    onChange={event => setEmail(event.target.value)} />
            </FormControl>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                    <Typography>パスワードの変更</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl sx={{ m: 2 }} variant="outlined">
                        <InputLabel htmlFor="component-simple">
                            Password
                        </InputLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)} />
                    </FormControl>
                    <FormControl sx={{ m: 2 }} variant="outlined">
                        <InputLabel htmlFor="component-simple">
                            Password(2回目)
                        </InputLabel>
                        <Input
                            type="password"
                            value={password2}
                            onChange={event => setPassword2(event.target.value)} />
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </Stack>
    </Box>);
};

export default ProfileComponent;
