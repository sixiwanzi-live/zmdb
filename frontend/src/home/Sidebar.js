import * as React from 'react';
import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { context } from './context';
import config from '../config';

export const Sidebar = () => {

    const { organizations } = React.useContext(context);
    const params = useParams();

    // if (!params.organizationId) {
    //     return <Navigate to="/organizations/1" replace={true} />
    // }
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
                                <Avatar src={`${config.url.file}/organizations/${organization.id}@100x100.webp`}/>
                            </ListItemAvatar>
                            <ListItemText primary={organization.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}