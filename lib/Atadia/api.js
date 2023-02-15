const token = 'CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc';
const token_address = 'EaC47JGNuHwQ5EuzFy2R79pC7yBAkrPuJhJZbYfvVXnj';
const twitter = 'topshotturtles';

export const GetPublickeyTwitterPfpScore = async(req) => {
    //https://api-gate-mg6fwvzq3a-as.a.run.app/api/pfpscore/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&twitter=topshotturtles
    console.log('GetPublickeyTwitterPfpScore', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/pfpscore/{token}?wallets={wallets}?wallets=${publicKey}&twitter=${twitter}`);
    const json = await data.json();
    console.log('pfp response',json);
    return json;
}



export const GetPublickeyCreditScore = async(req) => {
    console.log('GetPublickeyCreditScore', req)
    const publicKey = req.publicKey;
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/creditscore/{token}?wallets={wallets}&include_connected_wallet={bool}
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/creditscore/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('credit response',json);
    return json;
}

export const GetPublickeyDiamondHandScore = async(req) => {
    console.log('GetPublickeyDiamondHandScore', req)
    //https://api-gate-mg6fwvzq3a-as.a.run.app/api/diamond/{token}?wallets={wallets}&discord_id={discord_id}&include_connected_wallet={bool}
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/diamond/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('diamond response',json);
    return json;
}

export const GetPublickeyMintLoverScore = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/mint_lover/{token}?wallets={wallets}&discord_id={discord_id}&include_connected_wallet={bool}
    console.log('GetPublickeyMintLoverScore', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/mint_lover/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('mint lover response',json);
    return json;
}

export const GetTokenAddressRoyaltyContribution = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/royalty/{token}?token_address={token_address}
    console.log('GetPublickeyRoyaltyContributionScore', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/royalty/${token}?token_address=${token_address}`);
    const json = await data.json();
    console.log('royalty response',json);
    return json;
}

export const GetPublickeyWealth = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/wealth/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
    console.log('GetPublickeyWealth', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/wealth/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('wealth response',json);
    return json;
}

export const GetPublickeyDemographics = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/demographic/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
    console.log('GetPublickeyDemographics', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/demographic/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('demographic response',json);
    return json;
}

export const GetPublickeyTransactionFrequency = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_frequency/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
    console.log('GetPublickeyTransactionFrequency', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_frequency/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('transaction frequency response',json);
    return json;
}

export const GetPublickeyTransactionVolume = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_volume/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
    console.log('GetPublickeyTransactionVolume', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_volume/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('transaction volume response',json);
    return json;
}

export const GetPublickeySecondaryMarketActivity = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/secondary_market_activities/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
    console.log('GetPublickeySecondaryMarketActivity', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/secondary_market_activities/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('secondary market activity response',json);
    return json;
}

export const GetPublickeyProfitLoss = async(req) => {
    // https://api-gate-mg6fwvzq3a-as.a.run.app/api/profit_loss/
    console.log('GetPublickeyProfitLoss', req)
    const publicKey = req;
    const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/profit_loss/${token}?wallets=${publicKey}&include_connected_wallet=false`);
    const json = await data.json();
    console.log('profit loss response',json);
    return json;
}