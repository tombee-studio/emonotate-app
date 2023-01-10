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
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RequestListAPI from '../../helper/RequestListAPI';
import PassportComponent from './PassportComponent';

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
                                return (
                                    <ListItem
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
                                            <IconButton
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
                                                            window.location.href = '/app/requests/';
                                                        }
                                                    });
                                                }}
                                                size="large">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
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
