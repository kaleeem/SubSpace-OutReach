const fs = require("fs");
const path = require("path");

const oceanService =
    require("../services/ocean");

const {
    addLog
} = require("../utils/logger");

async function companyFinder(domain) {
    console.log("\nCOMPANY DISCOVERY");

    const companies = await oceanService.findSimilarCompanies(domain);

    if (!companies.length) {
        addLog("No similar companies found");
        return [];
    }

    addLog(`Found ${companies.length} similar companies`);

    companies.forEach((item, index) => {
        const companyName = item.company?.name || "Unknown";
        const companyDomain = item.company?.domain || "No Domain";
        addLog(`${index + 1}. ${companyName} (${companyDomain})`);
    });

    try {
        const formattedCompanies = companies.map(item => ({
            company: item.company?.name || "",
            domain: item.company?.domain || "",
            relevance: item.relevance || "-"
        }));

        fs.writeFileSync(
            path.join(__dirname, "../../data/companies.json"),
            JSON.stringify(formattedCompanies, null, 2)
        );

        addLog(`Saved ${formattedCompanies.length} companies`);
    } catch (error) {
        addLog(`Failed to save company data: ${error.message}`);
    }

    return companies;
}

module.exports = companyFinder;

