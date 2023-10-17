
const axios = require('axios');

const apiKey = '668825387d701b9e8ac0e4b2188444c0'; // Minha API Key
const baseUrl = 'http://localhost:3000'; // Rodando o projeto localmente


async function makeApiRequest() {
    try {
        const response = await axios.get(`${baseUrl}/some/endpoint?api_key=${apiKey}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    makeApiRequest,
};
