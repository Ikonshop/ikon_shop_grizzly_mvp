import { fetchProductsByCollectionOwner, VerifyAPIKey, UpdateAPIKeyCount } from "../../../../lib/api";

export default async (req, res) => {
    const key = req.query.key;
    const verified = await VerifyAPIKey(key);
    console.log('verified', verified)
    if (!verified) {
        res.statusCode = 401;
        res.end("Unauthorized");
        return;
    }
   
    const collection = req.query.collection;
    const products = await fetchProductsByCollectionOwner(collection);

    await UpdateAPIKeyCount(key, verified + 1);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(products));

}