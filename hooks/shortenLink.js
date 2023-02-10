import React, {useState, useEffect} from 'react';


const ShortenLink = async (obj) => {
    const [link, setLink] = useState('');
    const [shortLink, setShortLink] = useState('');

    const apiToken = 'abf2551047e2f3406b79eb5731cc30b9b38f1434';
    const fakeLink = 'https://www.ikonshop.io/product/cl6z7gdjl4i7d0bhdf32vt9mu'

    // execute GET request to shorten link to https://urlmee.com/api?api=abf2551047e2f3406b79eb5731cc30b9b38f1434&url=yourdestinationlink.com&alias=CustomAlias

    

    const shortenLink = async () => {
        const response = await fetch(`https://urlmee.com/api?api=${apiToken}&url=${link}&alias=CustomAlias`);
        const data = await response.json();
        setShortLink(data.short_url);
        console.log('this is the short link', data.short_url);
    };

    useEffect(() => {
        setLink(obj);
        shortenLink();

    }, [obj]);

    
    return shortLink;
}


export default ShortenLink;