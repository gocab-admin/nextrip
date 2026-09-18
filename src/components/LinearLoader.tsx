'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme({
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: '3px!important',
                    backgroundColor:'#D8D8D8',
                    animationDuration: '2.2s'
                },
                bar: {
                    backgroundColor: 'var(--search-button-color)',
                    animationDuration: '2.2s'
                }
            }
        }
    },
});

export default function LinearLoader({loading}:{loading:boolean}) {
    return (
        <ThemeProvider theme={theme}>
            {
                loading &&
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box>
            }
        </ThemeProvider>

    );
}
