'use client';
import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
    palette: {
        primary: {
            main: '#12B495',
            100: 'rgba(18, 180, 149, 0.1)',
            800: 'rgba(18, 180, 149, 0.80)',
        },
        secondary: {
            main: '#3F5C76',
            900: 'rgba(63, 92, 118, 0.9)',
            800: 'rgba(63, 92, 118, 0.80)',
            100: 'rgba(63, 92, 118, 0.1)',
        },
        error: {
            main: '#D32F2F',
            800: 'rgba(211, 47, 47, 0.80)',
        },
        warning: {
            main: '#F58F30',
            800: 'rgba(245, 143, 48, 0.80)',
        },
        text: {
            primary: "#333333",
            secondary: "#666666",
            primary300: "#8C8C8C",
            white: "#ffffff",
            dark: "#262626",
        },
        dark: {
            main: "#000000",
            800: "rgba(0,0,0,0.87)",
            600: "rgba(0,0,0,0.6)",
            500: "rgba(0,0,0,0.5)",
            100: "rgba(0, 0, 0, 0.1)",
        },
        gray: {
            gray1: "#333333",
        },
        lightGray: '#FAFBFF',
        bgColor: '#FAFBFF',
        offWhite: '#F8F8F8',
        border: {
            main: '#E2E4EC',
        },
        white: '#ffffff',
    },
    typography: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        h1: {
            fontWeight: 700,
            fontSize: 16
        },
        body1: {
            fontWeight: 400,
            fontSize: 16,
        },
        body2: {
            fontWeight: 400,
            fontSize: 14,
        }
    },
    // shadows: [
    //     "none",
    //     "0px 2px 4px -1px rgba(0, 0, 0, 0.20), 0px 1px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
    //     "0px 2px 2px 0px rgba(0, 0, 0, 0.25)",
    //     "0px 6px 8px 0px rgba(0, 0, 0, 0.25)",
    //     "0px 15px 52px 15px rgba(50, 59, 82, 0.15)",
    //     ...Array(20).fill("none"),
    // ]
});

export default customTheme;