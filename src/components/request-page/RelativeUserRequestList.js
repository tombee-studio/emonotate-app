import React, { useEffect, useState } from "react";
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
    Stack
} from '@mui/material';

import { withStyles } from "@mui/styles";

import RequestListAPI from "../../helper/RequestListAPI";
import { 
    ContentCopy,
    MeetingRoom
} from "@mui/icons-material";

const ListItemWithWiderSecondaryAction = withStyles({
    secondaryAction: {
      paddingRight: 48
    }
})(ListItem);

const RelativeUserRequestList = props => {
    const { user } = window.django;
    const [isLoading, setLoadingFlag] = useState(true);
    const [result, setResult] = useState({});
    const handlePaginate = (e, page) => {
        setLoadingFlag(true);
        const api = new RequestListAPI();
        api.get({
            format: 'json',
            role: 'relative',
            page: page
        })
        .then(json => {
            setResult(json);
            setLoadingFlag(false);
        })
    };
    useEffect(() => {
        const api = new RequestListAPI();
        api.get({
            'format': 'json',
            'role': 'relative',
        })
        .then(json => {
            setResult(json);
            setLoadingFlag(false);
        });
    }, []);
    const items = [];
    items.push(<Typography
        component="div"
        variant="h5"
        color="textPrimary">
        {`${user.username}と関連するユーザの設定したリクエスト`}
    </Typography>);
    items.push(<Divider />);
    if(isLoading) {
        items.push(<Box m={2}><CircularProgress /></Box>);
    } else {
        items.push(<Stack m={2}>
            <Pagination 
                count={result.pagination.total_pages}
                variant="outlined" 
                shape="rounded"
                onChange={handlePaginate} />
            <List>
                {
                    result.models.map(request => {
                        const iconButtons = [];
                        iconButtons.push(<IconButton
                            component="a"
                            edge="end"
                            aria-label="delete"
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
                        return (
                            <ListItemWithWiderSecondaryAction
                                button
                                component="a"
                                href={`/app/requests/${request.id}`}
                                key={request.room_name}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <MeetingRoom />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={request.title}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {`${request.owner.username}`}
                                            </Typography>
                                            {` — ${request.description.length > 30?
                                                    request.description.substr(0, 30) + "...":
                                                    request.description}`}
                                        </React.Fragment>
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
        </Stack>);
    }
    return (<Box m={2}>
        { items }
    </Box>);
};

export default RelativeUserRequestList;
