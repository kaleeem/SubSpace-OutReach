const fs = require("fs");
const path = require("path");

const brevoService =
    require("../services/brevo");

const { addLog } = require("../utils/logger");

async function askForConfirmation(rl) {
    return new Promise((resolve) => {
        rl.question("\nProceed with sending emails? (y/n): ", (answer) => {
            resolve(answer.trim().toLowerCase());
        });
    });
}

async function emailSender(rl) {
    console.log("\nEMAIL REVIEW");

    const outreachPath = path.join(__dirname, "../../data/outreach.json");
    const outreach = JSON.parse(fs.readFileSync(outreachPath, "utf8"));

    if (!outreach.length) {
        addLog("No outreach emails found.");
        return { sentCount: 0, total: 0 };
    }

    outreach.forEach((email, index) => {
        addLog(`${index + 1}. ${email.name} (${email.company}) - ${email.realEmail}`);
    });

    const confirmation = await askForConfirmation(rl);

    if (confirmation !== "y" && confirmation !== "yes") {
        addLog("Email sending cancelled.");
        return { sentCount: 0, total: outreach.length };
    }

    console.log("\nEMAIL DELIVERY");

    const testEmail = process.env.TEST_EMAIL;
    let sentCount = 0;

    for (const email of outreach) {
        const html = `<p>${email.body.replace(/\n/g, "<br>")}</p>`;
        const result = await brevoService.sendEmail(testEmail, email.subject, html);

        if (result) {
            sentCount++;
            addLog(`Email delivered for ${email.name}`);
        } else {
            addLog(`Email delivery failed for ${email.name}`);
        }
    }

    addLog(`Delivered ${sentCount}/${outreach.length} emails`);
    return { sentCount, total: outreach.length };
}

module.exports = emailSender;
