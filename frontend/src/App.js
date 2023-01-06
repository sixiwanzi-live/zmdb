import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { context as globalContext } from './context';
import { Footer } from './Footer';
import { Header } from './Header';
import { WaitingBackdrop } from './WaitingBackdrop';
import { MessageSnackbar } from './MessageSnackbar';

export const App = () => {

    const [message, setMessage] = React.useState({});
    const [messageStatus, setMessageStatus] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onMessage = (message) => {
        setMessage(message);
        setMessageStatus(true);
    };

    const value = {
        message,
        messageStatus,
        setMessageStatus,
        setLoading,
        onMessage
    };

    return (
        <globalContext.Provider value={value}>
            <Box sx={{ display:'flex', width:'100%', flexDirection:'column' }}>
                <Header />
                <Outlet />
                <Footer />
                <WaitingBackdrop loading={loading}/>
                <MessageSnackbar />
            </Box>
        </globalContext.Provider>
    );
}