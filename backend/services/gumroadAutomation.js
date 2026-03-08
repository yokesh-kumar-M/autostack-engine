const axios = require('axios');

const GUMROAD_API_URL = 'https://api.gumroad.com/v2';
const ACCESS_TOKEN = process.env.GUMROAD_ACCESS_TOKEN;

/**
 * Creates a product listing on Gumroad
 * @param {Object} productData - { name, price, description, etc }
 */
async function createGumroadProduct(productData) {
    try {
        const params = new URLSearchParams();
        params.append('access_token', ACCESS_TOKEN);
        params.append('name', productData.name);
        params.append('price', productData.price);
        params.append('description', productData.description);
        params.append('is_pay_what_you_want', productData.is_pay_what_you_want ? 'true' : 'false');
        params.append('published', 'false');

        const response = await axios.post(`${GUMROAD_API_URL}/products`, params);

        if (response.data.success) {
            return response.data.product;
        } else {
            throw new Error('Gumroad API returned success:false');
        }
    } catch (error) {
        console.error('Error creating Gumroad product:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Updates an existing Gumroad product
 */
async function updateGumroadProduct(id, updateData) {
    try {
        const response = await axios.put(`${GUMROAD_API_URL}/products/${id}`, {
            access_token: ACCESS_TOKEN,
            ...updateData
        });
        return response.data.product;
    } catch (error) {
        console.error('Error updating Gumroad product:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = { createGumroadProduct, updateGumroadProduct };
