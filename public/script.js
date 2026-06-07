async function loadStats() {
    try {
        const response = await fetch("/api/stats");
        const data = await response.json();

        document.getElementById("companies-count").textContent =
            data.companies;

        document.getElementById("contacts-count").textContent =
            data.contacts;

        document.getElementById("emails-count").textContent =
            data.emails;

        document.getElementById("outreach-count").textContent =
            data.outreach;

    } catch (error) {
        console.error(error);
    }
}

loadStats();