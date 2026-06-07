// Logging utility
let logs = [];

function addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const log = `[${timestamp}] ${message}`;
    
    // Terminal output: clean text only
    console.log(message);
    
    // Internal dashboard storage: includes timestamp
    logs.push(log);
}

function getLogs() {
    return logs;
}

function clearLogs() {
    logs = [];
}

module.exports = {
    addLog,
    getLogs,
    clearLogs
};