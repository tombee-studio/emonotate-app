import React from "react";
import { Box, Grid } from "@mui/material";
import MailAddressComponent from "../components/password-reset-page/MailAddressComponent";

const PasswordResetPage = props => 
    <Grid container alignItems="center" justify="center">
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Box m={2}>
                <MailAddressComponent />
            </Box>
        </Grid>
        <Grid item xs={4} />
    </Grid>;

export default PasswordResetPage;
