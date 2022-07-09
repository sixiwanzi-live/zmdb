import * as React from 'react';
import { Button } from '@mui/material';
import { context as globalContext } from '../../context';
import { context } from '../context';
import SubtitlesApi from '../../api/SubtitleApi';
import BiliApi from '../../api/BiliApi';
import { SubtitleDialog } from '../subtitle/SubtitleDialog';

export const TitleButton = ({clip}) => {

    const [status, setStatus] = React.useState(false);
    const [subtitles, setSubtitles] = React.useState([]);
    const {setLoading, onMessage} = React.useContext(globalContext);
    const { searchWord } = React.useContext(context);

    const onClick = () => {
        setLoading(true);
        SubtitlesApi.findByClipId(clip.id, searchWord).then(res => {
            let subtitles = res.data || [];
            setSubtitles(subtitles);
            setLoading(false);
            setStatus(true);
        }).catch(ex => {
            console.log(ex);
            setLoading(false);
            const error = ex.response.data;
            onMessage({
                type: 'error',
                content: `[${error.code}] ${error.message}`
            });
        });
        BiliApi.findCidByBv(clip.bv).then(res => {
            
        });
    }

    return (
        <React.Fragment>
            <Button sx={{justifyContent:'none'}} variant='text' onClick={onClick}>{clip.title}</Button>
            <SubtitleDialog status={status} setStatus={setStatus} clip={clip} subtitles={subtitles} />
        </React.Fragment>
    )
}