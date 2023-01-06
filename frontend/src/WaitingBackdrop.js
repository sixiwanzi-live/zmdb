import { Backdrop, CircularProgress  } from '@mui/material';

export const WaitingBackdrop = ({loading}) => {
    return (
        <Backdrop
            sx={{ color: 'gray', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={() => {}}
        >
            <CircularProgress color="success" />
        </Backdrop>
    )
} 