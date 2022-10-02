import { Mail } from "@mui/icons-material";
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React from "react";

const RequestItemComponent = props => {
    const { request } = props;
    return <ListItem 
        alignItems="flex-start"
        key={request.room_name}>
        <ListItemAvatar>
            <Avatar>
                <Mail />
            </Avatar>
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
        </ListItemAvatar>
    </ListItem>
};

export default RequestItemComponent;
