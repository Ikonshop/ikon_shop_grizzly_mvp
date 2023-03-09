import React, { useState, useEffect } from "react";
import styles from "../../components/Notification/styles/Notification.module.css";


const Notification = (props) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    
    useEffect(() => {
        if (props.message) {
        setShow(true);
        setMessage(props.message);
        setType(props.type);
        }
    }, [props.message]);
    
    const handleClose = () => {
        setShow(false);
    };

    // after 2 seconds, close the notification
    useEffect(() => {
        if (show) {
        setTimeout(() => {
            setShow(false);
        }, 2000);
    }
    }, [show]);
    
    return (
        <div
            className={
                show
                ? type === "error"
                    ? styles.error
                    : styles.success
                : styles.hidden
            }
        >
            <div className={styles.notification}>
                <p>{message}</p>
                <button onClick={handleClose}>X</button>
            </div>
        </div>
    );
}

export default Notification;