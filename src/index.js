require("dotenv").config();

const readline = require("readline");
const fs = require("fs");
const path = require("path");

const companyFinder = require("./pipeline/companyFinder");
const peopleFinder = require("./pipeline/peopleFinder");
const emailEnricher = require("./pipeline/emailEnricher");
const emailGenerator = require("./pipeline/emailGenerator");
const emailSender = require("./pipeline/emailSender");

const geminiConfig = require("./config/geminiConfig");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("\nSUBSPACE OUTREACH");

const startTime = Date.now();

rl.question(
    "\nEnter company domain: ",
    async (domain) => {
        try {
            const companies = await companyFinder(domain);
            if (!companies.length) {
                console.log("\nNo companies found.");
                rl.close();
                return;
            }

            const contacts = await peopleFinder(companies);
            if (!contacts.length) {
                console.log("\nNo contacts found.");
                rl.close();
                return;
            }

            const enrichedEmails = await emailEnricher();
            const outreach = await emailGenerator();
            await emailSender(rl);

            const duration = ((Date.now() - startTime) / 1000).toFixed(1);

            console.log("\nPIPELINE COMPLETE");
            console.log(`Duration: ${duration}s`);
            console.log(`Results: ${companies.length} companies, ${contacts.length} contacts, ${enrichedEmails.length} emails, ${outreach.length} messages`);

        } catch (error) {
            console.log(`\nPIPELINE FAILED: ${error.message}`);
        }

        rl.close();
    }
);

