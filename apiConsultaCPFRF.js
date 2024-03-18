// let urlRequest = "https://api.infosimples.com/api/v2/consultas/receita-federal/cpf";

// const paramsHeader = {
//     origem: "web",
//     cpf: "01825537011",
//     birthDate: "1990-03-17",
//     timeOut:"600",
//     token:"HiaWGZ8TkBBU6iixk_cEoZUl6Hf29tFp2r128Aq_"
// }

// async function searchCpf(paramsHeader){
// const params = new URLSearchParams({
// token: paramsHeader.token,
// cpf: paramsHeader.cpf,
// birthDate: paramsHeader.birthDate,
// timeout: paramsHeader.timeOut,
// origem: paramsHeader.origem
// });
// }


// const requestOptions = {
//     method: "GET",
//     headers: {
//       "Content-Type": header.contentType,
//     },
//     redirect: "follow",
//   };


//   cep ="https://api.infosimples.com/api/v2/consultas/correios/cep?token=[token]&timeout=[timeout]&cep=[cep]
  
//   "token=[token]"
//   "timeout=[timeout]""
//   cep=[cep]"


const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.infosimples.com/api/v2/consultas/receita-federal/cpf?token=HiaWGZ8TkBBU6iixk_cEoZUl6Hf29tFp2r128Aq_&timeout=600&cpf=01825537011&birthdate=1990-03-17&origem=web',
  headers: { }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
