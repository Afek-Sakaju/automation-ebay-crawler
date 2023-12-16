import puppeteer from "puppeteer";

import { getWebsiteSearchUrl } from "./utils/helpers";

interface Product {
    id?: string;
    position?: number;
    title?: string;
    price?: string;
    sponsored?: boolean;
    shipping?: string;
    image?: string;
}

interface SearchResult {
    productsData: Product[];
    relatedSearchesText: string[];
}

async function ebaySearchCrawl(searchText: string): Promise<SearchResult> {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const searchUrl = getWebsiteSearchUrl(searchText);
    await page.goto(searchUrl);
    await page.waitForSelector(".s-item");

    const productsData = await page.evaluate(() => {
        const productsResults: Product[] = [];

        document.querySelectorAll(".s-item").forEach((product) => {
            const id = product?.id as string;
            if (!id) return;

            const title = (
                product.querySelector(".s-item__title") as HTMLElement
            )?.innerText as string;
            const price = (
                product.querySelector(".s-item__price") as HTMLElement
            )?.innerText as string;
            const sponsored = !!product.querySelector(".SECONDARY_INFO");
            const shipping = (
                product.querySelector(".s-item__shipping") as HTMLElement
            )?.innerText as string;
            const image: string | undefined = (
                product.querySelector(".s-item__image img") as HTMLImageElement
            )?.src;
            const dataViewId = product
                .getAttribute("data-view")
                ?.split("iid:")?.[1];
            const position = dataViewId ? +dataViewId : undefined;

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
            ...(relatedSearchesContainer?.querySelectorAll("a") || []),
        ]?.map((link) => link.textContent?.trim() || "");

        return relatedTags || [];
    });

    await browser.close();
    return { productsData, relatedSearchesText };
}

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
