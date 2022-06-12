import React, { useState } from 'react';
import { ButtonGroup, Button, Box, Snackbar } from '@mui/material';
import ProfileComponent from '../components/profile-page/ProfileComponent';

import UserAPI from '../helper/UserAPI';

const ProfilePage = (props) => {
    const [user, setUserData] = useState(window.django.user);
    const [snackbarData, setSnackbarData] = useState({
        is_open: false,
        message: ""
    });
    const handleOnUpdate = ev => {
        const api = new UserAPI();
        const _user = { ...user };
        api.update(_user.id, _user).then(res => {
            if(res.status == 200) { 
                setUserData(res.json()); 
                setSnackbarData({
                    is_open: true,
                    message: '更新しました'
                });
            }
            else throw res.detail;
        });
    };
    const generateButton = _user => {
        return (<Button onClick={handleOnUpdate}>更新</Button>);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarData({
            is_open: false,
            message: ''
        });
    };
    return (
        <Box m={2}>
            <ProfileComponent user={user} setUserData={setUserData} />
            <ButtonGroup>{ generateButton(user) }</ButtonGroup>
            <Snackbar 
                open={snackbarData.is_open}
                autoHideDuration={3000}
                onClose={handleClose}
                message={snackbarData.message}/>
        </Box>
    );
}

export default ProfilePage;
