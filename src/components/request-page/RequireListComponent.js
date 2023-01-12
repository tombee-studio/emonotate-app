import React, { useState, useEffect } from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    ListItemSecondaryAction,
    ListItemAvatar,
    IconButton,
    Avatar,
    Box, 
    Typography, 
    Divider, 
    Pagination,
    CircularProgress, 
    Stack} from '@mui/material';
import { withStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AddIcon from '@mui/icons-material/Add';
import RequestListAPI from '../../helper/RequestListAPI';
import PassportComponent from './PassportComponent';

import DownloadIcon from '@mui/icons-material/Download';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CancelIcon from '@mui/icons-material/Cancel';
import ContentCopy from '@mui/icons-material/ContentCopy';

const ListItemWithWiderSecondaryAction = withStyles({
    secondaryAction: {
      paddingRight: 144
    }
})(ListItem);

const RequireListComponent = props => {
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = window.django;
    const handlePaginate = (e, page) => {
        setLoading(true);
        const api = new RequestListAPI();
        api.get({
            format: 'json',
            role: 'owner',
            page: page
        })
        .then(json => {
            setResult(json);
            setLoading(false);
        })
    };

    useEffect(() => {
        const api = new RequestListAPI();
        api.get({
            'format': 'json',
            'role': 'owner',
        })
        .then(json => {
            setResult(json);
            setLoading(false);
        });
    }, []);

    return (<Box m={2}>
            <Typography
                component="div"
                variant="h5"
                color="textPrimary">
                {`${user.username}が設定した実験`}
                <IconButton
                    component="a"
                    edge="end"
                    aria-label="delete"
                    href={`/app/requests/`}
                    size="large">
                    <AddIcon />
                </IconButton>
            </Typography>
            <Divider />
            {loading ? 
                <Box m={2}><CircularProgress /></Box> : 
                <Stack m={2}>
                    <Pagination 
                        count={result.pagination.total_pages}
                        variant="outlined" 
                        shape="rounded"
                        onChange={handlePaginate} />
                    <List>
                        {
                            result.models.map(request => {
                                const createStateIconToDownload = () => {
                                    switch(request.state_processing_to_download) {
                                    case 0:
                                        return <PlayArrowIcon />
                                    case 1:
                                        return <HourglassBottomIcon />
                                    case 2:
                                        return <DownloadIcon />
                                    case -1:
                                        return <CancelIcon />
                                    }
                                };
                                const iconButtons = [];
                                iconButtons.push(<IconButton>
                                    { createStateIconToDownload() }
                                </IconButton>);
                                iconButtons.push(<IconButton
                                    component="a"
                                    edge="end"
                                    aria-label="duplicate"
                                    onClick={_ => {
                                        const api = new RequestListAPI();
                                        api.duplicate(request.id, {
                                            'format': 'json'
                                        })
                                        .then(res => {
                                            if(res.status == 201 || res.status == 204) {
                                                window.location.href = '/app/request_list/';
                                            }
                                        });
                                    }}
                                    size="large">
                                    <ContentCopy />
                                </IconButton>);
                                iconButtons.push(<IconButton
                                    component="a"
                                    edge="end"
                                    aria-label="delete"
                                    onClick={_ => {
                                        const api = new RequestListAPI();
                                        api.delete(request.id, {
                                            'format': 'json'
                                        })
                                        .then(res => {
                                            if(res.status == 200 || res.status == 204) {
                                                window.location.href = '/app/request_list/';
                                            }
                                        });
                                    }}
                                    size="large">
                                    <DeleteIcon />
                                </IconButton>);
                                return (
                                    <ListItemWithWiderSecondaryAction
                                        button
                                        component="a"
                                        href={`/app/requests/${request.id}`}
                                        key={request.room_name}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <MeetingRoomIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={request.title}
                                            secondary={
                                                request.description.length > 30?
                                                request.description.substr(0, 30) + "...":
                                                request.description
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            { iconButtons }
                                        </ListItemSecondaryAction>
                                    </ListItemWithWiderSecondaryAction>
                                );
                            })
                        }
                    </List>
                    <PassportComponent />
                </Stack>}
        </Box>
    );
};

export default RequireListComponent;
