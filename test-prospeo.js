require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.PROSPEO_API_KEY;

async function testProspeo() {
    console.log("\n=================================");
    console.log("PROSPEO API TEST");
    console.log("=================================\n");

    try {
        // STEP 1 - SEARCH
        console.log("Running Search API...\n");

        const searchResponse = await axios.post(
            "https://api.prospeo.io/search-person",
            {
                page: 1,
                filters: {
                    company: {
                        websites: {
                            include: ["stripe.com"],
                        },
                    },
                },
            },
            {
                headers: {
                    "X-KEY": API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        const searchData = searchResponse.data;

        console.log("✓ Search API Success");
        console.log(`Total Results: ${searchData.pagination.total_count}`);
        console.log(`Current Page: ${searchData.pagination.current_page}`);
        console.log("");

        if (!searchData.results || searchData.results.length === 0) {
            console.log("No people found.");
            return;
        }

        const firstPerson = searchData.results[0].person;

        console.log("FIRST PERSON");
        console.log("---------------------------------");
        console.log("Name:", firstPerson.full_name);
        console.log("Title:", firstPerson.current_job_title);
        console.log("Person ID:", firstPerson.person_id);
        console.log("LinkedIn:", firstPerson.linkedin_url);
        console.log("");

        const personId = firstPerson.person_id;

        if (!personId) {
            console.log("❌ No person_id found.");
            return;
        }

        // STEP 2 - ENRICH
        console.log("Running Enrich API...\n");

        const enrichResponse = await axios.post(
            "https://api.prospeo.io/enrich-person",
            {
                data: {
                    person_id: personId,
                },
            },
            {
                headers: {
                    "X-KEY": API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        const enrichData = enrichResponse.data;

        console.log("✓ Enrich API Success\n");

        console.log("ENRICHED PROFILE");
        console.log("---------------------------------");

        const person =
            enrichData.person ||
            enrichData.response?.person ||
            enrichData.data?.person;

        const company =
            enrichData.company ||
            enrichData.response?.company ||
            enrichData.data?.company;

        console.log("Name:", person?.full_name || "N/A");
        console.log("Title:", person?.current_job_title || "N/A");
        console.log("Company:", company?.name || "N/A");
        console.log("LinkedIn:", person?.linkedin_url || "N/A");

        console.log("\nFULL ENRICH RESPONSE:");
        console.log(JSON.stringify(enrichData, null, 2));
    } catch (error) {
        console.log("\nERROR");

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log(
                JSON.stringify(error.response.data, null, 2)
            );
        } else {
            console.log(error.message);
        }
    }
}

testProspeo();