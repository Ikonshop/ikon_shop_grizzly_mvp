import React from "react";
import { Container } from "react-bootstrap";

export default function Merchant() {
  return (
    <Container>
      <div className="ik_merchant">
        <h2 className="powered_title">IkonShop Merchant</h2>

        <article className="episode">
          <div className="episode__number">01</div>
          <div className="episode__content">
            <div className="title">Features</div>
            <div className="story">
              <div className="ik_merchant_content">
                <ul>
                  <strong>Web3 Connectivity:</strong>
                  <br />
                  <li>
                    Connect App with Phantom, Solflare, and more Solana based
                    wallets.
                  </li>
                  <br />
                  <strong>Dedicated URL:</strong>
                  <br />
                  <li>
                    Unique URL/Link to send customers to shop goods/services.
                  </li>
                  <br />
                  <strong>TokenGated Paywall (optional):</strong>
                  <br />
                  <li>
                    Option to Gate customer on a specific Token or NFT
                    collection.
                  </li>
                  <br />
                  <strong>Checkout Cart:</strong>
                  <br />
                  <li>Users can shop and add items from multiple merchants.</li>
                  <br />
                  <strong>Add Socials:</strong>
                  <br />
                  <li>
                    Display Socials - Website, Twitter, Medium, Instagram on
                    your dedicated Shop.
                  </li>
                  <br />
                  <strong>Analytics:</strong>
                  <br />
                  <li>Access Reports of products or any time-frame.</li>
                  <br />
                  <strong>Plugins & Integrations:</strong>
                  <br />
                  <li>E-commerce, drop-shipping integrations</li>
                  <li>Shopify</li>
                  <li>Printful</li>
                  <li>and more</li>
                  <br />
                  <strong>Logistic Tools:</strong>
                  <br />
                  <li>Shipping & tracking Integrations</li>

                  <br />
                </ul>
              </div>
            </div>
          </div>
        </article>

        <article className="episode">
          <div className="episode__number">02</div>
          <div className="episode__content">
            <div className="title">Benefits</div>
            <div className="story">
              <div className="ik_merchant_content">
                <ul>
                  <li>Reach a broader audience browsing other projects.</li>
                  <li>$0 Startup costs.</li>
                  <li>Unlock full potential and vision of your projects.</li>
                  <li>Built-in Tools, easy to use plugins.</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <article className="episode">
          <div className="episode__number">03</div>
          <div className="episode__content">
            <div className="title">Pricing</div>
            <div className="story">
              <div className="ik_merchant_content">
                <ul>
                  <li>$0 startup costs.</li>
                  <li>
                    .50% per Transaction Fee. (0.5 cents USDC per 100 $USDC).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Container>
  );
}
