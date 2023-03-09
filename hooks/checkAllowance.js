import React from "react";

import { CheckForWallet, fetchCollectionIdByOwner, } from "../lib/api";

export async function isMerchant(userPubkey) {
    try{
        console.log("userPubkey", userPubkey);
        const merchant = await fetchCollectionIdByOwner(userPubkey);

        if (merchant) {
            return true;
        }

        return false;
    }catch(err){
        console.log(err);
    }
}

export async function isUser(userPubkey) {
        try{
            const user = await CheckForWallet(userPubkey);
        
            if (user) {
                console.log("user", user);
                return true;
            }
        
            return false;
        }catch(err){
            console.log(err);
        }
    }