import { Magic } from "magic-sdk";
import { SolanaExtension } from "@magic-ext/solana";

export const checkMagicLogin = async () => {
  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_KEY, {
      extensions: {
          solana: new SolanaExtension({
              rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
          }),
      },
  });
  const loggedIn = await magic.user.isLoggedIn();
  console.log('loggedIn', loggedIn)
  if(loggedIn) {
      magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
          window.dispatchEvent(new Event('magic-logged-in'));
      });
      // get user data
      const data = await magic.user.getMetadata();
      localStorage.setItem('userMagicMetadata', JSON.stringify(data));
      window.dispatchEvent(new Event('magic-logged-in'));
      return true
  }
  return false;
};
