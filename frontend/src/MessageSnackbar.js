import * as React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { context } from './context';

export const MessageSnackbar = () => {

    const { message, messageStatus, setMessageStatus} = React.useContext(context);

    const onClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessageStatus(false);
    }

    return (
        <Snackbar 
            open={messageStatus} 
            autoHideDuration={2000} 
            onClose={onClose}
            anchorOrigin={{ vertical:'top', horizontal:'right' }}>
            <Alert onClose={onClose} severity={message.type} sx={{ width: '100%' }}>
                {message.content}
            </Alert>
        </Snackbar>
    );
}