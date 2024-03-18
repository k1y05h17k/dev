const axios = require('axios');

const apiUrl = 'https://graph.facebook.com/v18.0/167577199780129/register';
const accessToken = 'EAABzwxWH7NMBO71SXSffgjAOKSnIwhj3cZCjWfqtDeEB3WuQ8Rs2Dl9gtJAU0OJ6lJxvtsHjGUVd22SUTxI1CBEtT0jPrd5FfTjjwpajTkgsW2NZAc9nHCZATYZCeyDmImJ34DUDOidmhACqTxziCyTbZB20U7f42Azkg73w29lvLHYXiMUZBgUIAAJZCUiB6acL6u7tNlC6ZBGyLnirmvPUcM15FONGV1QZAiZCkZD';

const requestData = {
    messaging_product: "whatsapp",
    pin: "542015"
};

axios({
    method: 'POST',
    url: apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    },
    data: requestData
})
.then(response => {
    console.log('Resposta da API:', response.data);
})
.catch(error => {
    console.error('Erro na API:', error);
});