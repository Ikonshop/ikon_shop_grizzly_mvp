import { getSingleProductBySku, VerifyAPIKey, UpdateAPIKeyCount } from '../../../../../lib/api'

export default async (req, res) => {
    const key = req.query.key;
    const verified = await VerifyAPIKey(key);
    console.log('verified', verified)
    if (!verified) {
        res.statusCode = 401;
        res.end("Unauthorized");
        return;
    }

    const sku = req.query.id;
    const product = await getSingleProductBySku(sku)

    await UpdateAPIKeyCount(key, verified + 1);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(product));
}

export async function getStaticProps({ params }) {
    const data = await getSingleProductBySku(params.slug);
    return {
      props: {
        product: data,
      },
    };
  }
  
  export async function getStaticPaths() {
    const data = await fetchProducts("ABC");
    const paths = data.map((product) => ({
      params: {
        slug: product.id,
      },
    }));
    return {
      paths,
      fallback: true,
    };
  }
  