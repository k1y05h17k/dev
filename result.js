
function fetchPage(websiteId, pageNumber, headers) {
    const url = `https://api.crisp.chat/v1/website/${websiteId}/people/profiles/${pageNumber}`;

    return fetch(url, {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro ao buscar página: ${response.statusText}`);
        }
        return response.json();
    });
}

function iteratePages(websiteId, headers) {
    let currentPage = 1;
    let allData = [];

    function getNextPage() {
        return fetchPage(websiteId, currentPage, headers).then(pageData => {
            if (pageData && pageData.data && pageData.data.length > 0) {
                allData.push(...pageData.data);
                currentPage++;
                return getNextPage(); // Recursão para a próxima página
            } else {
                return allData; // Retorna todos os dados quando não houver mais páginas
            }
        });
    }

    return getNextPage();
}


const websiteId = 'd0bee5f8-c285-4994-a88d-2b20eb7df5bf'; 
const headers = {
    'Authorization': 'Basic M2U3Y2ZlMTYtY2NkYi00ZjI0LWI0ZGUtM2ViYjU1ZGM2YWFjOjE3ZmMxYzM3MWQ0YzlkODk1Njc1MDczMzliNGNhNzUxYmUxNmZiNzZjZWJmYzgzMjI2NTlmNGZkMjg0NzhkYTU=',
    'Content-Type': 'application/json',
    "X-Crisp-Tier": "plugin",
	"Connection": "keep-alive"
};
iteratePages(websiteId, headers)
    .then(allData => {
        console.log('Todos os dados coletados:', allData);
    })
    .catch(error => {
        console.error('Erro durante a iteração das páginas:', error);
    });
