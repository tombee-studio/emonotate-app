import React from 'react';

import { 
    ButtonGroup,
    IconButton,
    ImageListItem, ImageListItemBar
} from '@mui/material';
import { LineAxis, Moving } from '@mui/icons-material';

const SearchItem = props => {
    const { item } = props;
    const { snippet } = item;
    return (
        <ImageListItem 
            key={item.id.videoId} >
            <img
                srcSet={snippet.thumbnails["medium"].url}
                alt={item.title}
                loading="lazy"
            />
            <ImageListItemBar
                position="below"
                title={snippet.title}
                subtitle={`by ${snippet.channelTitle}`}
                actionIcon={
                    <ButtonGroup>
                        <IconButton 
                            component="a"
                            href={`/fold-line/?video_id=${item.id.videoId}`}>
                            <LineAxis />
                        </IconButton>
                        <IconButton 
                            component="a" 
                            href={`/free-hand/?video_id=${item.id.videoId}`}>
                            <Moving />
                        </IconButton>
                    </ButtonGroup>
                }
            />
        </ImageListItem>);
};

export default SearchItem;
