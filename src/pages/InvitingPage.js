import React from "react";

import { Stack } from "@mui/material";

import GenerateInvitingTokenComponent from "../components/inviting-page/GenerateInvitingTokenComponent";

const InvitingPage = props => {
    return <Stack m={2}>
        <GenerateInvitingTokenComponent />
    </Stack>;
};

export default InvitingPage;
