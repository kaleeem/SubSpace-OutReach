
const axios = require("axios");

const PROSPEO_API_KEY =
    process.env.PROSPEO_API_KEY;

function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

async function executeWithRetry(apiCall) {
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            const errorCode = error.response?.data?.error_code;
            const isRateLimited = errorCode === "Rate limit exceeded";

            if (!isRateLimited || attempt === MAX_RETRIES) {
                throw error;
            }

            const waitTime = attempt * 2000;
            console.log(`API rate limit reached. Retrying in ${waitTime / 1000} seconds...`);
            await sleep(waitTime);
        }
    }
}

async function searchPeople(domain) {
    try {
        const response = await executeWithRetry(() =>
            axios.post(
                "https://api.prospeo.io/search-person",
                {
                    page: 1,
                    filters: {
                        company: { websites: { include: [domain] } },
                        person_job_title: {
                            include: [
                                "CTO",
                                "Chief Technology Officer",
                                "VP Engineering",
                                "Head of Engineering",
                                "Engineering Manager",
                                "Director of Engineering"
                            ]
                        }
                    }
                },
                {
                    headers: {
                        "X-KEY": PROSPEO_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            )
        );
        return response.data.results || [];
    } catch (error) {
        const errorCode = error.response?.data?.error_code;
        if (errorCode === "NO_RESULTS") {
            return [];
        }
        console.log(`Unable to search decision makers for ${domain}`);
        return [];
    }
}

async function enrichPerson(personId) {
    try {
        const response = await executeWithRetry(() =>
            axios.post(
                "https://api.prospeo.io/enrich-person",
                { data: { person_id: personId } },
                {
                    headers: {
                        "X-KEY": PROSPEO_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            )
        );
        return response.data.person;
    } catch {
        console.log(`Unable to enrich contact ${personId}`);
        return null;
    }
}

module.exports = {
    searchPeople,
    enrichPerson
};

