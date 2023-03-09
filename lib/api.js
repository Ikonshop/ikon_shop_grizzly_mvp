import { request, gql, GraphQLClient } from 'graphql-request';
import { useState } from 'react';


const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const GRAPHCMS_TOKEN = process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN;
const graphQLClient = new GraphQLClient((graphqlAPI), {
  headers: {
    authorization: `Bearer ${GRAPHCMS_TOKEN}`,
  },
});

// Before we add the new order we need to query the existing itemID's in the DB and add them to the update if they exist
export const addOrder = async (order, req, res) => {
  console.log("order is this", order);
  const productId = order.id;
  const buyer = order.buyer;
  const email = order.email;
  const shippingInfo = order.shippingInfo;
  const purchaseDate = order.purchaseDate;
  const expireDate = order.expireDate;
  const price = order.price;
  const orderID = order.orderID;
  const subID = order.subID;
  const token = order.token;
  const note = order.note;
  const twitter = order.twitter;
  const discord = order.discord;
  const colorOption = order.colorOption

    const query = gql`
      mutation AddOrder(
        $orderID:String!,
        $buyer:String!,
        $email:String!,
        $shippingInfo:String!,
        $purchaseDate:DateTime,
        $price:String!,
        $token:String!,
        $note:String!,
        $twitter:String!,
        $discord:String!,
        $productId: ID,
        $colorOption:String!
        ) {
      createOrder(data: {
        buyer: $buyer,
        email: $email,
        shipping: $shippingInfo,
        purchaseDate: $purchaseDate,
        price: $price,
        orderID: $orderID,
        token: $token,
        note: $note
        twitter: $twitter
        discord: $discord
        colorOption: $colorOption
        productid: {connect: {id: $productId}}
      }) {
        id
      } 
    }
    `;
  

  const result1 = await graphQLClient.request(query, {
    orderID: orderID,
    buyer: buyer,
    email: email,
    shippingInfo: shippingInfo,
    purchaseDate: purchaseDate,
    expireDate: expireDate,
    price: price,
    subID: subID,
    token: token,
    note: note,
    twitter: twitter,
    discord: discord,
    colorOption: colorOption,
    productId: productId
  });
  console.log("result1", result1);

  const query2 = gql`
    mutation PublishOrder($id: ID!) {
      publishOrder(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }
  `;
  const result2 = await graphQLClient.request(query2, {
    id: result1.createOrder.id,
  });


  return console.log("your order has been added: ", result2);
}

export const updateProductCounts = async (product) => {
  
  const productId = product;

  var query = gql`
  query GetProductCounts ($productId: ID!) {
    product(where: {id: $productId}) {
      id
      purchasedCount
      quantity
    }
  }
  `;
  const productCounts = await request(graphqlAPI, query, { productId: productId });
  console.log("productCounts", productCounts);
  const newQuantity = (productCounts.product.quantity - 1);
  console.log("newQuantity", newQuantity);
  const newCount = (productCounts.product.purchasedCount + 1);
  console.log("newCount", newCount);
  const countId = productCounts.product.id;
  console.log("countId", countId);

  var query = gql`
  mutation UpdateCounts($countId: ID, $newQuantity: Int, $newCount: Int) {
    updateProduct(
      data: {purchasedCount: $newCount, quantity: $newQuantity},
      where: {id: $countId}
    ) {
      id
      purchasedCount
      quantity
    }
    publishProduct(where: {id: $countId}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    countId: countId,
    newQuantity: newQuantity,
    newCount: newCount,
  });
  return console.log("product counts updated: ", result);

}

export const addProduct = async (product) => {
  var fileName = "noFile";
  var fileHash = "noHash";
  var price = "0";

  if (product.file) {
    var fileName = product.filename;
    var fileHash = product.hash;
    console.log("fileName", fileName);
    console.log("fileHash", fileHash);
  }
  if (product.price) {
    var price = product.price;
    console.log("price", price);
  }
  console.log('product', product);
  const name = product.name;
  // console.log("name", name);
  const imageUrl = product.image_url;
  // console.log("imageUrl", imageUrl);
  const token = product.token
  // console.log("token", token);
  const collection = product.collection;
  console.log("collection", collection);
  const owner = product.owner;
  // console.log("owner", owner);
  const description = product.description;
  console.log("description", description);
  // filename is equal to product.filename if it exists, else the filename is equal to noFile
  const filename = fileName;
  // console.log("filename", filename);
  const hash = fileHash;
  // console.log("hash", hash);
  const quantity = parseInt(product.quantity);
  // console.log("quantity", quantity);
  const reqUserEmail = (product.reqUserEmail ? product.reqUserEmail : false);
  // console.log("reqUserEmail", reqUserEmail);
  const reqUserShipping = product.reqUserShipping;
  const reqNote =  (product.reqNote ? product.reqNote : false);
  const reqColor = (product.reqColor ? product.reqColor : false);
  // console.log("reqUserShipping", reqUserShipping);
  const type = product.type;
  // console.log("type", type);


  const query = gql`
  mutation CreateProduct($name: String!, $price: String!, $owner: String!, $token: Token, $imageUrl: String!, $description: String!, $filename: String!, $hash: String!, $quantity: Int!, $reqUserEmail: Boolean!, $reqUserShipping: Boolean!, $type: String!, $collection: ID!, $reqNote: Boolean!, $reqColor: Boolean!) {
    createProduct(data: {name: $name, price: $price, imageUrl: $imageUrl, description: $description, token: $token, filename: $filename, hash: $hash, owner: $owner, collections: {connect: {id: $collection}}, purchasedCount: 0, quantity: $quantity, reqUserEmail: $reqUserEmail, reqUserShipping: $reqUserShipping, reqNote: $reqNote, reqColor: $reqColor, type: $type}) {
      id
      name
      price
      owner
      token
      collections{
        symbol
      }
      imageUrl
      quantity
      purchasedCount
      description
      filename
      hash
      reqUserEmail
      reqUserShipping
      reqNote
      reqColor
      type
    }
  }
    `;
    try {
      const result = await graphQLClient.request(query, {
        name: name,
          price: price,
          token: token,
          quantity: quantity,
          owner: owner,
          collection: collection,
          imageUrl: imageUrl,
          description: description,
          filename: filename,
          hash: hash,
          reqUserEmail: reqUserEmail,
          reqUserShipping: reqUserShipping,
          reqNote: reqNote,
          reqColor: reqColor,
          type: type,
      });   

    console.log('result', result);

    // grab product id from query above
    // console.log("result id", result.createProduct.id);
    const productId = result.createProduct.id;
    const query2 = gql`
    mutation PublishProduct ($productId: ID!, $collection: String!) {
    publishProduct(where: {id: $productId}){
      id
      name
      price
      token
      owner
      quantity
      purchasedCount
      collections(where: {symbol: $collection}){
        symbol
      }
      imageUrl
      description
      filename
      hash
      reqUserEmail
      reqUserShipping
      type
    } 
  }
  `;

  const result2 = await graphQLClient.request(query2, {
    productId: productId,
    collection: collection,
  });  
  
  // console.log('result2', result2);
  return result2;
  } catch (error) {
    alert(error);
  }
};

export const addLink = async (product) => {
  var fileName = "noFile";
  var fileHash = "noHash";
  var price = "0";

  if (product.file) {
    var fileName = product.filename;
    var fileHash = product.hash;
    console.log("fileName", fileName);
    console.log("fileHash", fileHash);
  }
  if (product.price) {
    var price = product.price;
    console.log("price", price);
  }
  console.log('product', product);
  const name = product.name;
  // console.log("name", name);
  const imageUrl = product.image_url;
  // console.log("imageUrl", imageUrl);
  const token = product.token
  // console.log("token", token);
  const collection = product.collection;
  // console.log("collection", collection);
  const owner = product.owner;
  // console.log("owner", owner);
  const description = product.description;
  console.log("description", description);
  // filename is equal to product.filename if it exists, else the filename is equal to noFile
  const filename = fileName;
  // console.log("filename", filename);
  const hash = fileHash;
  // console.log("hash", hash);
  const quantity = parseInt(product.quantity);
  // console.log("quantity", quantity);
  const reqUserEmail = (product.reqUserEmail ? product.reqUserEmail : false);
  // console.log("reqUserEmail", reqUserEmail);
  const reqUserShipping = product.reqUserShipping;
  const reqNote =  (product.reqNote ? product.reqNote : false);
  const reqColor = (product.reqColor ? product.reqColor : false);
  // console.log("reqUserShipping", reqUserShipping);
  const type = product.type;
  // console.log("type", type);


  const query = gql`
  mutation CreateProduct($name: String!, $price: String!, $owner: String!, $token: Token, $imageUrl: String!, $description: String!, $filename: String!, $hash: String!, $quantity: Int!, $reqUserEmail: Boolean!, $reqUserShipping: Boolean!, $type: String!, $collection: String!, $reqNote: Boolean!, $reqColor: Boolean!) {
    createProduct(data: {name: $name, price: $price, imageUrl: $imageUrl, description: $description, token: $token, filename: $filename, hash: $hash, owner: $owner, collections: {connect: {symbol: $collection}}, purchasedCount: 0, quantity: $quantity, reqUserEmail: $reqUserEmail, reqUserShipping: $reqUserShipping, reqNote: $reqNote, reqColor: $reqColor, type: $type}) {
      id
      name
      price
      owner
      token
      collections{
        symbol
      }
      imageUrl
      quantity
      purchasedCount
      description
      filename
      hash
      reqUserEmail
      reqUserShipping
      reqNote
      reqColor
      type
    }
  }
    `;
    try {
      const result = await graphQLClient.request(query, {
        name: name,
          price: price,
          token: token,
          quantity: quantity,
          owner: owner,
          collection: collection,
          imageUrl: imageUrl,
          description: description,
          filename: filename,
          hash: hash,
          reqUserEmail: reqUserEmail,
          reqUserShipping: reqUserShipping,
          reqNote: reqNote,
          reqColor: reqColor,
          type: type,
      });   

    console.log('result', result);

    // grab product id from query above
    // console.log("result id", result.createProduct.id);
    const productId = result.createProduct.id;
    const query2 = gql`
    mutation PublishProduct ($productId: ID!, $collection: String!) {
    publishProduct(where: {id: $productId}){
      id
      name
      price
      token
      owner
      quantity
      purchasedCount
      collections(where: {symbol: $collection}){
        symbol
      }
      imageUrl
      description
      filename
      hash
      reqUserEmail
      reqUserShipping
      type
    } 
  }
  `;

  const result2 = await graphQLClient.request(query2, {
    productId: productId,
    collection: collection,
  });  
  
  // console.log('result2', result2);
  return result2;
  } catch (error) {
    alert(error);
  }
};


// Returns true if a given public key has purchased an item before
export const hasPurchased = async (publicKey, id) => {
  // Send a GET request with the public key as a parameter
  const response = await fetch(`../api/orders?buyer=${publicKey.toString()}`);
  // If response code is 200
  if (response.status === 200) {
    const json = await response;
    // console.log("Current wallet's orders are:", json);
    // If orders is not empty
    if (json.length > 0) {
      // Check if there are any records with this buyer and item ID
      const order = json.find((order) => order.productId === product.id);
      // console.log("wtf are the orders", order)
      if (order) {
        return true;
      }
    }
  }
  return false;
};

export const fetchProducts = async (symbol) => {  
  
  const query = gql`
  query fetchProducts($symbol: String!){
    collections(where: {symbol: $symbol}) {
      products {
        id
        name
        price
        imageUrl
        description
        token
        owner
        purchasedCount
        quantity
        reqUserEmail
        reqUserShipping
      } 
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    symbol: symbol
  });   
  // console.log("check this one", result)
  const productsNoHashes = result.collections[0].products;

  return productsNoHashes;
}

export const fetchProductsByCollectionId = async (id) => {
  const query = gql`
  query fetchProductsByCollectionId($id: ID!){
    collection(where: {id: $id}) {
      banner
      description
      projectName
      symbol
      twitterHandle
      website
      discordServer
      instagramHandle
      youtube
      name
      email
      products {
        id
        name
        price
        imageUrl
        description
        token
        owner
        purchasedCount
        quantity
        reqUserEmail
        reqUserShipping
      }
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });

  const collection = result.collection;

  console.log('collection', result.collection)
  
  return collection;
}

export const fetchCollectionIdByOwner = async (owner) => {
  const query = gql`
  query fetchCollectionIdByOwner($owner: String!){
    collections(where: {owner: $owner}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  const collectionId = result.collections[0].id;
  return collectionId;
}

export const fetchItem = async (id) => {

  const query = gql`
  query fetchProduct($id: ID) {
    product(where: {id: $id}) {
      id
      hash
      collections {
        symbol
      }
      filename
      name
      token
      purchasedCount
      quantity
      reqUserEmail
      reqUserShipping
      type
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });

  return result;
};

export const makeOrder = async (req, res) => {
  
  const query = gql`
  mutation CreateOrder($buyer: String!, $orderID: String!, $slug: String!) {
    createOrder(data: {buyer: $buyer, orderID: $orderID, post: {connect: {slug: $buyer}}}) {
      buyer
      orderID
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    buyer: req.body.buyer,
    orderID: req.body.orderID,
  });   

  return res.status(200).send(result);
}

//Get Products for Owner Product View
export const getCollectionOwner = async (publicKey) => {
  
  const owner = publicKey;
  console.log('owner', owner)
  const query = gql`
  query GetCollections($owner: String!) {
    collections(where: {owner_contains: $owner}) {
      id
      banner
      projectName
      description
      symbol
      twitterHandle
      discordServer
      website
      instagramHandle
      email
      verified
    }
    products(where: {owner: $owner}) {
      id
      name
      price
      collections{
        symbol
        projectName
        description
      }
      quantity
      purchasedCount
      token
      imageUrl
      description
      owner
      filename
      hash
      type
      reqUserEmail
      reqUserShipping
      reqDiscord
      reqNote
      reqColor
      reqTwitter
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });
  // return and refresh window
  
  return result;
};

export const updateCollectionInfo = async (newCollectionInfo) => {
  console.log('newCollectionInfo', newCollectionInfo)
  const id = newCollectionInfo.id;
  const banner = newCollectionInfo.banner ? newCollectionInfo.banner : "";
  const projectName = newCollectionInfo.projectName ? newCollectionInfo.projectName : "";
  const description = newCollectionInfo.description ? newCollectionInfo.description : "";
  const twitterHandle = newCollectionInfo.twitterHandle ? newCollectionInfo.twitterHandle : "";
  const discordServer = newCollectionInfo.discordServer ? newCollectionInfo.discordServer : "";
  const website = newCollectionInfo.website ? newCollectionInfo.website : "";
  const instagramHandle = newCollectionInfo.instagramHandle ? newCollectionInfo.instagramHandle : "";
  const email = newCollectionInfo.email ? newCollectionInfo.email : "";
  const verified = newCollectionInfo.verified ? newCollectionInfo.verified : false;



  const query = gql`
  mutation UpdateCollectionInfo($id: ID!, $banner: String!, $projectName: String!, $description: String!, $twitterHandle: String!, $discordServer: String!, $website: String!, $instagramHandle: String!, $email: String!, $verified: Boolean!) {
    updateCollection(
      where: {id: $id}
      data: {description: $description, banner: $banner, discordServer: $discordServer, instagramHandle: $instagramHandle, projectName: $projectName, twitterHandle: $twitterHandle, website: $website, email: $email, verified: $verified}
      ) {
      banner
      description
      discordServer
      instagramHandle
      projectName
      twitterHandle
      website
      verified
      email
    }
    publishCollection(where: {id: $id}) {
      description
      discordServer
      banner
      instagramHandle
      projectName
      twitterHandle
      website
      verified
      email
    }
  }  
  `;
  const result = await graphQLClient.request(query, {
    id: id,
    banner: banner,
    projectName: projectName,
    description: description,
    twitterHandle: twitterHandle,
    discordServer: discordServer,
    website: website,
    instagramHandle: instagramHandle,
    email: email,
    verified: verified
  });
  console.log('result', result)
  return result;
};

export const getCollectionProducts = async (symbol) => {

  const query = gql`
  query GetCollectionProducts($symbol: String!) {
    collection(where: {symbol: $symbol}) {
      id
      banner
      projectName
      description
      twitterHandle
      discordServer
      website
      instagramHandle
      youtube
      owner
      products {
        description
        id
        imageUrl
        name
        owner
        price
        quantity
        reqUserEmail
        reqUserShipping
        token
        type
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    symbol: symbol,
  });
  
  return result;
};

// Get Orders for Owner Order View
export const getCollectionOrders = async (publicKey) => {
  const owner = publicKey.toString();

  const query = gql`
  query GetMerchantOrders($owner: String!) {
    orders(
      where: {productid_every: {owner: $owner, type: "product"}}
    ) {
      id
      buyer
      colorOption
      createdAt
      discord
      email
      fulfilled
      note
      orderID
      price
      token
      shipping
      twitter
      productid {
        name
        imageUrl
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });

  return result.orders;
};

// Get Orders for Buyer Order View
export const getBuyerOrders = async (publicKey) => {

  const owner = publicKey.toString();

  const query = gql`
  query GetBuyerOrders($owner: String!) {
    orders(
      where: {buyer: $owner}
      orderBy: updatedAt_DESC
      ) {
        id
        createdAt
        orderID
        price
        token
        productid {
          id
          name
          type
          description
          owner
        }
      }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });
  // console.log("these are the buyer orders", result);
  return result.orders;
};


export const deleteSingleProduct = async (id) => {
  
  const query = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(where: {id: $id}) {
      id
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });
  console.log("product deleted:", result);

  return ;
};

export const getSingleProductBySku = async (id) => {
  console.log('id', id)
  const query = gql`
  query GetSingleProductBySku($id: ID) {
    product(where: {id: $id}) {
      id
      description
      name
      owner
      price
      collections{
        symbol
      }
      token
      imageUrl
      hash
      filename
      productImages {
        url
      }
      purchasedCount
      reqUserEmail
      reqUserShipping
      reqTwitter
      reqDiscord
      reqColor
      reqNote
      type
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });
  console.log("this is the result single prod by sku", result)
  return result;
};

export const deleteProductFromBuyer = async (id, buyer) => {

  const idToDelete = id;
  const buyerSlug = buyer.toLowerCase();
  
  
  const query = gql`
  mutation DeleteProductFromBuyer ($idToDelete: ID, $buyerSlug: String!) {
    updateOrder(data: {productid: {disconnect: {id: $idToDelete}}}, where: {slug: $buyerSlug}) {
      id
    }
    publishOrder(where: {slug: $buyerSlug}) {
      id
    }
  }
  `
  const result = await graphQLClient.request(query, {
    idToDelete: idToDelete,
    buyerSlug: buyerSlug
  });
  
  // console.log("form removed from orders")
  window.location.reload();

  return result;
}

export const getSingleProductOrders = async (id) => {

  const ID = id;
  
  
  const query = gql`
  query GetSingleProductOrders ($ID: ID) {
    orders(where: {productid_some: {id: $ID}}) {
      buyer
      createdAt
      orderID
      email
      shipping
      note
      price
      token
      purchaseDate
    }
  }
  `
  const result = await graphQLClient.request(query, {
    ID: ID
  });
  
  // console.log("single Product Orders: ", result.orders);

  return result.orders;
}

export const getTotalSolProductsSold = async (owner) => {
  
  const query = gql`
  query GetTotalSolProductsSold ($owner: String!) {
    products(
      where: {collections_some: {owner: $owner , products_every: {token: sol}}, type: "product"}
    ) {
      purchasedCount
    }
  }
  `
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  
  console.log("Total Sol Products sold: ", result.products);
  let total = 0;
  for (let i = 0; i < result.products.length; i++) {
    total += result.products[i].purchasedCount;
  }
  console.log("total: ", total);
  return total;
}

export const getTotalUsdcProductsSold = async (owner) => {

  const query = gql`
  query GetTotalUsdcProductsSold ($owner: String!) {
    products(
      where: {collections_some: {owner: $owner , products_every: {token: usdc}}, type: "product"}
    ) {
      purchasedCount
    }
  }
  `
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  
  console.log("Total Usdc Products sold: ", result.products);
  // use a for loop to iterate through result.products and add the purchasedCount to a total variable
  let total = 0;
  for (let i = 0; i < result.products.length; i++) {
    total += result.products[i].purchasedCount;
  }
  console.log("total: ", total);
  return total;
}

export const getTotalSolRev = async (owner) => {

  const query = gql`
  query GetTotalSolRevenue($owner: String!) {
    products(
      where: {collections_some: {owner: $owner, products_every: {token: sol}}, type: "product"}
    ) {
      purchasedCount
      price
    }
  }
  `
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  
  console.log("Total Usdc Products sold: ", result.products);
  // use a for loop to iterate through result.products and add the purchasedCount to a total variable
  let total = 0;
  for (let i = 0; i < result.products.length; i++) {
    total += ((result.products[i].purchasedCount) * (result.products[i].price));
  }
  console.log("total: ", total);
  return total;
}

export const getTotalUsdcRev = async (owner) => {

  const query = gql`
  query GetTotalSolRevenue($owner: String!) {
    products(
      where: {collections_some: {owner: $owner, products_every: {token: usdc}}, type: "product"}
    ) {
      purchasedCount
      price
    }
  }
  `
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  
  console.log("Total Usdc Products sold: ", result.products);
  // use a for loop to iterate through result.products and add the purchasedCount to a total variable
  let total = 0;
  for (let i = 0; i < result.products.length; i++) {
    total += ((result.products[i].purchasedCount) * (result.products[i].price));
  }
  console.log("total: ", total);
  return total;
}

export const getProductSoldAmounts = async (owner) => {

  const query = gql`
  query GetProductSoldAmounts($owner: String!) {
    products(
      where: {collections_some: {owner: $owner}, type: "product"}
    ) {
      id
      name
      purchasedCount
    }
  }
  `
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  
  console.log("Total Usdc Products sold: ", result.products);
  // use a for loop to iterate through result.products and destructure the id, name, and purchasedCount into separate arrays
  let ids = [];
  let names = [];
  let purchasedCounts = [];
  for (let i = 0; i < result.products.length; i++) {
    ids.push(result.products[i].id);
    names.push(result.products[i].name);
    purchasedCounts.push(result.products[i].purchasedCount);
  }
  console.log("ids: ", ids);
  console.log("names: ", names);
  console.log("purchasedCounts: ", purchasedCounts);
  return {ids, names, purchasedCounts};
}

// Get Products for Store Teaser
export const getStoreTeaser = async (symbol) => {

  const query = gql`
  query GetStoreTeaser($symbol: String!) {
    products(
      where: {collections_every: {symbol: $symbol}, type: "product"}
      orderBy: purchasedCount_DESC
      first: 4
    ) {
      id
      name
      imageUrl
      price
      token
      purchasedCount
    }
    collection(where: {symbol: $symbol}) {
      owner
      projectName
      description
      banner
      products(where: {type: "product"}) {
        id
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    symbol: symbol,
  });

  return result;
};

// ********** Merchant Subscriptions **********

// Get Subscriptions for Merchant
export const GetSubscriptionsForWallet = async (publicKey) => {

  const owner = publicKey.toString();

  const query = gql`
  query GetSubsForOwner($owner: String!) {
    subs(where: {owner: $owner}) {
      id
      name
      price
      description
      token
      lifeCycleDays
      wallets {
        owner
      }
      expiredWallets {
        id
      }
      createdAt
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });

  console.log("Subscriptions for Wallet: ", result.subs);

  return result.subs;
}

// Create a new Subscription
export const CreateSubscription = async (newSubscription) => {

  const { name, price, description, owner, token, reqUserEmail, reqUserShipping, lifeCycleDays, symbol, quantity, imageUrl } = newSubscription;

  const quantity2 = parseInt(quantity);
 const lifeCycle = parseInt(lifeCycleDays);


  const query = gql`
  mutation CreateSub($name: String!, $price: String!, $owner: String!, $symbol: String!, $description: String!, $lifeCycle: Int!, $token: Token, $reqUserEmail: Boolean!, $reqUserShipping: Boolean!, $quantity2: Int!, $imageUrl: String!) {
    createSub(
      data: {collections: {connect: {symbol: $symbol}}, description: $description, lifeCycleDays: $lifeCycle, name: $name, owner: $owner, price: $price, reqUserEmail: $reqUserEmail, reqUserShipping: $reqUserShipping, token: $token, quantity: $quantity2, imageUrl: $imageUrl}
    ) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    name: name,
    price: price,
    owner: owner,
    symbol: symbol,
    description: description,
    lifeCycle: lifeCycle,
    token: token,
    reqUserEmail: reqUserEmail,
    reqUserShipping: reqUserShipping,
    quantity2: quantity2,
    imageUrl: imageUrl
  });

  console.log("Subscription Created: ", result);

  const newSubId = await result.createSub.id;

  const query2 = gql`
  mutation PublishSub($newSubId: ID!) {
    publishSub(where: {id: $newSubId}) {
      id
    }
  }
  `;
  const result2 = await graphQLClient.request(query2, {
    newSubId: newSubId,
  });

  console.log("Subscription Published: ", result2);
  alert("Subscription Created!")

  return result2;
}

export const DeleteSubscription = async (subId) => {

  const query = gql`
  mutation DeleteSub($subId: ID!) {
    deleteSub(where: {id: $subId}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    subId: subId,
  });

  console.log("Subscription Deleted: ", result);

  return result;
}

export const CheckForWallet = async (owner) => {

  const query = gql`
  query CheckForWallet($owner: String!) {
    wallet(where: {owner: $owner}) {
      id
      owner
      email
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });

  return result;
}

// Add Wallet
export const CreateWallet = async (publicKey, magicemail) => {
  console.log("collector req:", publicKey, magicemail)
  const owner = publicKey.toString();
  const email = magicemail ? magicemail.toString() : '';
  const verified = magicemail ? true : false;
  
  const graphQLClient = new GraphQLClient((graphqlAPI), {
    headers: {
      authorization: `Bearer ${GRAPHCMS_TOKEN}`,
    }
  });

  const query = gql`
  mutation CreateWallet($owner: String!, $verified: Boolean!, $email: String!) {
    createWallet(data: {owner: $owner, verified: $verified, email: $email}) {
      id
      owner
    }
    publishWallet(where: {owner: $owner}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
    verified: verified,
    email: email
  });

  console.log("Wallet Added: ", result);

  return result;
}

export const UpdateWallet = async (publicKey, magicemail) => {
  console.log("collector req:", magicemail)
  const owner = publicKey.toString();
  const email = magicemail;
  const verified = true;

  const query = gql`
  mutation UpdateWallet($owner: String!, $verified: Boolean!, $email: String!) {
    updateWallet(data: {verified: $verified, email: $email}, where: {owner: $owner}) {
      id
      owner
      email
      verified
    }
    publishWallet(where: {owner: $owner}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
    verified: verified,
    email: email,
    verified: verified
  });

  console.log("Wallet Updated: ", result);

  return result;
}


// Add Wallet to Subscription
export const AddWalletToSubscription = async (subId, publicKey, purchaseDate, seller, expireDate, price) => {
  const owner = publicKey.toString();

  const query = gql`
  mutation AddWalletToSub($subId: ID! ,$owner: String!, $purchaseDate: DateTime!, $seller: String!, $expireDate: DateTime!, $price: String!) {
    updateSub(
      data: {wallets: {connect: {where: {owner: $owner}}}, subOrders: {create: {buyer: {connect: {owner: $owner}}, purchaseDate: $purchaseDate, seller: $seller, expireDate: $expireDate, purchasePrice: $price}}}
      where: {id: $subId}
    ) {
      id
    }
    publishSub(where: {id: $subId}) {
      id
      name
      owner
      price
      wallets {
        owner
      }
      expiredWallets {
        owner
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    subId: subId,
    owner: owner,
    purchaseDate: purchaseDate,
    seller: seller,
    expireDate: expireDate,
    
  });

  console.log("Wallet Added to Subscription: ", result);

  return result;
}

// Remove Wallet from Subscription
export const RemoveWalletFromSubscription = async (subId, publicKey) => {
  const owner = publicKey.toString();

  const query = gql`
  mutation RemoveWalletFromSub($subId: ID! ,$owner: String!) {
    updateSub(
      where: {id: "cl7e2iyvpbeso0dim2kfcrfdn"}
      data: {expiredWallets: {connect: {where: {owner: $owner}}}, wallets: {disconnect: {owner: $owner}}}
    ) {
      id
    }
    publishSub(where: {id: $subId}) {
      id
      name
      owner
      price
      wallets {
        owner
      }
      expiredWallets {
        owner
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    subId: subId,
    owner: owner,
  });

  console.log("Wallet Removed from Subscription: ", result);

  return result;
}

// Check current Wallet's Subs
export const CheckWalletSubs = async (publicKey) => {
  const owner = publicKey.toString();

  const query = gql`
  query CheckWalletSubs($owner: String!) {
    wallet(where: {owner: $owner}) {
      id
      expiredSubs {
        id
        name
        owner
        price
      }
      subs {
        id
        name
        owner
        price
        lifeCycleDays
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });

  console.log("Wallet Subs: ", result);

  return result;
}

// Check current Wallet's subOrders
export const CheckWalletSubOrders = async (publicKey) => {
  const owner = publicKey.toString();

  const query = gql`
  query GetWalletSubOrders($owner: String!) {
    subOrders(
      where: {buyer: {owner: $owner}}
    ) {
      id
      purchasePrice
      token
      purchaseDate
      expireDate
      orderID
      sub {
        id
        name
        token
        owner
        price
        name
        lifeCycleDays
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });

  console.log("Wallet SubOrders: ", result);

  return result;
}

// Get All available Subscriptions
export const GetAllSubs = async () => {

  const query = gql`
  query GetAllSubscriptions {
    subs {
      id
      name
      owner
      price
      reqUserEmail
      reqUserShipping
      token
      description
      lifeCycleDays
      wallets {
        id
      }
    }
  }
  
  `;
  const result = await graphQLClient.request(query);

  console.log("All Subs: ", result);

  return result;
}

// Get Subscription by ID
export const GetSubById = async (id) => {
  const subId = id;

  const query = gql`
  query GetSubById($subId: ID!) {
    sub(where: {id: $subId}) {
      id
      name
      owner
      price
      reqUserEmail
      reqUserShipping
      token
      description
      imageUrl
      quantity
      lifeCycleDays
      wallets {
        id
      }
      collections {
        projectName
        discordServer
        twitterHandle
        website
      }
    }
  }
  
  `;
  const result = await graphQLClient.request(query, {
    subId: subId,
  });
  return result;
}

export const GetActiveSubOrdersForMerchant = async (owner) => {
  const subOwner = owner;
  const date = new Date();
  const isoDate = date.toISOString();

  console.log("owner and date: ", subOwner, isoDate  )
  
  const query = gql`
  query GetSubsAndActiveOrders($subOwner: String! $isoDate: DateTime! ) {
    subs(where: {owner: $subOwner}) {
      id
      createdAt
      imageUrl
      lifeCycleDays
      name
      price
      quantity
      reqUserEmail
      reqUserShipping
      createdAt
      token
      subOrders(where: {expireDate_gt: $isoDate}) {
        buyer {
          owner
        }
        id
        email
        expireDate
        orderID
        purchasePrice
        shippingInfo
        token
        createdAt
        updatedAt
      }
    }
  }
  `;

  const result = await graphQLClient.request(query, {
    subOwner: subOwner,
    isoDate: isoDate,
  });

  console.log("Active Sub Orders: ", result.subs);

  return result.subs;
}

export const GetExpiredSubOrdersForMerchant = async (owner) => {
  const subOwner = owner;
  const date = new Date();
  const isoDate = date.toISOString();

  const query = gql`
  query GetSubsAndExpiredOrders($subOwner: String! $isoDate: DateTime! ) {
    subOrders(where: {sub: {owner: $subOwner}, expireDate_lt: $isoDate}) {
      buyer {
        owner
      }
      id
      email
      expireDate
      orderID
      purchasePrice
      shippingInfo
      token
      createdAt
      updatedAt
      sub {
        id
        name
        owner
        price
        token
        description
        imageUrl
        quantity
        lifeCycleDays
      }
    } 
  }
  `;
  const result = await graphQLClient.request(query, {
    subOwner: subOwner,
    isoDate: isoDate,
  });

  console.log("Expired Sub Orders: ", result.subOrders);

  return result.subOrders;
}

export const GetOnlyActiveSubOrdersForMerchant = async (owner) => {
  const subOwner = owner;
  const date = new Date();
  const isoDate = date.toISOString();

  const query = gql`
  query GetSubsAndExpiredOrders($subOwner: String! $isoDate: DateTime! ) {
    subOrders(where: {sub: {owner: $subOwner}, expireDate_gt: $isoDate}) {
      buyer {
        owner
      }
      id
      email
      expireDate
      orderID
      purchasePrice
      shippingInfo
      token
      createdAt
      updatedAt
      sub {
        id
        name
        owner
        price
        token
        description
        imageUrl
        quantity
        lifeCycleDays
      }
    } 
  }
  `;
  const result = await graphQLClient.request(query, {
    subOwner: subOwner,
    isoDate: isoDate,
  });

  console.log("Active Sub Orders: ", result.subOrders);

  return result.subOrders;
}


export const GetSubOrdersBySubId = async (id, owner) => {
  const subId = id;
  const subOwner = owner;

  const query = gql`
    query GetSubOrdersBySubId($subId: ID!, $subOwner: String!) {
      subOrders(
        where: {sub: {id: $subId, owner: $subOwner}}
      ) {
        id
        buyer {
          owner
        }
        email
        expireDate
        orderID
        purchaseDate
        purchasePrice
        shippingInfo
        createdAt
        updatedAt
        token
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    subId: subId,
    subOwner: subOwner,
  });

  console.log("Sub Orders: ", result.subOrders);

  return result.subOrders;
}



// Add Sub Order
export const AddSubOrder = async (order) => {

  const buyer = order.buyer;
  const email = order.email;
  const shippingInfo = order.shippingInfo;
  const purchaseDate = order.purchaseDate;
  const expireDate = order.expireDate;
  const purchasePrice = (order.purchasePrice).toString();
  const orderID = order.orderID;
  const subID = order.subID;
  const token = order.token;

  const query = gql`
  mutation AddSubOrder($buyer: String!, $email: String!, $shippingInfo: String!, $purchaseDate: DateTime!, $expireDate: DateTime!, $purchasePrice: String!, $orderID: String!, $subID: ID!, $token: String!) {
    createSubOrder(
      data: {orderID: $orderID, buyer: {connect: {owner: $buyer}}, purchaseDate: $purchaseDate, purchasePrice: $purchasePrice, sub: {connect: {id: $subID}}, expireDate: $expireDate, email: $email, shippingInfo: $shippingInfo, token: $token}
    ) {
      id
      orderID
      expireDate
      purchasePrice
      purchaseDate
      email
      shippingInfo
      token
    }
    updateSub(where: {id: $subID}, data: {wallets: {connect: {where: {owner: $buyer}}}}){
      id
    }
    publishSub(where: {id: $subID}) {
      id
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    buyer: buyer,
    email: email,
    shippingInfo: shippingInfo,
    purchaseDate: purchaseDate,
    expireDate: expireDate,
    purchasePrice: purchasePrice,
    orderID: orderID,
    subID: subID,
    token: token,
  });


  console.log("Sub Order Added: ", result);

  const subIDpublish = result.createSubOrder.id;

  const query2 = gql`
  mutation PublishSubOrder($subIDpublish: ID!) {
    publishSubOrder(where: {id: $subIDpublish}) {
      id
    }
  }
  `;
  const result2 = await graphQLClient.request(query2, {
    subIDpublish: subIDpublish,
  });


  return result2;
}

export const GetCollectionSubs = async (collection) => {
    const collectionSymbol = collection;
  
    const query = gql`
    query GetCollectionSubs($collectionSymbol: String!) {
      subs(where: {collections_some: {symbol: $collectionSymbol}}) {
        id
        lifeCycleDays
        name
        owner
        price
        token
        quantity
        imageUrl
        description
      }
    }
    `;
    const result = await graphQLClient.request(query, {
      collectionSymbol: collectionSymbol,
    });

    return result.subs;
  }

// Check collection's subs wallets for their subOrders and the expireDate, if the expireDate is less than the current date, update the sub expiredWallets
export const CheckSubsWallets = async (id) => {  
  const subID = id;

  const query = gql`
  query CheckSubsWallets($subID: ID!) {
    subs(where: {id: $subID}) {
      id
      wallets {
        owner
        subOrders(where: {sub: {id: $subID}}) {
          id
          orderID
          expireDate
        }
      }
      expiredWallets {
        owner
      }
    }
  }
  `;
  const result1 = await graphQLClient.request(query, {
    subID: subID,
  });

  console.log("Check Subs Wallets: ", result1);

  // Check if the subOrders expireDate is less than the current date, if so, add the wallet to the expiredWallets
  const wallets = result1.subs[0].wallets;
  const expiredWallets = result1.subs[0].expiredWallets;
  console.log("Wallets: ", wallets);
  console.log("Expired Wallets: ", expiredWallets);
  if(wallets != null) {
    const checkWallets = async() => {
    for(let i = 0; i < wallets.length; i++) {
      
        const wallet = wallets[i];  
        const owner = wallet.owner;
        const lastSubOrder = wallet.subOrders[wallet.subOrders.length - 1];
     
          const subOrder = lastSubOrder;
          const expireDateAndTime = subOrder.expireDate;
          const currentDate = new Date();
          const expireDate = new Date(expireDateAndTime);
          console.log("Expire Date: ", expireDate, subOrder.id);
          console.log("Current Date: ", currentDate);
          if(expireDate < currentDate) {
            const updateWallet = async() => {
              const query2 = gql`
              mutation UpdateSubExpiredWallets($subID: ID!, $owner: String!) {
                updateSub(
                  where: {id: $subID}
                  data: {expiredWallets: {connect: {where: {owner: $owner}}}, wallets: {disconnect: {owner: $owner}}}
                ) {
                  id
                }
                publishSub(where: {id: $subID}) {
                  id
                  wallets {
                    owner
                  }
                  expiredWallets {
                    owner
                  }
                }
              }
              `;
              const result2 = await graphQLClient.request(query2, {
                subID: subID,
                owner: owner,
              });
              console.log("Update Sub Expired Wallets: ", result2);
              alert("Had to update a wallet, refresh the page to see the changes");
            }
            updateWallet();
          }
      }  
    }
    checkWallets();
  }
  
  return console.log("Check Subs Wallets Complete");
}


// Get Active Sub Orders
export const GetActiveOrders = async (owner) => {
  // currentDate = the current date and time in ISO format
  const currentDate = new Date().toISOString();
  const subOwner = owner.publicKey;

  const query = gql`
  query ActiveOrders($currentDate: DateTime!, $subOwner: String!) {
    subOrders(where: {expireDate_gte: $currentDate, sub: {owner: $subOwner}}) {
      id
      orderID
      buyer {
        owner
      }
      purchasePrice
      token
      purchaseDate
      expireDate
      email
      shippingInfo
      sub {
        id
        name
        owner
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    currentDate: currentDate,
    subOwner: subOwner,
  });

  console.log("Active Orders: ", result);
  return result;
}

// Get Expired Sub Orders
export const GetExpiredOrders = async (owner) => {
  const currentDate = new Date().toISOString();
  const subOwner = owner.publicKey;

  const query = gql`
  query ExpiredSubOrders($currentDate: DateTime!, $subOwner: String!) {
    subOrders(where: {expireDate_lte: $currentDate, sub: {owner: $subOwner}}) {
      id
      orderID
      buyer {
        owner
      }
      purchasePrice
      token
      purchaseDate
      expireDate
      email
      shippingInfo
      sub {
        id
        name
        owner
      }
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    currentDate: currentDate,
    subOwner: subOwner,
  });

  console.log("Expired Orders: ", result);
  return result;
}

export const addBuyAllOrder = async (order) => {
  console.log(order)
  const buyer = order.buyer;
  // purchaseDate = the current date and time in ISO format
  const purchaseDate = new Date().toISOString();
  const price = order.price;
  const orderid = order.orderID;
  const token = order.token;
  const productid = order.id;

  const query = gql`
    mutation InitialOrder($buyer: String!, $purchaseDate: DateTime!, $price: String!, $orderid: String!, $token: String!, $productid: ID) {
      createOrder(data: {
        buyer: $buyer,
        purchaseDate: $purchaseDate,
        price: $price,
        orderID: $orderid,
        token: $token,
        productid: {
          connect: {
            id: $productid
          }
        }
      }) {
        id
        productid {
          id
          name
        }
        buyer
    } 
  }
    `;
  

  const result1 = await graphQLClient.request(query, {
    buyer: buyer,
    purchaseDate: purchaseDate,
    price: price,
    orderid: orderid,
    token: token,
    productid: productid
  });
  console.log("result1", result1);

  // id from result1
  const orderid1 = result1.createOrder.id;

  
  const query3 = gql`
    mutation PublishBuyAllOrder($orderid1: ID) {
      publishOrder(where: {id: $orderid1}) {
        id
        buyer
        productid {
          name
          id
        }
        purchaseDate
        price
        token
      }
    }
  `;

  const result3 = await graphQLClient.request(query3, {
    orderid1: orderid1
  });
  return result3;
};



export const GetLinkOrdersForOwner = async (owner) => {

  const query = gql`
    query GetLinkOrdersForOwner($owner: String!) {
      orders(
        where: {productid_some: {owner: $owner, type: "link"}}
        orderBy: updatedAt_DESC
      ) {
        id
        orderID
        buyer
        price
        token
        purchaseDate
        productid {
          id
          name
        }
        createdAt
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });
  // console.log("result", result);
  return result;
}

export const GetTipOrdersForOwner = async (owner) => {
  const query = gql`
    query GetTipOrdersForOwner($owner: String!) {
      orders(
        where: {productid_some: {owner: $owner, type: "tipjar"}}
        orderBy: updatedAt_DESC
      ) {
        id
        orderID
        buyer
        price
        token
        purchaseDate
        productid {
          id
          name
        }
        createdAt
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });
  // console.log("result", result);
  return result;
}

export const EditProductInDB = async (product) => {
  const reqColor = product.reqColor ? product.reqColor : false;
  const reqDescription = product.description ? product.description : false;
  const reqUserEmail = product.reqUserEmail ? product.reqUserEmail : false;
  const reqTwitter = product.reqTwitter ? product.reqTwitter : false;
  const reqNote = product.reqNote ? product.reqNote : false;
  const reqUserShipping = product.reqUserShipping ? product.reqUserShipping : false;
  const reqDiscord = product.reqDiscord ? product.reqDiscord : false;
  const quantity = parseInt(product.quantity);

  const query = gql`
    mutation EditProduct($id: ID!, $name: String!, $description: String!, $price: String!, $imageUrl: String!, $quantity: Int!, $token: Token, $reqUserEmail: Boolean!, $reqUserShipping: Boolean!, $reqNote: Boolean!, $reqColor: Boolean!, $reqDiscord: Boolean!, $reqTwitter: Boolean!) {
      updateProduct(
        where: {id: $id}
        data: {name: $name, description: $description, price: $price, imageUrl: $imageUrl, quantity: $quantity, token: $token, reqUserEmail: $reqUserEmail, reqUserShipping: $reqUserShipping, reqNote: $reqNote, reqColor: $reqColor, reqDiscord: $reqDiscord, reqTwitter: $reqTwitter}
      ) {
        id
      }
      publishProduct(where: {id: $id}) {
        id
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    id: product.id,
    name: product.name,
    description: reqDescription,
    price: product.price,
    imageUrl: product.imageUrl,
    quantity: quantity,
    token: product.token,
    reqUserEmail: reqUserEmail,
    reqUserShipping: reqUserShipping,
    reqNote: reqNote,
    reqColor: reqColor,
    reqDiscord: reqDiscord,
    reqTwitter: reqTwitter
  });
  alert("Product updated!");
  return result;
}


//get all pay requests links for a wallet
export const getAllPayRequests = async (publicKey) => {
  const owner = publicKey.publicKey.toString();
  const query = gql`
  query GetAllPayRequests($owner: String!) {
    products(
      where: {owner: $owner, type: "link"}
    ) {
      id
      name
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });
  
  return result.products;
};

//get all tipjar links for a wallet
export const getAllTipJarLinks = async (publicKey) => {
  const owner = publicKey.publicKey.toString();
  const query = gql`
  query GetAllPayRequests($owner: String!) {
    products(
      where: {owner: $owner, type: "tipjar"}
    ) {
      id
      name
    }
  }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
  });
  
  return result.products;
};

//get single order details
export const GetSingleOrderDetails = async (id) => {
  const query = gql`
    query GetSingleOrderDetails($id: ID!) {
      order(where: {id: $id}) {
        id
        buyer
        colorOption
        discord
        email
        trackingNumber
        fulfilled
        note
        orderID
        price
        productid {
          id
          imageUrl
          name
        }
        shipping
        token
        twitter
        createdAt
        updatedAt
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });
  // console.log("result", result);
  return result.order;
}

// Get Single subOrder Details
export const GetSingleSubOrderDetails = async (id) => {
  const query = gql`
    query GetSingleSubOrderDetails($id: ID!) {
      subOrder(where: {id: $id}) {
        id
        buyer {
          owner
        }
        email
        expireDate
        orderID
        purchaseDate
        purchasePrice
        shippingInfo
        token
        createdAt
        updatedAt
        sub {
          id
          imageUrl
          name
          lifeCycleDays
          price
          token
        }
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    id: id
  });
  console.log("result", result);
  return result;
}


export const UpdateOrder = async (id, newTrackingNumber, fulfilled) => {
  // console.log('id, trackingNumber, fulfilled', id, newTrackingNumber, fulfilled);
  const trackingNumber = newTrackingNumber ? newTrackingNumber : "";
  const query = gql`
    mutation UpdateOrder($id: ID!, $fulfilled: Boolean!, $trackingNumber: String!) {
      updateOrder(
        data: {fulfilled: $fulfilled, trackingNumber: $trackingNumber}
        where: {id: $id}
      ) {
        id
        buyer
        colorOption
        discord
        email
        trackingNumber
        fulfilled
        note
        orderID
        price
        productid {
          id
          imageUrl
          name
        }
        shipping
        token
        twitter
        createdAt
        updatedAt
      }
      publishOrder(where: {id: $id}){
        id
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    id: id,
    fulfilled: fulfilled,
    trackingNumber: trackingNumber
  });
  // console.log("result", result.updateOrder);
  return result.updateOrder;
}
  
export const GetStoreInfo = async (req) => {
  //get active_store from local storage
  console.log('local storage active store', localStorage.getItem('active_store'));
  const active_store = JSON.parse(localStorage.getItem('active_store'));
  console.log('local storage active store', active_store);
  const symbol = active_store;
  const query = gql`
    query GetStoreInfo($symbol: String!) {
      collection(where: {symbol: $symbol}) {
        banner
        description
        discordServer
        id
        instagramHandle
        owner
        projectName
        twitterHandle
        website
        youtube
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    symbol: symbol
  });
  //  console.log("result", result);

  return result.collection;
}



//MERCHANT DASHBOARD OVERVIEW QUERIES
export const GetMerchantOverview = async (owner) => {
  // console.log('getting merchant overview for', owner);
  const query = gql`
    query GetMerchantOverview($owner: String!) {
      products(
        where: {owner: $owner, type: "product"}
        orderBy: purchasedCount_DESC
        first: 4
      ) {
        id
        name
        imageUrl
        price
        token
        purchasedCount
        quantity
      }
      orders(
        where: {productid_some: {owner: $owner, type: "product"}, purchaseDate_gte: "2022-01-01T22:22:00+00:00", purchaseDate_lte: "2023-01-01T22:22:00+00:00"}
        orderBy: purchaseDate_DESC
      ) {
        id
        productid(where: {owner: $owner}) {
          name
          price
          token
          imageUrl
        }
        orderID
        purchaseDate
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  // console.log('merchant overview result', result);
  return result;
}

export const GetInvoicesByOwner = async (owner) => {
  const query = gql`
    query GetInvoicesByOwner($owner: String!) {
      invoices(where: {owner: $owner}) {
        id
        createdAt
        name
        price
        token
        dueDate
        fulfilled
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  // console.log('merchant overview result', result);
  return result;
}

export const CreateCollectionFromMagic = async (req) => {
  console.log("req", req);
  const data = JSON.parse(req);

  const owner = data.owner;
  const projectName = data.storeName;
  const name = data.name;
  const email = data.email;




  const query = gql`
    mutation CreateCollectionFromMagic($owner: String!, $projectName: String!, $name: String!, $email: String!) {
      createCollection(
        data: {owner: $owner, projectName: $projectName, name: $name, email: $email}
      ) {
        id
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner,
    projectName: projectName,
    name: name,
    email: email
  });

  const publishMutation = gql`
    mutation PublishCollection($id: ID!) {
      publishCollection(where: {id: $id}) {
        id
      }
    }
  `;
  const publishResult = await graphQLClient.request(publishMutation, {
    id: result.createCollection.id
  });
  console.log("publishResult", publishResult);

  return result;
}

export const CheckForCollectionByOwner = async (owner) => {
  const query = gql`
    query CheckForCollectionByOwner($owner: String!) {
      collections(where: {owner: $owner}) {
        id
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  console.log('merchant overview result', result);
  //if result.collections.length > 0, return true
  if(result.collections.length > 0){
    return true;
  }
  return false;
}

export const GetCollectionByEmail = async (owner) => {
  ///get get collections where email = email
  console.log('getting collections by email', owner)
  const query = gql`
    query GetCollectionsByEmail($owner: String!) {
      collections(where: {email: $owner}) {
        id
        owner
        projectName
        name
        email
        banner
        description
        discordServer
        instagramHandle
        twitterHandle
        website
        youtube
      } 
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  console.log('merchant overview result', result);
  return result;
}

export const GetTotalUsers = async() => {
  const query = gql`
    query GetTotalUsers {
      walletsConnection {
        aggregate {
          count
        }
      }
    }
  `;
  const result = await graphQLClient.request(query);
  console.log('total users', result.walletsConnection.aggregate.count);
  return result.walletsConnection.aggregate.count;
}

//upsert wallet
export const UpsertWallet = async (req) => {
  const data = JSON.parse(req);
  const owner = data.owner;
  const email = data.email;
  const name = data.name;
  const verified = data.verified ? data.verified : false;
  try {
    const query = gql`
      mutation UpsertWallet($owner: String!, $email: String!, $name: String!, $verified: Boolean!) {
        upsertWallet(
          upsert: {create: {owner: $owner, email: $email, name: $name, verified: $verified}, update: {name: $name, email: $email, verified: $verified}}
          where: {owner: $owner}
        ) {
          id
        }
        publishWallet(where: {owner: $owner}) {
          id
        }
      }
    `;
    const result = await graphQLClient.request(query, {
      owner: owner,
      email: email,
      name: name,
      verified: verified
    });
    console.log('upsert wallet result', result);
    return result;
  } catch (error) {
    console.log('error', error);
  }
}

export const GetWalletSettings = async(req) => {
  console.log('incoming req', req)
  const owner = req.userPubKey;
  const query = gql`
    query GetWalletSettings($owner: String!) {
      wallet(where: {owner: $owner}){
        id
        email
        name
        owner
        description
        createdAt
        profileImage {
          url(transformation: {image: {resize: {height: 40, width: 40}}})
        }
        cryptoLinks
        socialLinks
        verified
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });

  // console.log('wallet settings result', result);

  return result.wallet;
}

export const GetWalletProfile = async(req) => {
  
  const owner = req;
  console.log('getting wallet profile', req)
  const query = gql`
    query GetWalletProfile($owner: String!) {
      wallet(where: {owner: $owner}){
        id
        owner
        createdAt
        verified
        profileImage {
          url
        }
        description
        cryptoLinks
        socialLinks
        highscores {
          score
          timeRemaining
          qRemain
        }
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner
  });
  console.log('wallet profile result', result);
  return result.wallet;
}

// export const UpdateProfileImage = async (req) => {


export const UpdateWalletSettings = async (req) => {
  console.log('incoming req', req)
  const owner = req.userPubKey;

  const query = gql`
    mutation UpdateWalletSettings($owner: String!, $email: String!, $name: String!, $description: String!, $socialLinks: [String!], $cryptoLinks: [String!], $verified: Boolean) {
      updateWallet(
        data: {email: $email, name: $name, description: $description, socialLinks: $socialLinks, cryptoLinks: $cryptoLinks, verified: $verified}
        where: {owner: $owner}
      ) {
        id
        email
        name
        owner
        description
        createdAt
        profileImage {
          url(transformation: {image: {resize: {height: 40, width: 40}}})
        }
        cryptoLinks
        socialLinks
        verified
      }
      publishWallet(where: {owner: $owner}) {
        id
        description
      }
    }
  `;
  const result = await graphQLClient.request(query, {
    owner: owner,
    email: req.email,
    name: req.name,
    description: req.description,
    socialLinks: req.socialLinks,
    cryptoLinks: req.cryptoLinks,
    verified: req.verified
  });
  console.log('update wallet settings result', result);
  return result;
}




// USER DASH TOTALS
export const GetUserDashLinkTotals = async (req) => {
  const owner = req;
  const query = gql`
    query GetUserDashLinkTotals($owner: String!) {
      ordersConnection(where: {productid_every: {owner: $owner, type: "link"}}) {
        edges {
          node {
            price
          }
        }
        aggregate {
          count
        }
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });

  console.log('user dash link totals result', result);

  const totalLinks = result.ordersConnection.aggregate.count;
  // price is a string, parseFloat to get a number then reduce to get total
  const totalLinkSales = result.ordersConnection.edges.reduce((acc, cur) => {
    return acc + parseFloat(cur.node.price);
  }, 0);

  return {totalLinks, totalLinkSales};
}

export const GetUserDashTipjarTotals = async (req) => {
  const owner = req;
  const query = gql`
    query GetUserTipjarTotals($owner: String!) {
      ordersConnection(where: {productid_every: {owner: $owner, type: "tipjar"}}) {
        edges {
          node {
            price
          }
        }
        aggregate {
          count
        }
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });

  console.log('user dash tipjar totals result', result);

  const totalTipjars = result.ordersConnection.aggregate.count;
  const totalTipjarSales = result.ordersConnection.edges.reduce((acc, cur) => {
    return acc + parseFloat(cur.node.price);
  }, 0);

  return {totalTipjars, totalTipjarSales};
}


// GUESS WHO GAME FUNCTIONS
// query GetAllHighscores {
//   highscores {
//     id
//     qRemain
//     score
//     wallet {
//       owner
//     }
//   }
// }

// query GetHighscoresByWallet {
//   highscores(
//     where: {wallet: {owner: "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n"}}
//   ) {
//     id
//     createdAt
//     score
//     qRemain
//     timeRemaining
//   }
// }


// mutation SubmitHighscore {
//   createHighscore(
//     data: {wallet: {connect: {owner: "7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n"}}, qRemain: 6, score: 800, timeRemaining: 45}
//   ) {
//     id
//   }
//   publishHighscore(where: {id: ""})
// }

export const GetHighscoresByWallet = async (req) => {
  const owner = req;
  const query = gql`
    query GetHighscoresByWallet($owner: String!) {
      highscores(
        where: {wallet: {owner: $owner}}
      ) {
        id
        createdAt
        score
        qRemain
        timeRemaining
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    owner: owner
  });

  console.log('get highscores by wallet result', result);

  return result;
}

export const SubmitHighscore = async (req) => {
  console.log('submit highscore req', req);
  try{
    const data = req;
    const owner = data.owner;
    const qRemain = data.qRemain;
    const score = data.score;
    const timeRemaining = data.timeRemaining;
    const query = gql`
      mutation SubmitHighscore($owner: String!, $qRemain: Int!, $score: Int!, $timeRemaining: Int!) {
        createHighscore(
          data: {wallet: {connect: {owner: $owner}}, qRemain: $qRemain, score: $score, timeRemaining: $timeRemaining}
        ) {
          id
        }
      }
    `;

    const result = await graphQLClient.request(query, {
      owner: owner,
      qRemain: qRemain,
      score: score,
      timeRemaining: timeRemaining
    });

    console.log('submit highscore result', result);

    const publishQuery = gql`
      mutation PublishHighscore($id: ID!) {
        publishHighscore(where: {id: $id}) {
          id
        }
      }
    `;
    const publishResult = await graphQLClient.request(publishQuery, {
      id: result.createHighscore.id
    });

    console.log('publish highscore result', publishResult);

    return publishResult;
  }catch (error) {
  console.log('error', error);
  alert('error', error)
}
}
// get the top 20 highest score highscores
export const GetAllHighscores = async () => {
  const query = gql`
    query GetAllHighscores {
      highscores(orderBy: score_DESC, first: 20) {
        id
        qRemain
        score
        wallet {
          owner
        }
        createdAt
      }
    }
  `;

  const result = await graphQLClient.request(query);

  console.log('get all highscores result', result);

  return result;
}
