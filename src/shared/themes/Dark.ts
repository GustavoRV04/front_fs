import { createTheme } from "@mui/material";
import { cyan, yellow } from "@mui/material/colors";

export const DarkTheme = createTheme({    
    palette: {
        primary: {
            main: yellow[700],
            dark: yellow[800],
            light: yellow[500],
            contrastText: "#ffffff"
        },
        secondary: {
            main: cyan[500],
            dark: cyan[600],
            light: cyan[400],
            contrastText: "#ffffff"
        },
        background: {
            default: "#202124",
            paper: "#303134"
        },

    }});