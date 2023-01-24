import React from 'react';

import { 
    ImageListItem, ImageListItemBar
} from '@mui/material';

const SearchItem = props => {
    const { item } = props;
    const { snippet } = item;
    return (
        <ImageListItem 
            key={item.id.videoId} 
            component="a"
            href={`/app/curves/?videoId=${item.id.videoId}&title=${item.snippet.title}`}>
            <img
                srcSet={snippet.thumbnails["medium"].url}
                alt={item.title}
                loading="lazy"
            />
            <ImageListItemBar
                position="below"
                title={snippet.title}
                subtitle={`by ${snippet.channelTitle}`}
            />
        </ImageListItem>);
};

export default SearchItem;
