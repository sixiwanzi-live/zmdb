import * as React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { context } from './context';

export const Sidebar = () => {

    const { organizations } = React.useContext(context);
    const params = useParams();
    
    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <List sx={{ p:0 }} component='nav'>
                { organizations.map(organization => (
                    <ListItem disablePadding key={organization.id}>
                        <ListItemButton 
                            component={RouterLink}
                            to={`/organizations/${organization.id}`}
                            selected={organization.id === parseInt(params.organizationId)}
                        >
                            <ListItemAvatar>
                                <Avatar src={`//${organization.avatar}@100w_100h.webp`}/>
                            </ListItemAvatar>
                            <ListItemText primary={organization.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}