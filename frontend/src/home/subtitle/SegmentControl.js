import * as React from 'react';
import { Box, Button, TextField } from '@mui/material';
import config from '../../config';
import { context as globalContext } from '../../context';
import { toTime } from '../../utils';
import DiskApi from '../../api/DiskApi';


export const SegmentControl = ({bv, startTime, endTime}) => {

    const { onMessage } = React.useContext(globalContext);
    const [disabled, setDisabled] = React.useState(false);

    const onClick = async (e) => {
        try {
            setDisabled(true);
            const res1 = await DiskApi.make(bv, startTime, endTime);
            const filename = res1.data.filename;
            const url = `${config.url.segment}/${filename}`;
            const a = document.createElement('a');
            a.style.display = 'none';
            a.target = '_blank';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (ex) {
            console.log(ex);
        }
        setDisabled(false);
    }

    return (
        <Box sx={{display:'flex', pt:'2rem'}}>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <TextField disabled size="small" label="起始时间" defaultValue={toTime(startTime)} />
            </Box>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <TextField disabled size="small" label="终止时间" defaultValue={toTime(endTime)}/>
            </Box>
            <Box sx={{flex:1, pr:'1rem', pl:'1rem'}}>
                <Button sx={{width:'100%', height:'100%'}} variant="contained" disabled={disabled} onClick={onClick}>生成切片</Button>
            </Box>
        </Box>
    );
}