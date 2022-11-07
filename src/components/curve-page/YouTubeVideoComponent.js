import React, { useState } from "react";
import { 
    Box,
    Grid,
} from "@mui/material";
import YouTube from 'react-youtube';

const YouTubeVideoComponent = props => {
    const [config, setConfig] = useState({
        autoplay: false,
        controls: true,
        disablekb: true,
        loop: false,
    });
    const { onReady, videoId, details } = props;
    return <Box>
        <Grid container>
            <Grid item xs="auto">
                <YouTube 
                    videoId={videoId}
                    onReady={onReady}
                    opts={{
                        width: 426,
                        height: 240,
                        playerVars: config
                    }} />
            </Grid>
            <Grid item xs>
                { details }
            </Grid>
        </Grid>
    </Box>;
};

export default YouTubeVideoComponent;
