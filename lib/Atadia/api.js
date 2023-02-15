const token = 'CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc';
const token_address = 'EaC47JGNuHwQ5EuzFy2R79pC7yBAkrPuJhJZbYfvVXnj';
const twitter = 'topshotturtles';

export const GetPublickeyTwitterPfpScore = async(req) => {
    try{
        //https://api-gate-mg6fwvzq3a-as.a.run.app/api/pfpscore/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&twitter=topshotturtles
        console.log('GetPublickeyTwitterPfpScore', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/pfpscore/{token}?wallets={wallets}?wallets=${publicKey}&twitter=${twitter}`);
        const json = await data.json();
        console.log('pfp response',json);
        return json;
    }catch(e){
        console.log('error with PFP score', e)
    }
}



export const GetPublickeyCreditScore = async(req) => {
    try{
        console.log('GetPublickeyCreditScore', req)
        const publicKey = req;
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/creditscore/{token}?wallets={wallets}&include_connected_wallet={bool}
        //https://api-gate-mg6fwvzq3a-as.a.run.app/api/creditscore/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n&include_connected_wallet=false
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/creditscore/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('credit response',json);
        return json;
    }catch(e){
        console.log('error with Credit Score', e)
    }
}

export const GetPublickeyDiamondHandScore = async(req) => {
    try{
        console.log('GetPublickeyDiamondHandScore', req)
        //https://api-gate-mg6fwvzq3a-as.a.run.app/api/diamond/{token}?wallets={wallets}&discord_id={discord_id}&include_connected_wallet={bool}
        
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/diamond/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('diamond response',json);
        return json;
    }catch(e){
        console.log('error with Diamond Hand Score', e)
    }
}

export const GetPublickeyMintLoverScore = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/mint_lover/{token}?wallets={wallets}&discord_id={discord_id}&include_connected_wallet={bool}
        console.log('GetPublickeyMintLoverScore', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/mint_lover/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('mint lover response',json);
        return json;
    }catch(e){
        console.log('error with Mint Lover Score', e)
    }
}

export const GetTokenAddressRoyaltyContribution = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/royalty/{token}?token_address={token_address}
        console.log('GetPublickeyRoyaltyContributionScore', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/royalty/${token}?token_address=${token_address}`);
        const json = await data.json();
        console.log('royalty response',json);
        return json;
    }catch(e){
        console.log('error with Royalty Contribution Score', e)
    }
}

export const GetPublickeyWealth = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/wealth/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
        console.log('GetPublickeyWealth', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/wealth/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('wealth response',json);
        return json;
    }catch(e){
        console.log('error with Wealth Score', e)
    }
}

export const GetPublickeyDemographics = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/demographic/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
        console.log('GetPublickeyDemographics', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/demographic/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('demographic response',json);
        return json;
    }catch(e){
        console.log('error with Demographics Score', e)
    }
}

export const GetPublickeyTransactionFrequency = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_frequency/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
        console.log('GetPublickeyTransactionFrequency', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_frequency/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('transaction frequency response',json);
        return json;
    }catch(e){
        console.log('error with Transaction Frequency Score', e)
    }
}

export const GetPublickeyTransactionVolume = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_volume/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
        console.log('GetPublickeyTransactionVolume', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/transaction_sol_volume/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('transaction volume response',json);
        return json;
    }catch(e){
        console.log('error with Transaction Volume Score', e)
    }
}

export const GetPublickeySecondaryMarketActivity = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/secondary_market_activities/CutjUpyR8n0Ie8q236gIEWbeBHQQsTYc?wallets=BdP8KyTAFmEF2L8DTufgYxQKr3V9ZBBgmfBRcqnFke1t&include_connected_wallet=false
        console.log('GetPublickeySecondaryMarketActivity', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/secondary_market_activities/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('secondary market activity response',json);
        return json;
    }catch(e){
        console.log('error with Secondary Market Activity Score', e)
    }
}

export const GetPublickeyProfitLoss = async(req) => {
    try{
        // https://api-gate-mg6fwvzq3a-as.a.run.app/api/profit_loss/
        console.log('GetPublickeyProfitLoss', req)
        const publicKey = req;
        const data = await fetch(`https://api-gate-mg6fwvzq3a-as.a.run.app/api/profit_loss/${token}?wallets=${publicKey}&include_connected_wallet=false`);
        const json = await data.json();
        console.log('profit loss response',json);
        return json;
    }catch(e){
        console.log('error with Profit Loss Score', e)
    }
}