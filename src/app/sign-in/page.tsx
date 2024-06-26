"use client";
import { Box, FormControl, FormLabel, Grid, Paper, Link as MUILink, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import URLS from '../router';
import Link from 'next/link';

type Props = {}

const SignIn = (props: Props) => {
    let initialData = {
        email: "",
        password: "",
    }
    const [errors, setErrors] = useState<{ [key: string]: string }>(initialData);
    const [formData, setFormData] = useState(initialData);

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
        } else {
            console.log("error")
        }
    }

    const handleReset = () => {
        setFormData(initialData);
        setErrors(initialData);
    }

    let isError = Boolean(Object?.values(errors)?.filter((value) => !!value)?.length);

    return (
        <Box display={"flex"} flex={1} alignItems={"center"} justifyContent={"center"} height={"90vh"}>
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
                        Sign In
                    </Typography>
                </Box>
                <Box>
                    <form onSubmit={handleSubmit}>
                        <Grid display={"flex"} gap={2} flexDirection={"column"}>
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
                                    href={URLS.SignUP}
                                    color="text.primary300"
                                    variant='subtitle2'
                                    sx={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
                                >
                                    Create account?
                                </MUILink>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

            </Paper >
        </Box >
    )
}

export default SignIn;