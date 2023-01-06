import { Box } from '@mui/material';

export const Footer = () => {
    return (
        <Box sx = {{ display:'flex', width:'100%', justifyContent:'center', pb:'1rem', color:'rgba(0,0,0,.4)', fontSize:'0.8rem'}}>
            <Box>
                Copyright © 2022 sixiwanzi.live
            </Box>
        </Box>
    );
}