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
            component="span"
            variant="h6"
            color="textPrimary"
        >
            あなたへの依頼
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
                                    href={ `/app/curves?request=${request.id}` }
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
                                            { 
                                                request.title
                                            }
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="subtitle1"
                                            color="textSecondary"
                                        >
                                            { 
                                                ` from ${request.owner.email}`
                                            }
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
                                    {request.questionaire &&
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                component="a"
                                                href={
                                                    `${request.questionaire.url}?${request.questionaire.user_id_form}=${window.django.user.username}`
                                                }
                                                target="_blank"
                                                edge="end"
                                                aria-label="enter"
                                                size="large">
                                                <NoteIcon />
                                            </IconButton>
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
