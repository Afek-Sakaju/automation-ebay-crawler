import { WEBSITE_BASE_URL, WEBSITE_SEARCH_PATH } from "../variables";

export const formatSearchString = (searchString) => {
    return searchString?.replaceAll(" ", "+");
};

export const getWebsiteSearchUrl = (searchString) => {
    const formattedSearchString = formatSearchString(searchString);

    return `${WEBSITE_BASE_URL}/${WEBSITE_SEARCH_PATH}/${formattedSearchString}`;
};
