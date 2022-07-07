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
    CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RequestListAPI from '../../helper/RequestListAPI';

const RequireListComponent = props => {
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
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

    return (loading ? <Box m={2}>
            <CircularProgress />
        </Box> :
        <Box m={2}>
            <Typography
                component="div"
                variant="h6"
                color="textPrimary">
                あなたが設定した実験
                <IconButton
                    component="a"
                    edge="end"
                    aria-label="delete"
                    href={`/app/rooms/`}
                    size="large">
                    <AddIcon />
                </IconButton>
            </Typography>
            <Pagination 
                count={result.pagination.total_pages}
                variant="outlined" 
                shape="rounded"
                onChange={handlePaginate} />
            <Divider />
            <List>
                {
                    result.models.map(request => {
                        return (
                            <ListItem
                                button
                                component="a"
                                href={`/app/rooms/${request.id}`}
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
                                        href={`/app/requests/${request.id}`}
                                        edge="end"
                                        aria-label="enter"
                                        size="large">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        component="a"
                                        edge="end"
                                        aria-label="delete"
                                        onClick={_ => {
                                            this.api.delete(request.id, {
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
        </Box>
    );
};

export default RequireListComponent;
