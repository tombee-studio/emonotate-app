import React from "react";

import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";

const RequestDetailComponent = props => {
    const { request } = props;
    return <Box m={2}>
        <Typography color="textPrimary">{request.title}</Typography>
        <ReactMarkdown children={request.description} />
    </Box>;
};

export default RequestDetailComponent;
