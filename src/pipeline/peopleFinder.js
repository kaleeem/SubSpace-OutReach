
const fs = require("fs");
const path = require("path");

const prospeoService =
    require("../services/prospeo");

const {
    addLog
} = require("../utils/logger");

async function peopleFinder(companies) {
    const contacts = [];

    console.log("\nDECISION MAKER DISCOVERY");

    for (const item of companies) {
        const company = item.company;
        const domain = company.domain;

        const people = await prospeoService.searchPeople(domain);

        if (!people.length) {
            continue;
        }

        const bestPerson = people[0];
        const person = bestPerson.person;

        const contact = {
            company: company.name,
            domain: domain,
            companyDescription: company.description || "",
            name: person.full_name,
            title: person.current_job_title,
            linkedin: person.linkedin_url,
            personId: person.person_id
        };

        contacts.push(contact);
        addLog(`Found ${contact.title} at ${contact.company}`);
    }

    const outputPath = path.join(__dirname, "../../data/contacts.json");
    fs.writeFileSync(outputPath, JSON.stringify(contacts, null, 2));

    addLog(`Saved ${contacts.length} contacts`);
    return contacts;
}

module.exports = peopleFinder;

