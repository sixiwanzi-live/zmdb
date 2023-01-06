import * as React from 'react';
import { Paper, FormControl, InputLabel, Select, OutlinedInput, Box, Avatar, MenuItem } from '@mui/material';
import { context } from '../context';

export const AuthorsSelector = () => {

    const { authors, selectedAuthors, setSelectedAuthors } = React.useContext(context);
    
    const onChanged = (e) => {
        setSelectedAuthors(e.target.value);        
    };

    return (
        <Paper sx={{ width:'100%' }}>
            <FormControl sx={{ display:'flex', flex:1 }}>
                <InputLabel id="authors-selector-label">请选择直播间</InputLabel>
                <Select
                    sx={{ flex:0 }}
                    labelId='authors-selector-label'
                    id='authors-selector'
                    multiple
                    value={selectedAuthors}
                    onChange={onChanged}
                    input={<OutlinedInput id="authors-selector" label="请选择直播间" />}
                    renderValue={selectedAuthors => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            { selectedAuthors.map(selectedAuthor => (
                                <Avatar sx={{ width: '1.5rem', height: '1.5rem'}} key={selectedAuthor.id} src={`//${selectedAuthor.avatar}@60w_60h.webp`} />
                            ))}
                        </Box>
                    )}
                >
                    { authors.map(author => (
                        <MenuItem key={author.id} value={author} >
                            <Avatar sx={{ width: '1.5rem', height: '1.5rem', mr: '0.5rem'}} src={`//${author.avatar}@60w_60h.webp`} />{author.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Paper>
    );
}