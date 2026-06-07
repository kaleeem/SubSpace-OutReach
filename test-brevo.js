require("dotenv").config();
const axios = require("axios");

const BREVO_API_KEY = process.env.BREVO_API_KEY;

// CHANGE THESE
const SENDER_EMAIL = "kaleem@kaleemm.me";
const SENDER_NAME = "Kaleem";

const RECEIVER_EMAIL = "YOUR_PERSONAL_EMAIL@gmail.com";

async function testBrevo() {
    console.log("\n==============================");
    console.log("BREVO API TEST");
    console.log("==============================\n");

    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: SENDER_NAME,
                    email: SENDER_EMAIL,
                },

                to: [
                    {
                        email: RECEIVER_EMAIL,
                    },
                ],

                subject: "Brevo API Test",

                htmlContent: `
          <h2>Brevo Test Successful 🎉</h2>
          <p>This email was sent using the Brevo API.</p>
          <p>If you received this message, your API key and sender configuration are working correctly.</p>
        `,
            },
            {
                headers: {
                    "api-key": BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log("✓ Brevo API key is valid");
        console.log("✓ Email request accepted");
        console.log("Message ID:", response.data.messageId);
    } catch (error) {
        console.log("\nERROR\n");

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

testBrevo();