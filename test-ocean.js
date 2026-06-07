require('dotenv').config();
const axios = require('axios');

const OCEAN_API_KEY = process.env.OCEAN_API_KEY;

async function testOcean() {

    console.log('\n==============================');
    console.log('OCEAN API TEST');
    console.log('==============================\n');

    try {

        const response = await axios.post(
            'https://api.ocean.io/v3/search/companies',
            {
                size: 5,
                companiesFilters: {
                    lookalikeDomains: [
                        'stripe.com'
                    ]
                },
                fields: [
                    'name',
                    'domain',
                    'description',
                    'employeeCountOcean'
                ]
            },
            {
                headers: {
                    'x-api-token': OCEAN_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✓ Ocean API key is valid');

        const data = response.data;

        console.log('\nRAW RESPONSE:\n');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {

        console.log('\nERROR RESPONSE:\n');

        if (error.response) {
            console.log('Status:', error.response.status);
            console.log(JSON.stringify(error.response.data, null, 2));
        } else {
            console.log(error.message);
        }
    }
}

testOcean();