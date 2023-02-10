import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <title>IKONSHOP | web3 shopping</title>
        <link rel="icon" href="/iklogo.png" />
        <meta name="title" content="IkonShop.io" />
        <meta
          name="description"
          content="A web3 Shopping & Payment service. Send Payment Requests, manage subscriptions and Setup Tips all in one place. We build native web3 merchant services."
        />

        {/* Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="IkonShop.io" />
        <meta
          property="og:description"
          content="A web3 Shopping & Payment service. Send Payment Requests and Setup Tips."
        />
        <meta property="og:image" content="/newlogo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="IkonShop.io" />
        <meta
          property="twitter:description"
          content="A web3 Shopping & Payment service. Send Payment Requests and Setup Tips."
        />
        <meta property="twitter:image" content="/newlogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600&family=Six+Caps&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          // integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
          // crossOrigin="anonymous"
          // referrerPolicy="no-referrer"
        />

        <link
          href="https://use.fontawesome.com/releases/v5.15.1/css/all.css"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html:
            `
              @font-face {
              font-family: "Manrope";
              src: url("/public/fonts/Manrope.ttf") format("truetype");
            },
                  @font-face {
              font-family: "Six Caps";
              src: url("/six.ttf") format("truetype");
            }
            `,  
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
