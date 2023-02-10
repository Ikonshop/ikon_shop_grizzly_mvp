const { Magic } = require('@magic-sdk/admin')

// export const magic = new Magic('pk_live_1DD1FA40DA4E4EE2')
export const magic = new Magic('pk_live_1DD1FA40DA4E4EE2', {
  extensions: [new ConnectExtension()],
});