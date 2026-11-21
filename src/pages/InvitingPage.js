import React from "react";

import { PageContainer, Section } from "../components/common/PageLayout";

import GenerateInvitingTokenComponent from "../components/inviting-page/GenerateInvitingTokenComponent";
import EmailAddressList from "../components/inviting-page/EmailAddressList";

const InvitingPage = props => <PageContainer title="招待">
    <Section><GenerateInvitingTokenComponent /></Section>
    <Section><EmailAddressList /></Section>
</PageContainer>;

export default InvitingPage;
