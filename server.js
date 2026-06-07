require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");

const companyFinder = require("./src/pipeline/companyFinder");
const peopleFinder = require("./src/pipeline/peopleFinder");
const emailEnricher = require("./src/pipeline/emailEnricher");
const emailGenerator = require("./src/pipeline/emailGenerator");

const {
    getLogs,
    clearLogs
} = require("./src/utils/logger");

const app = express();

app.use(express.static("public"));
app.use(express.json());

function readJson(filename) {

    try {

        const filePath = path.join(
            __dirname,
            "data",
            filename
        );

        if (!fs.existsSync(filePath)) {
            return [];
        }

        return JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

    } catch (error) {

        console.log(`Failed reading ${filename}`);
        return [];

    }
}

function resetFile(filename) {

    const filePath = path.join(
        __dirname,
        "data",
        filename
    );

    fs.writeFileSync(
        filePath,
        JSON.stringify([], null, 2)
    );
}

app.get("/api/stats", (req, res) => {

    const companies = readJson("companies.json");
    const contacts = readJson("contacts.json");
    const emails = readJson("emails.json");
    const outreach = readJson("outreach.json");

    res.json({
        companies: companies.length,
        contacts: contacts.length,
        emails: emails.length,
        outreach: outreach.length
    });

});

app.get("/api/companies", (req, res) => {
    res.json(readJson("companies.json"));
});

app.get("/api/contacts", (req, res) => {
    res.json(readJson("contacts.json"));
});

app.get("/api/emails", (req, res) => {
    res.json(readJson("emails.json"));
});

app.get("/api/outreach", (req, res) => {
    res.json(readJson("outreach.json"));
});

app.get("/api/logs", (req, res) => {

    res.json(
        getLogs()
    );

});

/*
|--------------------------------------------------------------------------
| RESET WORKSPACE
|--------------------------------------------------------------------------
*/

app.post("/api/reset", (req, res) => {

    try {

        resetFile("companies.json");
        resetFile("contacts.json");
        resetFile("emails.json");
        resetFile("outreach.json");

        clearLogs();

        res.json({
            success: true,
            message: "Workspace reset successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| RUN PIPELINE
|--------------------------------------------------------------------------
*/

app.post("/api/run", async (req, res) => {

    try {

        clearLogs();

        const { domain } = req.body;

        if (!domain) {

            return res.status(400).json({
                success: false,
                message: "Domain is required"
            });

        }

        const companies =
            await companyFinder(domain);

        if (!companies.length) {

            return res.status(400).json({
                success: false,
                message: "No companies found"
            });

        }

        const contacts =
            await peopleFinder(companies);

        if (!contacts.length) {

            return res.status(400).json({
                success: false,
                message: "No contacts found"
            });

        }

        await emailEnricher();

        await emailGenerator();

        res.json({
            success: true,
            message: "Pipeline completed successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

app.listen(3000, () => {

    console.log("");
    console.log("==============================");
    console.log("SUBSPACE DASHBOARD");
    console.log("==============================");
    console.log("http://localhost:3000");
    console.log("");

});