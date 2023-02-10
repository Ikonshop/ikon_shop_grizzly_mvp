import { useState, ClipboardEventHandler} from "react";
import { Clipboard } from "react-ionicons";


export default function useClipboard(e) {
    console.log("copying to clipboard", e)

  //  provide a way to copy the text to the clipboard for android

    
    
    const copyToClipboard = () => {
        const linkToCopy = `https://ikonshop.io/product/${e}`;

        navigator.clipboard
            .writeText(linkToCopy)
            .then(() => {
                console.log("copied")
              })
              .catch(() => {
                alert("something went wrong");
              });
    }

    copyToClipboard();
    
}
