import React from "react";

import { Typography } from "@mui/material";
import { Box } from "@mui/material";

const RequestDetailComponent = props => {
    const { request } = props;
    return <Box m={2}>
        <Typography color="textPrimary">{request.title}</Typography>
        <Typography color="textSecondary">{request.description}</Typography>
    </Box>;
};

export default RequestDetailComponent;
