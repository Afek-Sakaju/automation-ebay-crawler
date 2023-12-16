import type { Product } from "./interfaces";

import { ebaySearchCrawl } from "./utils";

const searchText = "running shoes";

const printProductData = (product: Product) => {
    console.log(`Product-${product?.position}:\n${JSON.stringify(product)} \n`);
};

ebaySearchCrawl(searchText)
    .then(({ productsData, relatedSearchesText }) => {
        productsData?.forEach((res) => printProductData(res));
        console.log(relatedSearchesText);
    })
    .catch((err) => console.error(err));
