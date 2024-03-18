//email e Senha Reset de requisição do Crisp:: raul@ibcmed.com / RV6aifnuNYKev@

const axios = require("axios");

// Token de autorização para efetuar as requisições no Crisp

const authorizationHeader = {
  "Content-Type": "application/json",
  "X-Crisp-Tier": "plugin",
  Authorization:
    "Basic OGZhNmVkZTUtNDI0Yi00MWQ4LTliZGMtZmYxZGU2N2E3Y2RiOjA3YWU3YTczODU4ZjU0ZjM5YjAyYzEyYWE0NGZlYTc0MTcxNjYxMmRkMTk5ZmI0NzQyMGM1NDk5N2E4N2MyYTQ=",
};

// Token de autorização para efetuar as requisições na Sydle

const token =
  "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..h7BCJvhS46PYf73rW-zAYA.vwW-T3DTsKyypXngQEZFHhAF75sUplaYhGCMVP3slLD4plNBL13MqrEBR38NC4hgG2Q_536oU1vWW958ibBGHmYHQl_tGffGORyF1vKbClJvD3z7zc0Y-yO_J9XEWllxMPHHPaydWoydqfNlNZZ-n0Jf8zgwUH00vPSy1Ne5b95fp3BsZDaKmU1D5n_ztMV0LB2JRuRWO4q8PGYu3rhC18EmMtVna6_wFDYN7YBHjIKvZirmIkJYjEwSj1X_YIK_aVOklc_OxIJcRrv2rpdaza5jCQd4nszRWQXkLI3jdJg0vKLVFxq5xzWG3nZZYgW8Fb1jchLhyxcNtpE75x4TMTfWTMj4pJZMEShrzzqGHthk5su60BNyESdGnBZpPInTaO0zuhdDDGM-WY6ZloqQ7PKXjKLkaJByssdrKeSxHnWlsMyqjD5PeZasXCbUbe5BvC2UfHVcm5GCEtfxiyXmYguFo9HaDA4ty57I42OWTOUSRBcAYEVkhe8SCKDY9_H46vR-Iqu7gMF45tK82sG0Bkh6k4uCMKKT5QBbd_GpzTHwWJdcal3wvXl41y81pC9YFbNl2Fgsn1819ZIxGs3hj-0xomS2sKMhnfAP7DVusbM_xvljmG4mgfdNcnbjygJJ.1lRE2081yplqEmTYEns_PQ";
const baseURL =
  "https://api.crisp.chat/v1/website/d0bee5f8-c285-4994-a88d-2b20eb7df5bf";
let page_number = 349;
let hasMorePages = true;


// Função que cria
async function makeRequest(url, method = "get", data = null) {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: authorizationHeader,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// Função que captura os erros gerados caso de alguma inconsistencia nas requisições

function handleError(error) {
  if (error.response) {
    console.error(`Erro de resposta da API: Status ${error.response.status}`);

  } else if (error.request) {
    console.error("Erro de rede ou sem resposta:", error.request);

  } else {
    console.error("Erro na configuração da solicitação", error.message);

  }
}

// Função que pesquisa por página os usuários com conversas existentes, trazendo os dados de pessoas, conversas

async function fetchPage(pageNum) {
  const url = `${baseURL}/people/profiles/${pageNum}`;
  const data = await makeRequest(url);
  return data ? data.data : null;
}

async function fetchProfile(peopleId) {
  const url = `${baseURL}/people/conversations/${peopleId}/list`;
  return await makeRequest(url);
}

async function fetchConversation(sessionId) {
  const url = `${baseURL}/conversation/${sessionId}/messages`;
  return await makeRequest(url);
}

async function paginateThroughData() {
  while (hasMorePages) {
    const data = await fetchPage(page_number);
    if (data && data.length > 0) {
      for (const item of data) {
        let data = {
          email: item.email,
          people_id: item.people_id,
          phone: item.person.phone,
          nickname: item.person.nickname,
          notepad: item.segments,
        };

        if (item.people_id) {
          const profileData = await fetchProfile(data.people_id);

          if (profileData && profileData.data && profileData.data.length > 0) {
            for (profile of profileData.data) {
              const chatData = await fetchConversation(profile);

              if (chatData && chatData.data && chatData.data.length > 0) {
                data = {
                  ...data,
                  conversation: profile,
                  chat: chatData.data.map((item) => {
                    let content = item.content;
                    if (typeof content === "object") {
                      content = JSON.stringify(content);
                    }

                    let user = item.user;
                    if (typeof user === "object") {
                      user = JSON.stringify(user);
                    }

                    return {
                      session_id: item.session_id,
                      type: item.type,
                      from: item.from,
                      origin: item.origin,
                      content: content,
                      user: user,
                      delivered: item.delivered,
                      timestamp: new Date(item.timestamp),
                    };
                  }),
                };
              } else {
                console.log("Nenhuma Conversa Encontrada", data);
              }
            }
          } else {
            console.log("Nenhum perfil foi Encontrato", item.people_id);
            continue;
          }
        }
        data = {
          ...data,
          chatHTML: formatWhatsAppChat(data),
        };
        console.log("Page number: ", page_number, "Dados: ", data);

        // Função de envio das conversas de chat para sydle
        sendChatForSydle(data);
      }
      page_number++;
    } else if (data === null) {
      console.error(
        `Erro ao buscar página: ${page_number}. Tentando novamente...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } else {
      hasMorePages = false;
    }
  }
}
paginateThroughData();

function validateChatData(data) {
  if (!data || typeof data !== "object") {
    console.error("Dados Inválidos: o objeto está nulo");
    return false;
  }
  return true;
}

async function sendChatForSydle(data) {
  if (!validateChatData(data)) return null;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://ibcmed-dev.sydle.one/api/1/migracao/com.ibcmed.integracoes/MigracaoDeDadosCrisp/createChat`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: { data },
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      return console.log(response.data);
    } else {
      return null;
    }
  } catch (error) {
    handleError(error);
  }
}

// Formata os dados como uma conversa de Chat whatsapp.

function formatWhatsAppChat(data) {
  let formattedChat = "";

  if (!data || !Array.isArray(data.chat)) {

    console.error('Dados inválidos para formatWhatsAppChat');
    return '';
  }

  data.chat.forEach((message) => {
    let timestamp = new Date(message.timestamp);
    let formattedTimestamp = timestamp.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let nameToShow = "Desconhecido";
    if (typeof message.user === "string") {
      try {
        const userObj = JSON.parse(message.user);
        if (userObj && userObj.nickname) {
          nameToShow = userObj.nickname;
        }
      } catch (e) {
        console.error("Falha ao analisar o JSON do usuário:", e);
      }
    }
    let alignment = "left";
    let containerAlignment = "flex-start";
    if (message.type === "note") {
      alignment = "left";
      containerAlignment = "center";
    } else if (message.from === "user") {
      alignment = "left";
      containerAlignment = "flex-start";
    } else if (message.from === "operator") {
      alignment = "left";
      containerAlignment = "flex-end";
    }

    let content = message.content;

    let type = message.type;


    if (
      typeof content === "string" && (content.startsWith("{") || content.startsWith("["))
    ) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error("Falha ao analisar o JSON do conteúdo:", e);
      }
    }

    if (typeof content === "object" && content !== null) {
      if (content.namespace === "state:resolved") {
        content = "<em>A conversa foi resolvida.</em>";
      } else if (content.type === "image/png" || content.type === "image/jpeg") {
        content = content.url;
      } else if (content.type === "audio/ogg") {
        content = content.url;
      }
    } else if (typeof content === "string") {
      content = content.toString().replace(/\n/g, "<br>");
    }

    let messageStyle = `display: inline-block; background-color: #f7f7f7; border-radius: 8px; padding: 10px; margin: 5px; text-align: ${alignment};`;
    let containerStyle = `display: flex; justify-content: ${containerAlignment};`;
    let header = `<strong>[${formattedTimestamp}] ${nameToShow}:</strong>`;

    formattedChat += `<div style="${containerStyle}"><div style="${messageStyle}">${header}<br>${content}</div></div>`;
  });

  return formattedChat;
}