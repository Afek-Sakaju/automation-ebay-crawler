const { WEBSITE_BASE_URL, WEBSITE_SEARCH_PATH } = require("./constants");

const formatSearchString = (searchString) => {
    return searchString?.replaceAll(" ", "+");
};

module.exports.getWebsiteSearchUrl = (searchString) => {
    const formattedSearchString = formatSearchString(searchString);

    return `${WEBSITE_BASE_URL}/${WEBSITE_SEARCH_PATH}/${formattedSearchString}`;
};
