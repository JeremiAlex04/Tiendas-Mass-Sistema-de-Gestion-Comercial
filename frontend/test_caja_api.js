
const axios = require('axios');

async function checkCaja() {
    try {
        // Assuming employee ID 1 (admin)
        const response = await axios.get('http://localhost:8080/caja/estado?empleadoId=1');
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkCaja();
