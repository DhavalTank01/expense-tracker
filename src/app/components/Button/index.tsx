import React from 'react'
import { Box, CircularProgress, Button as MUIButton, } from '@mui/material';

type Props = {
    variant?: any,
    isLoading?: Boolean,
    type?: any,
    disabled?: any,
    children?: any,
    sx?: any,
    onClick?: any,
}

const Button = (props: Props) => {
    let { variant = "contained", isLoading = false, disabled = false, type = "button", children, onClick, ...rest } = props;
    return (
        <MUIButton
            variant={variant}
            disabled={disabled || isLoading}
            type={type}
            sx={variant === "contained" ? [{ color: "white" }] : variant === "text" ? [{ border: 1, }] : []}
            onClick={onClick}
            {...rest}
        >

            {isLoading ? (
                <Box display="flex" alignItems="center">
                    {children}
                    <CircularProgress
                        size={18}
                        color="inherit"
                        style={{ marginLeft: 10 }}
                    />
                </Box>
            ) : (
                children
            )}
        </MUIButton>
    )
}

export default Button;