const PROJECT_DESCRIPTION =
  "SubSpace Outreach is an automated outreach platform that discovers lookalike companies using Ocean.io, finds decision makers using Prospeo, enriches verified contact information, generates personalized outreach, and delivers emails through Brevo.";

function buildPrompt(contact) {
  return `
You are writing a professional outreach email.

Recipient Name:
${contact.name}

Recipient Title:
${contact.title}

Company:
${contact.company}

Company Description:
${contact.companyDescription}

About Me:
Computer Science student who built ${PROJECT_DESCRIPTION}

GOAL:

Generate a personalized outreach email that clearly demonstrates:

1. Awareness of the recipient's company.
2. Awareness of the recipient's role.
3. Interest in learning from their experience.
4. Mention of SubSpace Outreach naturally.
5. A concise call-to-action.

Rules:

- Maximum 150 words.
- Professional tone.
- No emojis.
- No buzzwords.
- No marketing language.
- Sound human.
- Mention company naturally.
- Mention role naturally.

Return STRICT JSON ONLY.

{
  "subject": "",
  "body": ""
}
`;
}

module.exports = {
  buildPrompt
};