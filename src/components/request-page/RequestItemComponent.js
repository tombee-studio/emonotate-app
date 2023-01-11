import { 
    Mail,
    Delete
} from "@mui/icons-material";
import { 
    Avatar, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    ListItemSecondaryAction,
    IconButton,
    Typography
} from "@mui/material";

import React from "react";

const RequestItemComponent = props => {
    const { request, deleteAction } = props;
    return <ListItem
        component="span"
        alignItems="flex-start"
        key={request.room_name}>
            <ListItemAvatar>
                <Avatar>
                    <Mail />
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
            <ListItemSecondaryAction>
                <IconButton
                    component="a"
                    edge="end"
                    aria-label="delete"
                    onClick={ _ => {
                        deleteAction(request);
                    }}
                    size="large">
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
};

export default RequestItemComponent;
