const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt } = require("../utils/aiPrompt");
const { delay } = require("../utils/delay");
const config = require("../config/geminiConfig");
const { addLog } = require("../utils/logger");

const API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: config.MODEL
});

function isRetryable(error) {
    const message = error.message?.toLowerCase() || "";
    const status = error.status || (error.response && error.response.status);
    const retryableStatuses = [429, 500, 502, 503, 504];

    if (retryableStatuses.includes(status)) return true;
    if (
        message.includes("econnreset") ||
        message.includes("etimedout") ||
        message.includes("quota exceeded") ||
        message.includes("service unavailable") ||
        message.includes("overloaded") ||
        message.includes("deadline exceeded")
    ) {
        return true;
    }
    if (error instanceof SyntaxError || message.includes("parsing")) return true;
    return false;
}

function getFriendlyReason(error) {
    const message = error.message?.toLowerCase() || "";
    if (message.includes("quota exceeded")) return "Gemini API quota exceeded";
    if (message.includes("429")) return "Gemini rate limit exceeded";
    if (message.includes("403")) return "Gemini project access denied";
    if (message.includes("401")) return "Invalid Gemini API key";
    if (message.includes("invalid json")) return "Invalid AI response received";
    return "Temporary Gemini service issue";
}

function validateResponse(parsed) {
    if (!parsed || typeof parsed !== "object") return false;
    if (!parsed.subject || typeof parsed.subject !== "string") return false;
    if (!parsed.body || typeof parsed.body !== "string") return false;
    return true;
}

async function executeRequest(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    text = text
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");

    if (text.startsWith("```")) {
        text = text
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
    }

    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch {
        throw new Error("Invalid JSON response received from AI");
    }

    if (!validateResponse(parsed)) {
        throw new Error("Invalid Gemini response format");
    }

    return parsed;
}

async function generateOutreach(contact) {
    if (!API_KEY) {
        addLog("Gemini configuration missing: API key not configured");
        throw new Error("GEMINI_API_KEY is not defined");
    }

    const prompt = buildPrompt(contact);
    addLog(`Generating outreach for ${contact.name}...`);

    for (let attempt = 1; attempt <= config.MAX_RETRIES; attempt++) {
        try {
            const result = await executeRequest(prompt);
            return {
                data: result,
                attempts: attempt
            };
        } catch (error) {
            const retryable = isRetryable(error);
            const reason = getFriendlyReason(error);

            if (attempt === config.MAX_RETRIES || !retryable) {
                addLog(`Unable to generate outreach: ${reason}`);
                throw error;
            }

            const nextDelay = config.RETRY_DELAYS[attempt];
            addLog(`Gemini unavailable. Retrying in ${nextDelay / 1000} seconds...`);
            await delay(nextDelay);
        }
    }
}

module.exports = {
    generateOutreach
};

