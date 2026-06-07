# SubSpace Outreach Automation Platform

## CLI OUTPUT

<img width="811" height="396" alt="image" src="https://github.com/user-attachments/assets/9eb4a7c0-f80b-4b6d-8b5a-06101ea58a3c" />

## Custom DashBoard

<img width="484" height="799" alt="image" src="https://github.com/user-attachments/assets/592786d4-1940-45b5-a874-b824a7056b8b" />

## Resulting Email 

<img width="1560" height="447" alt="image" src="https://github.com/user-attachments/assets/6e5ff044-0af8-48c0-b039-1e80002cdc8f" />
<img width="1569" height="308" alt="image" src="https://github.com/user-attachments/assets/71cf4c23-44ac-4fe5-841a-4ec1da05e18a" />

## Overview

SubSpace Outreach Automation Platform is an end-to-end cold outreach system that automates prospect discovery, decision-maker identification, email enrichment, AI-powered outreach generation, and email delivery.

The system accepts a single company domain as input and automatically executes the complete outreach workflow with minimal human intervention.

This project was developed as part of the Software Engineering Take-Home Assignment for SubSpace / Vocallabs.

---

## Problem Statement

Sales teams spend significant time manually:

* Researching similar companies
* Finding relevant decision makers
* Collecting verified work email addresses
* Writing personalized outreach messages
* Sending outreach campaigns

This platform automates the entire process through API integrations and AI-generated communication.

---

## Workflow

Input:

Company Domain

Example:

stripe.com

Pipeline:

1. Company Discovery

   * Uses Ocean.io API
   * Finds companies similar to the provided domain

2. Decision Maker Discovery

   * Uses Prospeo API
   * Identifies engineering and leadership contacts

3. Email Enrichment

   * Uses Prospeo enrichment endpoints
   * Retrieves verified professional email addresses

4. Outreach Generation

   * Uses Google Gemini
   * Generates personalized outreach emails

5. Email Review Checkpoint

   * Displays all generated outreach messages
   * Requires confirmation before sending

6. Email Delivery

   * Uses Brevo Transactional Email API
   * Delivers outreach emails

---

## Features

* End-to-end automated outreach pipeline
* Similar company discovery
* Decision-maker identification
* Verified email enrichment
* AI-generated personalized outreach
* Retry handling for API rate limits
* Fallback outreach templates
* Email review checkpoint before delivery
* Dashboard monitoring interface
* Live pipeline execution logs
* Workspace reset functionality

---

## Tech Stack

Backend:

* Node.js
* Express.js

APIs:

* Ocean.io
* Prospeo
* Google Gemini
* Brevo

Frontend:

* HTML
* CSS
* JavaScript

Storage:

* JSON-based local persistence

Version Control:

* Git
* GitHub

---

## Project Structure

project-root/
```text
SubSpace-OutReach/
├── public/
│   ├── index.html
│   └── style.css
├── src/
│   ├── config/
│   ├── pipeline/
│   ├── services/
│   ├── utils/
│   └── index.js
├── data/
│   ├── companies.json
│   ├── contacts.json
│   ├── emails.json
│   └── outreach.json
├── server.js
├── package.json
└── README.md
```

---

## Dashboard Features

* Pipeline execution from browser
* Live execution logs
* Companies discovered
* Contacts identified
* Verified emails
* Generated outreach messages
* Workspace reset

---

## Error Handling

The system is designed to handle:

* API rate limiting
* Missing contact data
* Missing email addresses
* AI generation failures
* Partial pipeline failures

When AI generation is unavailable, the system automatically falls back to a predefined outreach template to ensure pipeline completion.

---

## Safety Mechanism

Before sending emails, the system displays:

* Recipient information
* Company information
* Email subject

A manual confirmation step is required before email delivery begins.

This prevents accidental outreach and provides a final review opportunity.

---

## Example Results

Input:

stripe.com

Output:

* 5 similar companies discovered
* 4 decision makers identified
* 4 verified work emails enriched
* 4 personalized outreach messages generated
* 4 emails delivered successfully

---

## Future Improvements

* Database integration
* Deployment support
* CRM integration
* Multi-channel outreach
* Advanced analytics dashboard
* Email open and reply tracking
* Bulk campaign scheduling

---

## Author

Kaleem M

Software Engineering Internship Assignment

SubSpace / Vocallabs
