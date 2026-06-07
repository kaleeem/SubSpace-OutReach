const fs = require("fs");
const path = require("path");

const prospeoService =
    require("../services/prospeo");

const {
    addLog
} = require("../utils/logger");

async function emailEnricher() {
    console.log("\nEMAIL ENRICHMENT");

    const contactsPath = path.join(__dirname, "../../data/contacts.json");

    if (!fs.existsSync(contactsPath)) {
        addLog("No contacts available for enrichment");
        return [];
    }

    const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf8"));
    const enrichedContacts = [];

    for (const contact of contacts) {
        const result = await prospeoService.enrichPerson(contact.personId);

        if (!result) {
            addLog(`No verified email found for ${contact.name}`);
            continue;
        }

        const enriched = {
            company: contact.company,
            domain: contact.domain,
            companyDescription: contact.companyDescription || "",
            name: contact.name,
            title: contact.title,
            linkedin: contact.linkedin,
            email: result.email?.email || "N/A"
        };

        enrichedContacts.push(enriched);
        addLog(`Verified email for ${contact.name}`);
    }

    const outputPath = path.join(__dirname, "../../data/emails.json");
    fs.writeFileSync(outputPath, JSON.stringify(enrichedContacts, null, 2));

    addLog(`Saved ${enrichedContacts.length} verified emails`);
    return enrichedContacts;
}

module.exports = emailEnricher;

