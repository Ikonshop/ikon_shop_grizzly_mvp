import React, { useEffect, useState } from "react";
import { getTwitterUserData } from "../../lib/twitter";

const Community = () => {
    const [twitterData, setTwitterData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const data = await getTwitterUserData("topshotturtles");
            console.log('data', data);
            setTwitterData(data);
        }
        getData();

    }, []);

    return (
        <div>
            <h1>Community</h1>
            {twitterData && (
                <div>
                    <h2>{twitterData.data.name}</h2>
                    <h3>{twitterData.data.username}</h3>
                    <p>{twitterData.data.description}</p>
                    <img src={twitterData.data.profile_image_url} />
                </div>
            )}
        </div>
    );
}

export default Community;