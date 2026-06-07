// Brevo service wrapper
const axios = require("axios");

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

async function sendEmail(to, subject, htmlContent) {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "SubSpace Outreach",
                    email: SENDER_EMAIL
                },
                to: [
                    {
                        email: to
                    }
                ],
                subject,
                htmlContent
            },
            {
                headers: {
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                    accept: "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(`Brevo API Error: ${error.response.status} ${error.response.statusText}`);
        } else {
            console.log(`Brevo API Error: ${error.message}`);
        }
        return null;
    }
}

module.exports = {
    sendEmail
};