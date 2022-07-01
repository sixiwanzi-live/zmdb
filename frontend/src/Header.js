import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Link, Toolbar, Typography } from '@mui/material';

export const Header = () => {
    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link component={RouterLink} color='inherit' underline='none' to='/'>字幕库</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Toolbar /> {/** 避免AppBar压住下面的Box */}
        </React.Fragment>
    )
}