import React from "react";
import { Box, Grid } from "@mui/material";
import SignupComponent from "../components/login-page/SignupComponent";

const SignupPage = props => 
    <Grid container alignItems="center" justify="center">
        <Grid item xs={4} />
        <Grid item xs={4}>
            <Box m={2}>
                <SignupComponent />
            </Box>
        </Grid>
        <Grid item xs={4} />
    </Grid>;

export default SignupPage;
