import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

const magic_key = process.env.NEXT_PUBLIC_MAGIC_KEY;

export const verifyWithDiscord = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'discord',
        redirectURI: `https://ikon-shop-grizzly-mvp.vercel.app/dashboard/?userSettings=true&discordVerify=true`,
    });
};

export const verifyWithGoogle = async (req) => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `https://ikon-shop-grizzly-mvp.vercel.app/dashboard/?userSettings=true&googleVerify=true`,
    });
};

export const verifyMerchantWithDiscord = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'discord',
        redirectURI: `https://ikon-shop-grizzly-mvp.vercel.app/dashboard/?merchantSettings=true&discordVerify=true`,
    });
}

export const verifyMerchantWithGoogle = async () => {
    const magic = new Magic(magic_key, {
        extensions: [new OAuthExtension()],
    });
    await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `https://ikon-shop-grizzly-mvp.vercel.app/dashboard/?merchantSettings=true&googleVerify=true`,
    });
}