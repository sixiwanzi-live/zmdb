import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Link, Toolbar, Typography } from '@mui/material';
import NotificationsApi from './api/NotificationsApi';

export const Header = () => {

    const [content, setContent] = React.useState('');

    React.useEffect(() => {
        setInterval(() => {
            NotificationsApi.find().then((json) => {
                setContent(json.content);
            });
        }, 5000);
    }, []);

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link component={RouterLink} color='inherit' underline='none' to='/'>字幕库</Link>
                    </Typography>
                    <Typography variant="subtitle1" color='#EDAAB3' sx={{ flexGrow: 1 }}>
                        {content.length > 0 ? `!!! ${content} !!!` : ''}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/** 避免AppBar压住下面的Box */}
        </React.Fragment>
    )
}