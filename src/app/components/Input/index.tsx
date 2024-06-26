import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { ChangeEventHandler, useRef, useState } from 'react'

type Props = {
    label?: String,
    type?: string,
    variant?: any,
    value?: any,
    placeholder?: String,
    name?: string,
    helperText?: string,
    error?: boolean,
    id?: string,
    required?: undefined,
    disabled?: undefined,
    onChange: ChangeEventHandler,
    onBlur: ChangeEventHandler,
}

const Input = (props: Props) => {
    let { label, type, onChange, onBlur, value, placeholder, name, id, required = false, disabled = false, variant = "standard", helperText, error, ...rest } = props;

    const [passwordVisible, setPasswordVisible] = useState(false);
    const quantityInputRef = useRef(null);

    const handleTogglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };
    return (
        <TextField
            fullWidth
            variant={variant}
            ref={quantityInputRef}
            label={label}
            value={(type === "number" && value === null) ? "" : value}
            onChange={onChange}
            onBlur={onBlur}
            id={id}
            name={name}
            placeholder={placeholder?.length ? `Enter ${placeholder}` : ""}
            required={required}
            type={passwordVisible ? "text" : type}
            disabled={disabled}
            helperText={helperText}
            error={error}
            InputProps={{
                endAdornment: type === "password" && (
                    <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    )
}

export default Input