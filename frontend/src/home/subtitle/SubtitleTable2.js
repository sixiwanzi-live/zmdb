import * as React from 'react';
import { Box, Button, Divider, Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from '@mui/material';
import { FixedSizeList } from 'react-window';
import { toTime } from '../../utils';

export const SubtitleTable = ({match, clip, subtitles, setCurrentTime}) => {

    const listRef = React.useRef();

    React.useEffect(() => {
        if (match >= 0) {
            listRef.current.scrollToItem(match);
        }
    }, [match]);

    // const Row = ({index, style, data}) => {
    //     const backgroundColor = match === data.subtitles[index].lineId - 1 ? '#F5F5F5' : '#FFFFFF';
    //     return (
    //         <div style={style}>
    //             <Box sx={{ display:'flex', backgroundColor:{backgroundColor} }}>
    //                 <Box sx={{ flex:1 }}>{data.subtitles[index].lineId}</Box>
    //                 <Box sx={{ flex:3, display:'flex', flexDirection:'column'}}>
    //                     <Box><Button onClick={() => {setCurrentTime(data.subtitles[index].start / 1000)}}>{toTime(data.subtitles[index].start)}</Button></Box>
    //                     <Box><Button sx={{flex:1}} onClick={() => {setCurrentTime(data.subtitles[index].end / 1000)}}>{toTime(data.subtitles[index].end)}</Button></Box>
    //                 </Box>
    //                 {/* <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel="noreferrer" href={`${config.url.clip}/${data.clip.bv}?start_progress=${data.subtitles[index].end}`}>{toTime(data.subtitles[index].end)}</Link></Box> */}
    //                 {/* <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel="noreferrer" onClick={() => {setCurrentTime(data.subtitles[index].end / 1000)}}>{toTime(data.subtitles[index].end)}</Link></Box> */}
    //                 <Box sx={{ flex:14 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].markedContent}} />
    //             </Box>
    //         </div>
    //     )
    // }

    const Row = ({index, style, data}) => {
        const backgroundColor = match === data.subtitles[index].lineId - 1 ? '#F5F5F5' : '#FFFFFF';
        return (
            <TableRow>
                <TableCell>{data.subtitles[index].lineId}</TableCell>
                <TableCell><Button onClick={() => {setCurrentTime(data.subtitles[index].start / 1000)}}>{toTime(data.subtitles[index].start)}</Button></TableCell>
                <TableCell><Box sx={{ flex:14 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].markedContent}} /></TableCell>
            </TableRow>
            // <TableRow style={style}>
            //     <TableCell sx={{ display:'flex', backgroundColor:{backgroundColor} }}>
            //         <Box sx={{ flex:1 }}>{data.subtitles[index].lineId}</Box>
            //         <Box sx={{ flex:3, display:'flex', flexDirection:'column'}}>
            //             <Box><Button onClick={() => {setCurrentTime(data.subtitles[index].start / 1000)}}>{toTime(data.subtitles[index].start)}</Button></Box>
            //             <Box><Button sx={{flex:1}} onClick={() => {setCurrentTime(data.subtitles[index].end / 1000)}}>{toTime(data.subtitles[index].end)}</Button></Box>
            //         </Box>
            //         {/* <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel="noreferrer" href={`${config.url.clip}/${data.clip.bv}?start_progress=${data.subtitles[index].end}`}>{toTime(data.subtitles[index].end)}</Link></Box> */}
            //         {/* <Box sx={{ flex:3 }}><Link target='_blank' underline="hover" rel="noreferrer" onClick={() => {setCurrentTime(data.subtitles[index].end / 1000)}}>{toTime(data.subtitles[index].end)}</Link></Box> */}
            //         <Box sx={{ flex:14 }} dangerouslySetInnerHTML={{__html:data.subtitles[index].markedContent}} />
            //     </TableCell>
            // </TableRow>
        )
    }

    return (
        <TableContainer>
            <Table sx={{ width:'100%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell>序号</TableCell>
                        <TableCell>起始时间&终止时间</TableCell>
                        <TableCell>字幕</TableCell>
                    </TableRow>
                </TableHead>
                    {/* <TableRow>
                        <TableCell>序号</TableCell>
                        <TableCell>起始时间&终止时间</TableCell>
                        <TableCell>字幕</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>序号</TableCell>
                        <TableCell>起始时间&终止时间</TableCell>
                        <TableCell>字幕</TableCell>
                    </TableRow> */}
                    <FixedSizeList
                        outerElementType={TableBody}
                        // innerElementType={TableRow}
                        ref={listRef}
                        height={400}
                        itemCount={subtitles.length}
                        itemSize={50}
                        width={'100%'}
                        itemData={{
                            clip: clip, 
                            subtitles:subtitles
                        }}
                    >
                        {Row}
                    </FixedSizeList>
            </Table>
        </TableContainer>
        // <Box sx={{ width:'100%'}}>
        //     <Box sx={{ display:'flex' }}>
        //         <Box sx={{ flex:1 }}>序号</Box>
        //         <Box sx={{ flex:3 }}>起始时间</Box>
        //         {/* <Box sx={{ flex:3 }}>结束时间</Box> */}
        //         <Box sx={{ flex:14 }}>字幕</Box>
        //     </Box>
        //     <Box sx={{ mt:'1rem', mb:'1rem'}}>
        //         <Divider />
        //     </Box>
        //     <FixedSizeList
        //         ref={listRef}
        //         height={450}
        //         itemCount={subtitles.length}
        //         itemSize={25}
        //         width={'100%'}
        //         itemData={{
        //             clip: clip, 
        //             subtitles:subtitles
        //         }}
        //     >
        //         {Row}
        //     </FixedSizeList>
        // </Box>
    )
}