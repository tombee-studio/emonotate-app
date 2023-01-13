import React from "react";

import { Stack } from "@mui/material";

import GenerateInvitingTokenComponent from "../components/inviting-page/GenerateInvitingTokenComponent";
import EmailAddressList from "../components/inviting-page/EmailAddressList";

const InvitingPage = props => <Stack m={2} spacing={2}>
    <GenerateInvitingTokenComponent />
    <EmailAddressList />
</Stack>;

export default InvitingPage;
