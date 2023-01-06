import * as React from 'react';
import { Button } from '@mui/material';
import { context as globalContext } from '../../context';
import { context } from '../context';
import SubtitleApi from '../../api/SubtitleApi';
import { SubtitleDialog } from '../subtitle/SubtitleDialog';

export const TitleButton = ({clip}) => {

    const [status, setStatus]       = React.useState(false);
    const [subtitles, setSubtitles] = React.useState([]);
    const {setLoading, onMessage}   = React.useContext(globalContext);
    const { searchWord } = React.useContext(context);

    const onClick = async () => {
        setLoading(true);
        try {
            const json = await SubtitleApi.findByClipId(clip.id, searchWord);
            setSubtitles(json || []);
            setLoading(false);
            setStatus(true);
        } catch (ex) {
            console.log(ex);
            if (ex) {
                onMessage({
                    type: 'error',
                    content: `${ex.code}:${ex.message}`
                });
            } else {
                onMessage({
                    type: 'error',
                    content: '内部错误'
                });
            }
        }
    }

    return (
        <React.Fragment>
            <Button sx={{justifyContent:'none'}} variant='text' onClick={onClick}>{clip.title}</Button>
            <SubtitleDialog status={status} setStatus={setStatus} clip={clip} subtitles={subtitles} />
        </React.Fragment>
    )
}