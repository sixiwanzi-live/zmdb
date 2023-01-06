import * as React from 'react';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { context } from '../context';

export const SearchText = () => {

    const { onSearch } = React.useContext(context);
    const [inputText, setInputText] = React.useState('');

    const onChange = (e) => {
        setInputText(e.target.value || '');
    }

    const onClick = (e) => {
        onSearch(inputText);
    }
    
    const onKeyPress = (e) => {
        if (e.charCode === 13) {
            onClick(e);
        }
    }

    return (
        <Paper sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <InputBase 
                sx={{ ml: '1rem', flex: 1 }} 
                placeholder="请输入关键字" 
                inputProps={{ 'aria-label': '请输入关键字' }}
                onChange={onChange} 
                onKeyPress={onKeyPress}
            />
            <IconButton 
                type="submit" 
                sx={{ p: '1rem' }} 
                aria-label="搜索" 
                onClick={onClick}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}