import React, { useEffect, useState } from 'react';
import SearchItem from './SearchItem';
import { ImageList, ImageListItem } from '@mui/material';
import YouTubeDataAPI from '../../helper/YouTubeDataAPI';

const SearchResultList = props => {
    const { keyword } = props;
    const { YOUTUBE_API_KEY } = window.django;
    const [pageToken, setPageToken] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const api = new YouTubeDataAPI();
    useEffect(() => {
        setLoading(true);
    
        const timeOutId = setTimeout(() => {
            const promise = api.get({ 'q': keyword, 'type': 'video', 
                'part': 'snippet', 'key': YOUTUBE_API_KEY, 'maxResults': 12 })
            promise.then(json => {
                setItems(json.items);
                setPageToken(json.nextPageToken);
            });
            promise.catch(err => alert(err));
        }, 2000);
    
        return () => {
            clearTimeout(timeOutId);
        };
      }, [keyword]);
    return (<ImageList variant="masonry" cols={4} gap={16} style={{bgcolor: "#000"}}>
        { items.map(item => <SearchItem item={item} key={item.id.videoId} />) }
    </ImageList>);
};

export default SearchResultList;
