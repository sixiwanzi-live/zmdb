import * as React from 'react';
import { Button } from '@mui/material';
import { context as globalContext } from '../../context';
import { context } from '../context';
import ClipApi from '../../api/ClipApi';
import SubtitleApi from '../../api/SubtitleApi';
import { SubtitleDialog } from '../subtitle/SubtitleDialog';

export const TitleButton = ({clip}) => {

    const [status, setStatus] = React.useState(false);
    const [subtitles, setSubtitles] = React.useState([]);
    const {setLoading, onMessage} = React.useContext(globalContext);
    const { searchWord } = React.useContext(context);

    const onClick = async () => {
        setLoading(true);
        try {
            const res2 = await SubtitleApi.findByClipId(clip.id, searchWord);
            let subtitles = res2.data || [];
            setSubtitles(subtitles);
            setLoading(false);
            setStatus(true);
        } catch (ex) {
            console.log(ex);
            setLoading(false);
            const error = ex.response.data;
            onMessage({
                type: 'error',
                content: `[${error.code}] ${error.message}`
            });
        }
    }

    return (
        <React.Fragment>
            <Button sx={{justifyContent:'none'}} variant='text' onClick={onClick}>{clip.title}</Button>
            <SubtitleDialog status={status} setStatus={setStatus} clip={clip} subtitles={subtitles} />
        </React.Fragment>
    )
}