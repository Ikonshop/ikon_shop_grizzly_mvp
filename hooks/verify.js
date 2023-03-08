import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const magic_key = process.env.NEXT_PUBLIC_MAGIC_KEY;

export const verifyWithDiscord = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'discord',
        redirectURI: `http://localhost:3000/dashboard/?userSettings=true&discordVerify=true`,
    });
};

export const verifyWithGoogle = async (req) => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `http://localhost:3000/dashboard/?userSettings=true&googleVerify=true`,
    });
};

export const verifyMerchantWithDiscord = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'discord',
        redirectURI: `http://localhost:3000/dashboard/?merchantSettings=true&discordVerify=true`,
    });
}

export const verifyMerchantWithGoogle = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `http://localhost:3000/dashboard/?merchantSettings=true&googleVerify=true`,
    });
}