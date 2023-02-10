import React from 'react';
import Green from '../components/Alert/Green'

export default function useGreen(message) {
    console.log("useGreen triggered")
    console.log("passing in msg, ", message);
    return (
        <Green message={message} />
    )
}
