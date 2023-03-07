import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

// const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_KEY, {
//   extensions: [new OAuthExtension()],
// });


// await magic.oauth.loginWithRedirect({
//     provider: 'discord',
//     redirectURI: 'https://your-app.com/your/oauth/callback',
//     scope: ['user:email'] /* optional */,
//   });

// const result = await magic.oauth.getRedirectResult();

// create a handler for the OAuth callback route that

export const verifyWithDiscord = async (req, res) => {
    console.log('req', req)
    const magic = new Magic('pk_live_CD0FA396D4966FE0', {
        extensions: [new OAuthExtension()],
    });

    // use magic.oauth.loginWithRedirect() to initiate the OAuth flow
    //use discord as a provider 
    await magic.oauth.loginWithRedirect({
        provider: 'discord',
        redirectURI: `http://localhost:3000/dashboard/?userSettings=true&discordVerify=true`,
    });
};

export const verifyWithGoogle = async (req, res) => {
    console.log('req', req)
    const magic = new Magic('pk_live_CD0FA396D4966FE0', {
        extensions: [new OAuthExtension()],
    });

    // use magic.oauth.loginWithRedirect() to initiate the OAuth flow
    //use discord as a provider 
    await magic.oauth.loginWithRedirect({
        provider: 'google',
        redirectURI: `http://localhost:3000/dashboard/?userSettings=true&googleVerify=true`,
    });
};
