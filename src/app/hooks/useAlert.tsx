"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

type Severity = "success" | "error" | "info" | "warning";

interface AlertContextType {
    showAlert: (message: string, severity?: Severity) => void;
}

interface AlertProviderProps {
    children: ReactNode;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<Severity>("success");

    const showAlert = (newMessage: string, newSeverity: Severity = "success") => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setOpen(true);
    };

    const hideAlert = () => {
        setOpen(false);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={hideAlert}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={hideAlert} severity={severity}>
                    {(message)} {/* Ensure your utility function is correctly typed */}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};
