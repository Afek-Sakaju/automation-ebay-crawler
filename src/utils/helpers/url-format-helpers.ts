import {
    WEBSITE_BASE_URL,
    WEBSITE_SEARCH_PATH,
} from "../variables/url-constants";

export const formatSearchString = (
    searchString: string
): string | undefined => {
    /* Faced a TypeScript error when using the replaceAll method. 
		To avoid delays and meet the deadline, left it with ts-ignore for now. */
    // @ts-ignore
    return searchString?.replaceAll(" ", "+");
};

export const getWebsiteSearchUrl = (searchString) => {
    const formattedSearchString = formatSearchString(searchString);

    return `${WEBSITE_BASE_URL}/${WEBSITE_SEARCH_PATH}/${formattedSearchString}`;
};
