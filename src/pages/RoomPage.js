import { 
    CircularProgress,
    Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import CreateRequestComponent from '../components/room-page/CreateRequestComponent';
import EditRequestComponent from '../components/room-page/EditRequestComponent';
import RequestListAPI from "../helper/RequestListAPI"

const RoomPage = props => {
    const { id }  = props;
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState({
        owner: window.django.user.id,
        participants: []
    });
    const [originalSectionData, setOriginalSectionData] = useState({});
    useEffect(() => {
        if(!id) {
            setLoading(true);
        } else {
            const api = new RequestListAPI();
            api.getItem(id, {
                'format': 'json'
            }).then(request => {
                if(request.owner.id !== window.django.user.id) 
                    throw 'access denied';
                const req = {...request};
                const length = request.values.length;
                const values = request.values
                    .map((point, index) => {
                        const newPoint = { ...point };
                        if(index != 0 && index != length - 1) {
                            newPoint.axis = "vh";
                            newPoint.type = "custom";
                            return newPoint;
                        } else {
                            return newPoint;
                        }
                    });
                req.values = values;
                setRequest(req);
                setOriginalSectionData(req.section);
                setLoading(true);
            }).catch(message => {
                setRequest({
                    redirect: true,
                    message: message
                });
            });
        }
    }, []);
    
    return (
        <Route render={
            props => {
                if(!loading) {
                    return <Box m={2}>
                        <CircularProgress />
                    </Box>
                } else if(id) {
                    return (<Box m={2}>
                        <EditRequestComponent 
                            id={id}
                            request={ request }
                            sectionData={ originalSectionData }
                            setRequest={ req => setRequest(req) }
                        />
                    </Box>);
                } else {
                    return (<Box m={2}>
                        <CreateRequestComponent
                            request={ request } 
                            setRequest={ req => setRequest(req) }
                        />
                    </Box>);
                }
            } 
        }/>
    );
}

export default RoomPage; 