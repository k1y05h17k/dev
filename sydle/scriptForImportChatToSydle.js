const axios = require('axios');

let chat = {
    test: 'test',
    nome: 'nome'
};

const token = "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..h7BCJvhS46PYf73rW-zAYA.vwW-T3DTsKyypXngQEZFHhAF75sUplaYhGCMVP3slLD4plNBL13MqrEBR38NC4hgG2Q_536oU1vWW958ibBGHmYHQl_tGffGORyF1vKbClJvD3z7zc0Y-yO_J9XEWllxMPHHPaydWoydqfNlNZZ-n0Jf8zgwUH00vPSy1Ne5b95fp3BsZDaKmU1D5n_ztMV0LB2JRuRWO4q8PGYu3rhC18EmMtVna6_wFDYN7YBHjIKvZirmIkJYjEwSj1X_YIK_aVOklc_OxIJcRrv2rpdaza5jCQd4nszRWQXkLI3jdJg0vKLVFxq5xzWG3nZZYgW8Fb1jchLhyxcNtpE75x4TMTfWTMj4pJZMEShrzzqGHthk5su60BNyESdGnBZpPInTaO0zuhdDDGM-WY6ZloqQ7PKXjKLkaJByssdrKeSxHnWlsMyqjD5PeZasXCbUbe5BvC2UfHVcm5GCEtfxiyXmYguFo9HaDA4ty57I42OWTOUSRBcAYEVkhe8SCKDY9_H46vR-Iqu7gMF45tK82sG0Bkh6k4uCMKKT5QBbd_GpzTHwWJdcal3wvXl41y81pC9YFbNl2Fgsn1819ZIxGs3hj-0xomS2sKMhnfAP7DVusbM_xvljmG4mgfdNcnbjygJJ.1lRE2081yplqEmTYEns_PQ";

sendChatForSydle(chat);

function validateChatData(data){
    if(!data || typeof data !== 'object'){
        console.error("Dados Inválidos: o objeto está nulo");
        return false;
    }
        return true;

}


async function sendChatForSydle(data) {

    if (!validateChatData(data)) return null;

    let config = {

        method: 'post',
        maxBodyLength: Infinity,
        url: `https://ibcmed-dev.sydle.one/api/1/migracao/com.ibcmed.integracoes/MigracaoDeDadosCrisp/createChat`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: { data }
    };

    try {
        const response = await axios.request(config);
        if (response.status === 200) {

            return console.log(response.data);

        } else {

            return null;

        }
    } catch (error) {
        if (error.response) {

            console.error('Erro de rede ou sem resposta:', error.request);

        } else {

            console.error('Erro ao buscar conversa:', error.message);

        }

        return null;
    }
}



// const authorization = 'Basic M2U3Y2ZlMTYtY2NkYi00ZjI0LWI0ZGUtM2ViYjU1ZGM2YWFjOjE3ZmMxYzM3MWQ0YzlkODk1Njc1MDczMzliNGNhNzUxYmUxNmZiNzZjZWJmYzgzMjI2NTlmNGZkMjg0NzhkYTU=';
// const token = 'Bearer eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..h7BCJvhS46PYf73rW-zAYA.vwW-T3DTsKyypXngQEZFHhAF75sUplaYhGCMVP3slLD4plNBL13MqrEBR38NC4hgG2Q_536oU1vWW958ibBGHmYHQl_tGffGORyF1vKbClJvD3z7zc0Y-yO_J9XEWllxMPHHPaydWoydqfNlNZZ-n0Jf8zgwUH00vPSy1Ne5b95fp3BsZDaKmU1D5n_ztMV0LB2JRuRWO4q8PGYu3rhC18EmMtVna6_wFDYN7YBHjIKvZirmIkJYjEwSj1X_YIK_aVOklc_OxIJcRrv2rpdaza5jCQd4nszRWQXkLI3jdJg0vKLVFxq5xzWG3nZZYgW8Fb1jchLhyxcNtpE75x4TMTfWTMj4pJZMEShrzzqGHthk5su60BNyESdGnBZpPInTaO0zuhdDDGM-WY6ZloqQ7PKXjKLkaJByssdrKeSxHnWlsMyqjD5PeZasXCbUbe5BvC2UfHVcm5GCEtfxiyXmYguFo9HaDA4ty57I42OWTOUSRBcAYEVkhe8SCKDY9_H46vR-Iqu7gMF45tK82sG0Bkh6k4uCMKKT5QBbd_GpzTHwWJdcal3wvXl41y81pC9YFbNl2Fgsn1819ZIxGs3hj-0xomS2sKMhnfAP7DVusbM_xvljmG4mgfdNcnbjygJJ.1lRE2081yplqEmTYEns_PQ';
async function paginateThroughData() {
    while (hasMorePages) {
        const data = await fetchPage(page_number);

        if (data && data.length > 0) {
            for (const item of data) {
                let data = {
                    'email': item.email,
                    'people_id': item.people_id,
                    'phone': item.person.phone,
                    'nickname': item.person.nickname,
                    'notepad': item.notepad,
                    'segment': item.segments
                };
                if (item.people_id) {
                    const profileData = await fetchProfile(item.people_id);

                    if (profileData && profileData.data && profileData.data.length > 0) {
                        for (profile of profileData.data) {

                            const chatData = await fetchConversation(profile);
                            if (chatData && chatData.data && chatData.data.length > 0) {
                                data = {
                                    ...data,
                                    'conversa': profile,
                                    'message': chatData.data.map(item => {

                                        return {
                                            'session_id': item.session_id,
                                            'type': item.type,
                                            'from': item.user,
                                            'origin': item.origin,
                                            'content': item.content,
                                            'user': {
                                                'user_id': item.user.user_id,
                                                'nickname': item.user.nickname
                                            },
                                            'delivered': item.delivered,
                                            'timestamp': new Date(item.timestamp)

                                        }
                                    })
                                }
                            } else {
                                console.log('Nenhuma Conversa Encontrada', profile);
                            }
                        }
                    } else {
                        console.log('Nenhuma informação de perfil encontrada para:', item.people_id);
                        continue;
                    }

                }
                console.log('Page number: ', page_number, 'Dados: ', data);
                sendChatForSydle(data);
            };
            page_number++;
        } else if (data === null) {
            console.error(`Erro ao buscar página: ${page_number}. Tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
            hasMorePages = false;
        }
    }
}

paginateThroughData();




// Função que faz a paginação dos perfis das pessoas cadastrada no Crisp:

// async function fetchPage(pageNum) {
//     let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `https://api.crisp.chat/v1/website/d0bee5f8-c285-4994-a88d-2b20eb7df5bf/people/profiles/${pageNum}`,
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Crisp-Tier': 'plugin',
//             'Authorization': authorization
//         }
//     };

//     try {
//         const response = await axios.request(config);
//         if (response.status === 206 && Array.isArray(response.data.data)) {
//             return response.data.data;
//         } else {
//             throw new Error(`Resposta inesperada da API: Status ${response.status}`);
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error(`Erro de resposta da API: Status ${error.response.status}`);
//         } else if (error.request) {
//             console.error('Erro de rede ou sem resposta:', error.request);
//         } else {
//             console.error('Erro na configuração da solicitação:', error.message);
//         }
//         return null;
//     }
// }

// // Função para buscar a quantidade de conversas associadas a um usuário pelo seu ID Crisp

// async function fetchProfile(peopleId) {
//     let config = {
//         method: 'get',
//         maxBodyLength: Infinity,
//         url: `https://api.crisp.chat/v1/website/d0bee5f8-c285-4994-a88d-2b20eb7df5bf/people/conversations/${peopleId}/list`,
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Crisp-Tier': 'plugin',
//             'Authorization': authorization
//         }
//     };

//     try {
//         const response = await axios.request(config);
//         if (response.status === 200) {
//             return response.data;
//         } else {
//             throw new Error(`Resposta inesperada da API: Status ${response.status}`)
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error('Erro de rede ou sem resposta:', error.request);
//         } else {
//             console.error('Erro na configuração da solicitação:', error.message);
//         }
//         return null;

//     }
// }

// // Função para buscar as conversas realizadas por usuário pelo ID de sessão

// async function fetchConversation(sessionId) {
//     let config = {
//         method: 'get',
//         url: `https://api.crisp.chat/v1/website/d0bee5f8-c285-4994-a88d-2b20eb7df5bf/conversation/${sessionId}/messages`,
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Crisp-Tier': 'plugin',
//             'Authorization': authorization
//         }
//     };

//     try {
//         const response = await axios.request(config);
//         if (response.status === 200) {

//             return response.data;
//         } else {
//             return null
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error('Erro de rede ou sem resposta 2:', error.request);
//         } else {
//             console.error('Erro ao buscar conversa:', error.message);
//         }

//         return null;
//     }
// }
// Função que percorre as páginas trazendo os conteudos

/*
   

*/
