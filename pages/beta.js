import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Beta.module.css";
import Container from "react-bootstrap/Container";

// Constants
const TWITTER_HANDLE = "TopShotTurtles";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
export const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
export const WEB3STORAGE_TOKEN = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;

/**
 * This renders an item in the table of contents list.
 * scrollIntoView is used to ensure that when a user clicks on an item, it will smoothly scroll.
 */
const Headings = ({ headings, activeId }) => (
  <ul className="beta_nav">
    {headings.map((heading) => (
      <li key={heading.id} className={heading.id === activeId ? "active" : ""}>
        <a
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`).scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          - {heading.title}
        </a>
        {/* {heading.items.length > 0 && (
          <ul>
            {heading.items.map((child) => (
              <li
                key={child.id}
                className={child.id === activeId ? "active" : ""}
              >
                <a
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`).scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  {child.title}
                </a>
              </li>
            ))}
          </ul>
        )} */}
      </li>
    ))}
  </ul>
);

/**
 * Dynamically generates the table of contents list, using any H2s and H3s it can find in the main text
 */
const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = React.useState([]);

  React.useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("main h2")
      // document.querySelectorAll("main h2, main h3")
    );

    // Created a list of headings, with H3s nested
    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    }
    // else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
    //   nestedHeadings[nestedHeadings.length - 1].items.push({
    //     id,
    //     title,
    //   });
    // }
  });

  return nestedHeadings;
};

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = React.useRef({});
  React.useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      // Get all headings that are currently visible on the page
      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      // If there is only one visible heading, this is our "active" heading
      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
        // If there is more than one visible heading,
        // choose the one that is closest to the top of the page
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );

        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: document.querySelector("iframe"),
      rootMargin: "100px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2"));
    // const headingElements = Array.from(document.querySelectorAll("h2, h3"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

/**
 * Renders the table of contents.
 */
const TableOfContents = () => {
  const [activeId, setActiveId] = React.useState();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <aside className={styles.aside} aria-label="Table of contents">
      <Headings headings={nestedHeadings} activeId={activeId} />
    </aside>
  );
};

const Beta = () => {
  return (
    <>
      <div className={styles.beta_App}>
        <div className={styles.beta_hero}>
          <div className={styles.beta_hero_overlay}></div>

          <div className={styles.beta_hero_content}>
            <p>IKONSHOP</p>
            <h1>Beta Testers.</h1>
          </div>
        </div>
        <Container>
          <div className={styles.beta_container}>
            <TableOfContents />
            <main className={styles.main}>
              <h2 id={styles.initial_header}>What is The IkonShop?</h2>
              <p className={styles.body}>
                We are a full-scale web3 shopping marketplace. Our hope is that
                we have created a site that will give you a familiar online
                shopping experience with the ability to browse products, read
                product descriptions, and have an easy & secure checkout. For
                merchants, we wanted to create a way for you to use the power of
                blockchain technology to sell your products/services.
              </p>
              <h4 id={styles.small_header1}>Where did the idea come from?</h4>
              <p className={styles.body}>
                We identified a problem in web3. Projects had to use web2
                platforms, such as Shopify, to sell their products & services.
                The sites that were built on a blockchain were often merch-only
                or offered a limited catalog of available products. We wanted to
                create a site that offered these web3 merchants on-chain
                transactions, implemented metadata, token-gating, & USDC, SOL, &
                SPL token acceptance while also allowing them to sell pretty
                much anything they can dream up.{" "}
              </p>
              <img src="/img.png" className={styles.beta_img} />
              <h4 id={styles.small_header1}>Who can sell on the IkonShop?</h4>
              <p className={styles.body}>
                Anyone. We built The IkonShop with the web3 world in mind, but
                also made it so that it’s an easy transition - even for web3
                newcomers - to what we call “web3commerce.” Projects,
                businesses, and individuals can all sell their products &
                services - IRL or digital - on The IkonShop. We have free
                consultations with our founder - Kruz - to help you set up your
                storefront & discuss everything we have to offer.
              </p>
              <h4 id={styles.small_header1}>
                What are your plans for the future?
              </h4>
              <p className={styles.body}>
                Many months of planning, coding, and idea execution have gone
                into The IkonShop so far. Currently we have our limited access
                beta site open to only holders of the special token. Once our
                beta site is functioning to the highest of its potential, we
                will announce our public launch. We will continue to onboard the
                web3 world and build our merchant & consumer base. Once we gain
                even more traction, our goal is to start onboarding web2
                businesses & individuals who are interested in selling with the
                power of blockchain technology. We will also continue to roll
                out new features for merchants as well as for consumers.
              </p>
              <h4 id={styles.small_header1}>
                Is there an NFT collection connected to The IkonShop?
              </h4>
              <p className={styles.body}>
                Yes! We will be launching our NFT collection after The IkonShop
                is up and running to the public. We want to have our product out
                there so people can see the value they get by owning one or more
                of our NFTs. The Ikons NFT collection pays homage to the styles
                & accessories of the 70’s, 80’s, & 90’s. Our Ikons brand overall
                has these same nostalgic vibes. Our artist is the very talented
                Ricci. She lives & works in Ukraine. She began working on our
                collection back in January, and vowed to finish it even after
                the war started in her country. Ricci completed all of the
                artwork through the toughest of times and has been an
                inspiration to our team.
              </p>
              <img src="/ikonnft.png" className={styles.beta_img} />
              <h2 id={styles.small_header2}>How To Use</h2>
              <ul>
                <li>Connect Wallet</li>
                <li>Browse products or search for specifics</li>
                <li>Checkout, Pay with USDC, SOL, or SPL tokens</li>
                <li>Info on TipJar, Pay Request & how to use</li>
                <li>How to set up a Storefront</li>
                <li>
                  How to use the Dashboard & what features are available right
                  now
                </li>
              </ul>

              <h2 id={styles.small_header3}>Rewards (Contribute to Earn)</h2>
              <h4 id={styles.small_header1}></h4>
              <ul>
                <li>
                  Summarize our community content & share on social media - 0.05
                  SOL (1x per week)
                </li>
                <li>
                  Host any Event in Discord with guidelines (reach out to the
                  Core Team for details) - 0.15 SOL (5x per week)
                </li>
                <li>Invite 10 new verified members - .05 SOL (1x per week)</li>
                <li>
                  Create a guide on how people can use The IkonShop (video walk
                  thru, tweet thread, Google Doc) - 0.10 SOL (1x per week)
                </li>
                <li>
                  Deep dive analysis & share on social media - 0.15 SOL (2x per
                  week)
                </li>
                <li>
                  Compile quality resources & add to our community/discord
                  (educational material) - 0.10 SOL (3x per week, different
                  resources){" "}
                </li>
                <li>
                  Onboard projects/businesses/individuals to set up a storefront
                  on The IkonShop - 1 SOL (capped at 10 SOL max per person)
                </li>
                <li>
                  Share updates/developments for The IkonShop on social media
                  (must be organic or quote tweets tagging @ikonsofSol - RTs &
                  likes don't count) - 0.10 SOL (2x per week)
                </li>
                <li>
                  Identify a bug & reporting it to the team with screenshots -
                  0.10 SOL (5x per week)
                </li>
              </ul>
            </main>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Beta;
