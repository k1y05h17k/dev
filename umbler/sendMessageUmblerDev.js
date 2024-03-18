const axios = require('axios');
const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

//Carrega os certificados SSL Instalados no servidor para  usar no HTTPS

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/integrador.umbler.ibcmed.net/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/integrador.umbler.ibcmed.net/fullchain.pem')
// };

// //Inicia um Servidor HTTPS usando os certificados especificados e a insancia do Express
// const server = https.createServer(options, app);
// const PORT = process.env.PORT || 443;
// server.listen(PORT, () => { console.log(`Servidor HTTPS rodando na porta ${PORT}`); });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


const baseURL = "https://ibcmed.bitrix24.com.br/rest/7/oz8k0efbs4j219dx";

// Token UMBLER



function handleError(error) {
  if (error.response) {
    console.error(`Erro de resposta da API: Status ${error.response.status}`);

  } else if (error.request) {
    console.error("Erro de rede ou sem resposta:", error.request);

  } else {
    console.error("Erro na configuração da solicitação", error.message);

  }
}

app.get('/deal', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send({ success: false, error: 'ID é obrigatório' });
    }

    const data = await getDealBitrix(id);
    if (data && data.result) {
      const { ASSIGNED_BY_ID: idDealer, CONTACT_ID: idContato } = data.result;
      const deal = { idDealer, idContato };

      const contactResponse = await getContactBitrix(idContato);

      if (contactResponse && contactResponse.result) {
        const contact = {
          phone: contactResponse.result.PHONE[0].VALUE,
          name: contactResponse.result.NAME +" "+ contactResponse.result.LAST_NAME,
        };

        const dealerResponse = await getDealerBitrix(idDealer);

        if (dealerResponse && dealerResponse.result) {
          const dealer = {
            name: dealerResponse.result[0].NAME +" "+ dealerResponse.result[0].LAST_NAME,
            phone: dealerResponse.result[0].UF_USR_1707231401080
          }

          const productDealResponse = await getProductDealBitrix(id);

          if (productDealResponse && productDealResponse.result) {
            const productInRow = {
              id: productDealResponse.result[0].PRODUCT_ID,
              product: productDealResponse.result[0].PRODUCT_NAME
            }

            const packageBitrix = {
              id: id,
              phoneContact: contact.phone,
              phoneDealer: dealer.phone,
              producName: productInRow.product,
              nameContact: contact.name,
              produtoID: productInRow.id,
              idDealer: idDealer

            }

            // Verifica se o produto é Dermatologia e o vendedor é a Tamires
            if ((productInRow.id === 457) && (idDealer === "4607")) {
              
              let message = `Olá Dr. ${packageBitrix.nameContact}, tudo bem? Me chamo Tamires, consultora premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de ${packageBitrix.producName}. Estou à sua disposição, como posso ajudar você?`;
              let data = {...packageBitrix, message }
              postMessage(data);

              // Verifica se o produto é Mediciona do Trabalho ou Perícia Médica 
            } else if ((productInRow.id === 533 || productInRow.id === 539) && (idDealer === "4703" || idDealer === "4709" || idDealer === "4665")) {

              let message = `Olá Dr. ${packageBitrix.nameContact}, tudo bem? Me chamo Tamires, consultora premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de ${packageBitrix.producName}. Estou à sua disposição, como posso ajudar você?`;
              let data = { message, ...packageBitrix }
              postMessage(data);

            }

            res.send({ success: true, data: { packageBitrix } });
          }
        }


      } else {
        res.status(404).send({ success: false, error: 'Contato não encontrado' });
      }
    } else {
      res.status(404).send({ success: false, error: 'Deal não encontrado' });
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
      data: null

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
      data: null
    })
    return response.data;
  } catch (error) {
    handleError(error);
    return null
  }
}

async function getProductDealBitrix(idDeal) {

  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/crm.deal.productrows.get?id=${idDeal}`,
      headers: { "Content-Type": "application/jsom" },
      data: null
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null
  }
}

async function getDealerBitrix(idDealer) {

  try {
    const response = await axios({
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseURL}/user.get?ID=${idDealer}`,
      headers: { "Content-Type": "application/json" },
      data: null
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return nullBEç
  }
}


async function postMessage(chat){

  let token = "token-api-bot-bitrix-2024-02-06-2092-02-24--1DFA4B0041B307DFA036411194FC5B747E5413E91956A50C244354B9487F2777";

  let data = {
  "toPhone":chat.phoneContact,
  "fromPhone":chat.phoneDealer,
  "organizationId":"ZFgwAbUKVRgnIErZ",
  "message": chat.message,
  "file": null,
  "skipReassign": false,
  "contactName":chat.nameContact
  }

  try{

    const response = await axios({
      method:"post",
      maxBodyLength: Infinity,
      url:`https://app-utalk.umbler.com/api/v1/messages/simplified/`,
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`,
      },
      data:data
    });
    return response.data;
  } catch (error){
    handleError(error);
    return null
  }
}


// async function postMessageChat(chat) {

//   let data = {
//     "toPhone": chat.phoneContact,
//     "fromPhone": chat.phoneDealer,
//     "botId": chat.idBot,
//     "triggerName": "Manual",
//     "organizationId": "ZFgwAbUKVRgnIErZ",
//     "contactName": chat.nameContact
//   }
  

//   try {

//     const response = await axios({
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `https://app-utalk.umbler.com/api/v1/chats/start-bot/`,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },

//       data: data
//     });
//     return response.data;
//   } catch (error) {
//     handleError(error);
//     return null
//   }
// }