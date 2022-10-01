import React from "react";
import { Box, Grid } from "@mui/material";
import ChangeEmailComponent from "../components/change-email-page/ChangeEmailComponent";

const ChangeEmailPage = props => 
    <Grid container alignItems="center" justify="center">
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Box m={2}>
                <ChangeEmailComponent />
            </Box>
        </Grid>
        <Grid item xs={4} />
    </Grid>;

export default ChangeEmailPage;
