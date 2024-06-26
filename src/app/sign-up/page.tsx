"use client";
import { Box, Grid, Paper, Link as MUILink, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import URLS from '../router';
import Link from 'next/link';
import { useAlert } from '../hooks/useAlert';

type Props = {}

const SignUp = (props: Props) => {
    const { showAlert } = useAlert();
    let initialData = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
    }
    const [errors, setErrors] = useState<{ [key: string]: string }>(initialData);
    const [formData, setFormData] = useState(initialData);

    const handlePasswordMatch = (e: any) => {
        let { password } = formData;
        let { value: confirm_password } = e.target;
        if (password !== confirm_password) {
            setErrors((prev) => ({
                ...prev,
                ['confirm_password']: "Password and confirm password should be match",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                ['confirm_password']: "",
            }));
        }
    }

    const handleBlur = (e: any) => {
        let { name, value } = e.target;
        setErrors((prev) => ({
            ...prev,
            [name]: !value ? "Required" : ""
        }));
    }

    const handleChange = (e: any) => {
        handleBlur(e);
        let { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const validateData = (object: any) => {
        let errors: any = {};
        Object.keys(object)?.forEach((key, index, array) => {
            if (!object[key]) {
                errors[key] = "Required";
            } else {
                errors[key] = "";
            }
        });
        setErrors((prev) => ({ ...prev, ...errors }));
        return Object?.values(errors)?.filter((value) => !!value)?.length;
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validateData(formData)) {
            console.log("done")
            showAlert("This is a message");
        } else {
        }
    }

    const handleReset = () => {
        setFormData(initialData);
        setErrors(initialData);
    }

    let isError = Boolean(Object?.values(errors)?.filter((value) => !!value)?.length);

    return (
        <Box display={"flex"} flex={1} alignItems={"center"} justifyContent={"center"} height={"97vh"} margin={"auto"}>
            <Paper
                elevation={24}
                sx={{
                    minWidth: 400,
                    padding: 5,
                }}
            >
                <Box mb={2}>
                    <Typography
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "22px",
                        }}
                    >
                        Sign Up
                    </Typography>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit}>
                        <Grid display={"flex"} gap={2} flexDirection={"column"}>
                            <Grid item>
                                <Input
                                    label={"First Name"}
                                    name="first_name"
                                    id="first_name"
                                    placeholder="Enter First Name"
                                    type="text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={errors?.first_name || ""}
                                    error={Boolean(errors?.first_name)}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    label={"Last Name"}
                                    name="last_name"
                                    id="last_name"
                                    placeholder="Enter Last Name"
                                    type="text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={errors?.last_name || ""}
                                    error={Boolean(errors?.last_name)}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    label={"Email"}
                                    name="email"
                                    id="email"
                                    placeholder="Enter Email Name"
                                    type="email"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={errors?.email || ""}
                                    error={Boolean(errors?.email)}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    label={"Phone Number"}
                                    name="phone"
                                    id="phone"
                                    placeholder="Enter phone Number"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={errors?.phone || ""}
                                    error={Boolean(errors?.phone)}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    label={"Password"}
                                    name="password"
                                    id="password"
                                    placeholder="Enter Password Name"
                                    type="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={errors?.password || ""}
                                    error={Boolean(errors?.password)}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    label={"Confirm Password"}
                                    name="confirm_password"
                                    id="confirm_password"
                                    placeholder="Enter Confirm Password"
                                    type="password"
                                    onBlur={(e) => {
                                        handleBlur(e);
                                        handlePasswordMatch(e);
                                    }}
                                    onChange={(e) => {
                                        handleChange(e);
                                        handlePasswordMatch(e);
                                    }}
                                    helperText={errors?.confirm_password || ""}
                                    error={Boolean(errors?.confirm_password)}
                                />
                            </Grid>
                            <Grid item
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                }}
                            >
                                <Button type={"submit"} disabled={isError}>Submit</Button>
                                <Button type={"reset"} variant={"text"} disabled={isError} onClick={handleReset}>Reset</Button>
                            </Grid>
                            <Grid item>
                                <MUILink
                                    component={Link}
                                    href={URLS.SignIn}
                                    color="text.secondary"
                                    variant='subtitle2'
                                    sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                                >
                                    Already account?
                                </MUILink>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

            </Paper >
        </Box >
    )
}

export default SignUp;