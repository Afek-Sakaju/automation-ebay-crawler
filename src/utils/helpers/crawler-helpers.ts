import puppeteer from "puppeteer";

import type { Product, SearchResult } from "../../interfaces";

import { getWebsiteSearchUrl } from "./url-format-helpers";

export async function ebaySearchCrawl(
    searchText: string
): Promise<SearchResult> {
    if (!searchText) throw Error("Search string can't be empty");

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const searchUrl = getWebsiteSearchUrl(searchText);
    await page.goto(searchUrl);

    await page.evaluate(() => {
        const isSearchErrorAppeared: boolean =
            !!document.querySelector(".s-error");

        if (isSearchErrorAppeared) {
            throw Error(
                "Search went wrong, try to use another search text for the crawler"
            );
        }
    });

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
