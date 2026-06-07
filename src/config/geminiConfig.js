/**
 * Central source of truth for Gemini AI configuration.
 */
module.exports = {
    MODEL: "gemini-2.5-flash",
    MAX_RETRIES: 5,
    RETRY_DELAYS: [
        0, // Immediate first attempt
        2000,
        5000,
        10000,
        20000
    ]
};
