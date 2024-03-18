const express = require("express");
const axios = require("axios");
const app = express();
const https = require("https");
const fs = require("fs");


const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/integrador.umbler.ibcmed.net/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/integrador.umbler.ibcmed.net/fullchain.pem"
  ),
};

const server = https.createServer(options, app);
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
  console.log(`Servidor HTTPS rodando na porta ${PORT}`);
});

// Middleware para analisar o corpo JSON das solicitações POST
app.use(express.urlencoded({ extended: true }));

const baseURL = "https://ibcmed.bitrix24.com.br/rest/7/oz8k0efbs4j219dx";

function handleError(error) {
  if (error.response) {
    console.error(`Erro de resposta da API: Status ${error.response.status}`);
  } else if (error.request) {
    console.error("Erro de rede ou sem resposta:", error.request);
  } else {
    console.error("Erro na configuração da solicitação", error.message);
    console.error("Detalhes do Erro:", JSON.stringify(response.data, null, 2));
  }
}

app.use((req, res, next) => {
  console.log("Cabeçalhos:", req.headers);
  console.log("Corpo:", req.body);
  next(); // Não esqueça de chamar next() para continuar o processamento
});

app.post("/deal", async (req, res) => {
  // console.log(req.body.document_id[2]);
  try {
    const jsonBody = req.body;
    if (!jsonBody) {
      return res.status(400).send({ sucess: false, error: "Required ID" });
    } else {
      let dealString = jsonBody.document_id[2];
      let dealNum = dealString.replace(/\D/g, "");
      let dealId = dealNum;
      console.log(dealId);
      const dealData = await getDealBitrix(dealId);
      if (dealData && dealData.result) {
        const { ASSIGNED_BY_ID: idDealer, CONTACT_ID: idContact } =
          dealData.result;
        const deal = { idDealer, idContact };

        const contactResponse = await getContactBitrix(idContact);

        if (contactResponse && contactResponse.result) {
          const contact = {
            phone: contactResponse.result.PHONE[0].VALUE,
            name:
              contactResponse.result.NAME +
              "" +
              contactResponse.result.LAST_NAME,
          };

          const dealerResponse = await getDealerBitrix(idDealer);

          if (dealerResponse && dealerResponse.result) {
            const dealer = {
              name:
                dealerResponse.result[0].NAME +
                " " +
                dealerResponse.result[0].LAST_NAME,
              phone: dealerResponse.result[0].UF_USR_1707231401080,
            };

            const productDealResponse = await getProductDealBitrix(dealId);

            if (productDealResponse && productDealResponse.result) {
              const productInRow = {
                id: productDealResponse.result[0].PRODUCT_ID,
                product: productDealResponse.result[0].PRODUCT_NAME,
              };

              const packageBitrix = {
                id: dealId,
                phoneContact: contact.phone,
                phoneDealer: dealer.phone,
                productID: productInRow.id,
                productName: productInRow.product,
                nameContact: contact.name,
                idDealer: idDealer,
                nameDealer: dealer.name,
              };
              // let message = "test"
              // let data = { ...packageBitrix, message };
              // postMessage(data);

              
              // let horarioServidor = new Date();
              // await getSaudacao(horarioServidor,packageBitrix);
              // async function getSaudacao(horario,packageBitrix) {
              //   let hora = horario.getHours();
              //   let message = ` Dr. ${packageBitrix.nameContact}, tudo bem? Me chamo ${packageBitrix.nameDealer}, do time de consultores premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de ${packageBitrix.productName}. Estou à sua disposição, como posso ajudar você?`;
              //   if (hora < 12) {
              //     let message = `Boa dia ${message}`;

              //   } else if (hora >= 12 && hora < 18) {
              //     let message = `Boa Tarde ${message}`;
                
              //   } else if (hora >= 18 && hora < 22) {
              //     let message = `Boa Noite ${message}`;
                 
              //   } else {
              //     let message = `Olá, Dr. ${packageBitrix.nameContact}! Tudo bem?  No momento, nosso time de consultores premium dos cursos de Educação Médica Continuada da inspirali/IBCMED está fora do horário de atendimento. Mas retornaremos assim que possível 😉 Recebemos seu interesse no nosso curso de Pós-graduação em ${packageBitrix.productName}. Como podemos ajudar você? `
                 
              //   }
              //      let data = { ...packageBitrix, message };
              //     postMessage(data);

              // }


              // Verifica se o produto é Dermatologia e o vendedor é a Tamires
              
              if(packageBitrix.idDealer){
                let horarioServidor = new Date();
                let hora = horarioServidor.getHours();
                let textDefault = ` Dr. ${packageBitrix.nameContact}, tudo bem? Me chamo ${packageBitrix.nameDealer}, do time de consultores premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de ${packageBitrix.productName}. Estou à sua disposição, como posso ajudar você?`;
                if(hora < 12){
                    let message = `Bom dia ${textDefault}`;
                    let data = { ...packageBitrix, message };
                    postMessage(data);
                }else if(hora >= 12 && hora < 18){
                    let message = `Boa tarde ${textDefault}`;
                    let data = { ...packageBitrix, message };
                    postMessage(data);
                }else if(hora >= 18 && hora < 22){
                    let message = `Boa tarde ${textDefault}`;
                    let data = { ...packageBitrix, message };
                    postMessage(data);
                }else{
                     let message = `Olá, Dr. ${packageBitrix.nameContact}! Tudo bem?  No momento, nosso time de consultores premium dos cursos de Educação Médica Continuada da inspirali/IBCMED está fora do horário de atendimento. Mas retornaremos assim que possível 😉 Recebemos seu interesse no nosso curso de Pós-graduação em ${packageBitrix.productName}. Como podemos ajudar você? `
                     let data = { ...packageBitrix, message };
                    postMessage(data);
                }
                
                console.log(postMessage);

              }
              res.send({ success: true, data: { packageBitrix } });
            }
          }
        } else {
          res
            .status(404)
            .send({ success: false, error: "Contato não encontrado" });
        }
      } else {
        res.status(404).send({ success: false, error: "Deal não encontrado" });
      }
    }
  } catch (error) {
    handleError(error, res);
  }
});

async function getDealBitrix(idDeal) {
  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/crm.deal.get?ID=${idDeal}`,
      headers: { "Content-Type": "application/json" },
      data: null,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

async function getContactBitrix(idContact) {
  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/crm.contact.get?id=${idContact}`,
      headers: { "Content-Type": "application/json" },
      data: null,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

async function getProductDealBitrix(idDeal) {
  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/crm.deal.productrows.get?id=${idDeal}`,
      headers: { "Content-Type": "application/jsom" },
      data: null,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

async function getDealerBitrix(idDealer) {
  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/user.get?ID=${idDealer}`,
      headers: { "Content-Type": "application/json" },
      data: null,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

async function postMessage(chat) {
  let token =
    "token-api-bot-bitrix-2024-02-06-2092-02-24--1DFA4B0041B307DFA036411194FC5B747E5413E91956A50C244354B9487F2777";

  let data = {
    toPhone: chat.phoneContact,
    fromPhone: chat.phoneDealer,
    organizationId: "ZFgwAbUKVRgnIErZ",
    message: chat.message,
    file: null,
    skipReassign: false,
    contactName: chat.nameContact,
  };

  try {
    const response = await axios({
      method: "post",
      maxBodyLength: Infinity,
      url: `https://app-utalk.umbler.com/api/v1/messages/simplified/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}