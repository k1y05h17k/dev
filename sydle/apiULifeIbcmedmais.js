const axios = require("axios");

let clientId = "295bf844-9be9-43da-a36c-969827cd21b3";
let senhaDoSyspass = "bZ.8Q~1YA1tXFWFC4s1mscrzF53EBKNXXFE-Pddr";
let secret = senhaDoSyspass;
let tokenURL = `https://login.microsoftonline.com/80f6a699-b024-4b7b-8cca-5ecfdd2a2fe3/oauth2/v2.0/token`;
const libURL = `https://cloudapp-hml.animaeducacao.com.br/servico-gestao-bibliotecas/services/v1/libraries/brands/14`;
// const libAcessURL = `https://cloudapp-hml.animaeducacao.com.br/servico-gestao-bibliotecas/services/v1/libraries/${idLib}/brands/14/redirect`
let student = {
    organizationID: "14",
    studentCpf: "01825537011",
    studentName: "Kiyoshi Takahama",
    studentRegistration: "01825537011",
    studentEmail:"kiyoshi.borges@inspirali.com"
}

// Função para tratar os erros

function handleError(error) {
    if (error.response) {
        console.error(`Erro de resposta da API: Status ${error.response.status}`);

    } else if (error.request) {
        console.error("Erro de rede ou sem resposta:", error.request);

    } else {
        console.error("Erro na configuração da solicitação", error.message);

    }
}

// Função que valida se o objeto é valido! 

function validateData(data) {
    if (!data || typeof data !== "object") {
        console.error("Dados Inválidos: o objeto está nulo");
        return false;
    }
    return true;
}

// Função que gera Token de acesso do usuário

async function getAccessToken(data) {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', secret);
    params.append('scope', 'api://servico_gestao_bibliotecas_devhml/.default');

    try {
        const response = await axios.post(tokenURL, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("Função 1 - Token de Acesso:", response.data.access_token);
        data = { ...data };
        token = response.data.access_token;
        // console.log(data);
        getAccessLib(data, token);

        return response.data.access_token;
    } catch (error) {
        console.error('Erro ao obter token de acesso:', error);
        return null;
    }
}

getAccessToken(student);


// Função que lista as bibliotecas disponiveis para o Aluno

async function getAccessLib(data, token) {
    if (!validateData(data)) return null;
        
    let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: libURL,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        data: { data },
    };

    try {
        const response = await axios.request(config);
        if (response.status === 200) {
            dataLab = response.data

            getLibrary(data, token)
            return console.log("Função 2 - Lista de bibliotecas Disponiveis",dataLab) ;
            
        } else {
            null
        }
    } catch (error) {
        handleError(error);
    }

}

// Função que libera o acesso de uma biblioteca específica para o aluno

async function getLibrary(data, token) {
    if (!validateData(data)) return null;

    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://cloudapp-hml.animaeducacao.com.br/servico-gestao-bibliotecas/services/v1/libraries/98/brands/14/redirect`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
         data,
    };

    try {
        const response = await axios.request(config);
        if (response.status === 200) {
            return console.log("Função 3 - URL: ",response.data);
        } else {
            throw new Error('Resposta da API não foi 200 OK');
        }
    } catch (error) {
        handleError(error);
        throw error;
        
    }
}