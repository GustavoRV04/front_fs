
import { Avatar, useMediaQuery, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useAppThemeContext, useDrawerContext } from '../../contexts';
import React from 'react';
import { } from 'events';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';

interface IListItemLinkProps {
    to: string;
    label: string;
    icon: string;
    onClick: (() => void) | undefined;
}


const ListItemLink: React.FC<IListItemLinkProps> = ({to, icon, label, onClick}) => {

    const navigate = useNavigate();

    const resolvedPath = useResolvedPath(to);
    const match = useMatch({ path: resolvedPath.pathname, end: false });

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <ListItemButton selected={!!match} onClick={handleClick}>
                <ListItemIcon>
                    <Icon>{icon}</Icon>
                </ListItemIcon>
            <ListItemText primary={label}/>
        </ListItemButton>  
    );
};


interface IMenuLateralProps {
    children: React.ReactNode;
}

export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
    const {toggleTheme} = useAppThemeContext();

    return (
        <>
            <Drawer  open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
                <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column">
                    
                    <Box width="100%" height={theme.spacing(20)} display="flex" justifyContent="center" alignItems="center">
                        <Avatar sx={{ height: theme.spacing(12), width: theme.spacing(12)}} src="Imagem do WhatsApp de 2025-10-07 à(s) 08.48.01_f43c9bd9.jpg"/>
                    </Box>

                    <Divider/>

                    <Box flex={1}>
                        <List component="nav">
                            {drawerOptions.map(drawerOption => (
                            <ListItemLink
                            key={drawerOption.path}
                            icon={drawerOption.icon}
                            label={drawerOption.label}
                            to={drawerOption.path}
                            onClick={smDown ? toggleDrawerOpen : undefined}
                            />
                            ))}
                        </List>
                    </Box>

                    <Box>
                        <List component="nav">
                            <ListItemButton onClick={toggleTheme}>
                                <ListItemIcon>
                                    <Icon>dark_mode</Icon>
                                </ListItemIcon>
                            <ListItemText primary="Mudar Tema"/>
                            </ListItemButton>  
                        </List>
                    </Box>
                </Box>
            </Drawer>

            <Box height="100vh" marginLeft={smDown ?  0 : theme.spacing(28)}>
                {children}
            </Box>
        </>
    );
};   