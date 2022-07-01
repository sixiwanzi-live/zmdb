import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { MainPanel } from './MainPanel';
import { Sidebar } from './Sidebar';
import OrganizationsApi from '../api/OrganizationApi';
import AuthorsApi from '../api/AuthorApi';
import { context } from './context';
import { context as globalContext } from '../context';
import ClipApi from '../api/ClipApi';

export const Home = () => {
    
    const [organizations, setOrganizations] = React.useState([]);
    const [authors, setAuthors] = React.useState([]);
    const [selectedAuthors, setSelectedAuthors] = React.useState([]);
    const [searchWord, setSearchWord] = React.useState('');
    const [clips, setClips] = React.useState([]);
    const [pinyinChecked, setPinyinChecked] = React.useState(true);

    const { setLoading, onMessage } = React.useContext(globalContext);

    const params = useParams();

    const onSearch = (searchWord) => {
        if (selectedAuthors.length > 0 && searchWord.length > 0) {
            setSearchWord(searchWord);
            const authorIds = selectedAuthors.map(selectedAuthor => selectedAuthor.id).join(',');
            setLoading(true);
            ClipApi.find(authorIds, searchWord).then(res => {
                const clips = res.data || [];
                setClips(clips);
                setLoading(false);
                onMessage({
                    type: 'success',
                    content: `总共查询到${clips.length}条直播记录`
                });
            }).catch(ex => {
                setLoading(false);
            });
        }
    }

    React.useEffect(() => {
        OrganizationsApi.findAll().then(res => {
            const organizations = res.data || [];
            setOrganizations(organizations);
        });
    }, []);

    React.useEffect(() => {
        if (params.organizationId) {
            AuthorsApi.findByOrganizationId(params.organizationId).then(res => {
                const authors = res.data || [];
                setAuthors(authors);
                setSelectedAuthors(authors);
            });
        
            ClipApi.findByOrganizationId(params.organizationId).then(res => {
                const clips = res.data || [];
                setClips(clips);
            });
        }
    }, [params]);

    const value = {
        organizations,
        authors,
        selectedAuthors,
        searchWord,
        clips,
        onSearch,
        setSelectedAuthors,
        pinyinChecked,
        setPinyinChecked
    };

    return (
        <context.Provider value={value}>
            <Box sx = {{ display: 'flex', width:'100%' }}>
                <Box sx={{ flex: 0, flexGrow: '1', p: '2rem 1rem' }}>
                    <Sidebar />
                </Box>
                <Box sx={{ flex: 0, flexGrow: '4', p: '2rem 1rem' }}>
                    <MainPanel />
                </Box>
            </Box>
        </context.Provider>
    );
}