import * as React from 'react';
import { Box, Link, Avatar, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TitleButton } from './TitleButton';
import { context } from '../context';
import config from '../../config';
import { SubtitleDownloadButton } from './SubtitleDownloadButton';

export const ClipTable = () => {

    const { selectedAuthors, clips } = React.useContext(context);

    const rows = clips
        .filter(clip => selectedAuthors.map(author => author.id).includes(clip.authorId))
        .map(clip => {
            const datetime = clip.datetime.split(' ');
            return {
                id : clip.id,
                date: datetime[0],
                time: datetime[1],
                author: clip.author,
                src: clip,
                cover: clip,
                title: clip,
                operations: clip
            };
        });

    const columns = [
        { field: 'date', headerName: '日期', flex:1, headerAlign:'center', align:'center' },
        { field: 'time', headerName: '时间', flex:1, headerAlign:'center', align:'center' },
        { field: 'author', headerName: '直播间', flex:0.7, headerAlign:'center', align:'center', renderCell: params=> (
            params.value &&
            <Link href={`${config.url.author}/${params.value.uid}`} underline='none' rel='noopener' target='_blank'><Avatar sx={{ width:'1.5rem', height:'1.5rem'}} src={`//${params.value.avatar}@60w_60h.webp`} alt={params.value.name} /></Link>
        )},
        { field: 'src', headerName: '源', flex: 0.6, headerAlign:'center', align:'center', renderCell: (params) => (
            params.value &&
            (                
                <Link href={`//${params.value.redirectUrl}`} rel ="noreferrer" target='_blank' sx={{ fontFamily:'monospace' }}>
                    {params.value.type === 0 ? '待解析' 
                        : params.value.type === 1 ? 'B站' 
                        : params.value.type === 2 ? '录播站'
                        : params.value.type === 3 ? '本地源'
                        : params.value.type === 4 ? '直播中'
                        : params.value.type === 5 ? '已下播'
                        : '未知状态'
                    } 
                </Link>
            )
        )},
        { field: 'cover', headerName: '封面', flex:1.2, headerAlign:'center', align:'center', renderCell: params=> (
            params.value && 
            <Avatar sx={{ width:'5rem', height:'2.2rem'}} variant='square' src={`//${params.value.cover}@120w_60h.webp`}/>
        )},
        { field:'title', headerName:'标题', flex:4, renderCell:params => (
            params.value &&
            <TitleButton clip={params.value} />
        )},
        { field:'operations', headerName:'操作', flex:1.2, headerAlign:'center', align:'center',renderCell:params => (
            params.value &&
            <Stack direction='row' spacing={0.5}>
                <SubtitleDownloadButton clip={params.value} />
            </Stack>
        )}
    ];

    return (
        <Box sx={{ width:'100%' }}>
            <DataGrid 
                autoHeight 
                rows={rows} 
                columns={columns} 
                pageSize={10} 
                rowsPerPageOptions={[10]} 
                disableSelectionOnClick={true} 
            />
        </Box>
    )
}