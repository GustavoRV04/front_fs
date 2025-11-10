import { Inbox } from '@mui/icons-material';
import { Avatar, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Box } from '@mui/system';

interface IMenuLateralProps {
    children: React.ReactNode;
}


export const MenuLateral: React.FC<IMenuLateralProps> = ({ children }) => {
    const theme = useTheme();

    return (
        <>
            <Drawer  variant='permanent'>
                <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    
                    <Box width="100%" height={theme.spacing(20)} display="flex" justifyContent="center" alignItems="center">
                        <Avatar sx={{ height: theme.spacing(12), width: theme.spacing(12)}} src="Imagem do WhatsApp de 2025-10-07 à(s) 08.48.01_f43c9bd9.jpg"/>
                    </Box>

                    <Divider/>

                    <Box flex={1}>
                        <List component="nav">
                            <ListItemButton>
                                <ListItemIcon>
                                    <Icon>home</Icon>
                                </ListItemIcon>
                                <ListItemText primary="Página inicial"/>

                            </ListItemButton>
                            
                        </List>

                    </Box>

                </Box>
            </Drawer>

            <Box height="100vh" marginLeft={theme.spacing(28)}>
                {children}
            </Box>
        </>
    );
};   