import type { Product } from "./interfaces";

import { ebaySearchCrawl } from "./utils";

// Adjust the search text in this section to update the input for the crawler search.
const searchText = "running shoes";

const printProductData = (product: Product) => {
    console.log(`Product-${product?.position}:\n${JSON.stringify(product)} \n`);
};

const printCrawlerResults = ({ productsData, relatedSearchesText }) => {
    productsData?.forEach((productData: Product) => {
        printProductData(productData);
    });

    console.log(
        `Related search tags:\n${
            relatedSearchesText?.length ? relatedSearchesText : "None"
        }`
    );
};

ebaySearchCrawl(searchText)
    .then(printCrawlerResults)
    .catch((err) => {
        console.error(err);
    });
