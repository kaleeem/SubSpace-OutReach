const fs = require("fs");
const path = require("path");

const {
    generateOutreach
} = require("../services/gemini");

const {
    delay
} = require("../utils/delay");

const { addLog } = require("../utils/logger");

async function emailGenerator() {
    console.log("\nOUTREACH GENERATION");

    const emailsPath = path.join(__dirname, "../../data/emails.json");
    const outreachPath = path.join(__dirname, "../../data/outreach.json");

    if (!fs.existsSync(emailsPath)) {
        addLog("No verified email records found");
        return [];
    }

    const emails = JSON.parse(fs.readFileSync(emailsPath, "utf8"));
    const outreach = [];

    for (let i = 0; i < emails.length; i++) {
        const contact = emails[i];

        try {
            const { data } = await generateOutreach(contact);

            outreach.push({
                company: contact.company,
                name: contact.name,
                title: contact.title,
                realEmail: contact.email,
                subject: data.subject,
                body: data.body
            });

            addLog(`Outreach created for ${contact.name}`);
        } catch {
            const firstName = contact.name?.split(" ")[0] || "there";
            outreach.push({
                company: contact.company,
                name: contact.name,
                title: contact.title,
                realEmail: contact.email,
                subject: `Quick question regarding ${contact.company}`,
                body: `Hi ${firstName},

I came across ${contact.company} while researching companies in your space.

I noticed your role as ${contact.title} and wanted to reach out.

I recently built an automated outreach platform that discovers similar companies, identifies decision makers, enriches verified contact information, and generates personalized outreach campaigns.

Would love to get your thoughts on it.

Best regards,
Kaleem`
            });

            addLog(`Fallback template used for ${contact.name}`);
        }

        if (i < emails.length - 1) {
            await delay(2000);
        }
    }

    fs.writeFileSync(outreachPath, JSON.stringify(outreach, null, 2));
    addLog(`Saved ${outreach.length} outreach messages`);

    return outreach;
}

module.exports = emailGenerator;

