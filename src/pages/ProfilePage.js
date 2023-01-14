import React from 'react';
import { Stack, Box } from '@mui/material';
import ProfileComponent from '../components/profile-page/ProfileComponent';

import PasswordComponent from '../components/profile-page/PasswordComponent';

const ProfilePage = _ => {
    const { user } = window.django;
    return <Stack m={2} spacing={2}>
        <ProfileComponent user={user} />
        <PasswordComponent user={user}/>
    </Stack>;
}

export default ProfilePage;
