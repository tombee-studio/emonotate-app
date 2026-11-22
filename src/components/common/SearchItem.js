import React from 'react';

import { 
    ButtonGroup,
    IconButton,
    ImageListItem, ImageListItemBar
} from '@mui/material';
import { LineAxis, Moving } from '@mui/icons-material';
import { linkProps } from '../../navigation';

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
                            aria-label="指定点で描く"
                            {...linkProps(`/app/curves/?videoId=${item.id.videoId}&kind=2`)}>
                            <LineAxis />
                        </IconButton>
                        <IconButton 
                            aria-label="フリーハンドで描く"
                            {...linkProps(`/app/curves/?videoId=${item.id.videoId}&kind=1`)}>
                            <Moving />
                        </IconButton>
                    </ButtonGroup>
                }
            />
        </ImageListItem>);
};

export default SearchItem;
