const puppeteer = require("puppeteer");
const { getWebsiteSearchUrl } = require("./utils/helpers");

async function ebaySearchCrawl(searchText) {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const searchUrl = getWebsiteSearchUrl(searchText);
    await page.goto(searchUrl);
    await page.waitForSelector(".s-item");

    const productsData = await page.evaluate(() => {
        const productsResults = [];

        document.querySelectorAll(".s-item").forEach((product) => {
            const id = product?.id;
            // Exclude the first element in the list on eBay, which is not a valid product and lacks an ID
            if (!id) return;

            const title = product.querySelector(".s-item__title")?.innerText;
            const price = product.querySelector(".s-item__price")?.innerText;
            const sponsored = product.querySelector(".SECONDARY_INFO")
                ? true
                : false;
            const shipping =
                product.querySelector(".s-item__shipping")?.innerText;
            const image = product.querySelector(".s-item__image img")?.src;
            const dataViewId = product
                .getAttribute("data-view")
                ?.split("iid:")?.[1];
            const position = dataViewId && +dataViewId;

            productsResults.push({
                id,
                position,
                title,
                price,
                sponsored,
                shipping,
                image,
            });
        });
        return productsResults;
    });

    const relatedSearchesText = await page.evaluate(() => {
        const relatedSearchesContainer = document.querySelector(
            ".srp-related-searches"
        );

        const relatedTags = [
            ...relatedSearchesContainer.querySelectorAll("a"),
        ]?.map((link) => link.textContent.trim());

        return relatedTags || [];
    });

    await browser.close();
    return { productsData, relatedSearchesText };
}

const searchText = "running shoes";

const printProductData = (product) => {
    console.log(`Product-${product?.position}:\n${JSON.stringify(product)} \n`);
};

ebaySearchCrawl(searchText)
    .then(({ productsData, relatedSearchesText }) => {
        productsData?.forEach((res) => printProductData(res));
        console.log(relatedSearchesText);
    })
    .catch((err) => console.error(err));
