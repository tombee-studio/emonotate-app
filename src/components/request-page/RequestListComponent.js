import React, { useState, useEffect } from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    Box, 
    Typography, 
    Divider,
    ListItemAvatar,
    Avatar, 
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Pagination,
    Stack
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import NoteIcon from '@mui/icons-material/Note';
import RequestListAPI from '../../helper/RequestListAPI';

const RequestListComponent = () => {
    const [result, setResult] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = window.django;
    const handlePaginate = (e, page) => {
        setLoading(true);
        const api = new RequestListAPI();
        api.get({
            format: 'json',
            role: 'participant',
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
            'role': 'participant',
        })
        .then(json => {
            setResult(json);
            setLoading(false);
        });
    }, []);

    return (<Box m={2}>
        <Typography
            component="span"
            variant="h5"
            color="textPrimary"
        >
            {`${user.username}への依頼`}
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
                                    href={ request.is_required_free_hand ?
                                        `/free-hand/${request.id}/` :
                                        `/app/curves?request=${request.id}`
                                    }
                                    key={request.room_name}
                                    alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>
                                            <MailIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={<React.Fragment>
                                        <Typography
                                            component="span"
                                            color="textPrimary"
                                        >
                                            { request.title }
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            { ` from ${request.owner.email}` }
                                        </Typography>
                                    </React.Fragment>}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                { 
                                                    request.description.length > 30?
                                                    request.description.substr(0, 30) + "...":
                                                    request.description
                                                }
                                            </Typography>
                                        </React.Fragment>
                                    }
                                    />
                                    {request.has_google_form &&
                                        <ListItemSecondaryAction>
                                            <NoteIcon />
                                        </ListItemSecondaryAction>
                                    }
                                </ListItem>
                            );
                        })
                    }
                </List>
        </Stack>}
    </Box>);
};

export default RequestListComponent;
