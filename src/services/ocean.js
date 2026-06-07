const axios = require("axios");

const OCEAN_API_KEY = process.env.OCEAN_API_KEY;

async function findSimilarCompanies(domain) {
    try {
        const response = await axios.post(
            "https://api.ocean.io/v3/search/companies",
            {
                size: 5,
                companiesFilters: {
                    lookalikeDomains: [domain]
                },
                fields: [
                    "name",
                    "domain",
                    "description",
                    "employeeCountOcean"
                ]
            },
            {
                headers: {
                    "x-api-token": OCEAN_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.companies || [];

    } catch (error) {
        // Log basic error information without full stack trace unless fatal
        if (error.response) {
            // Keep status code but avoid full payload
            console.log(`Ocean API Error: ${error.response.status} ${error.response.statusText}`);
        } else {
            console.log(`Ocean API Error: ${error.message}`);
        }

        return [];
    }
}

module.exports = {
    findSimilarCompanies
};