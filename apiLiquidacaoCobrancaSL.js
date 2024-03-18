//App token: c755b4f5-f290-4a2e-bae3-e32d566322ab

//Secret: cb24ac0e-c37c-48d4-85ad-05161e6dfcb0

//Access token: cbab0674-71c9-4efc-b862-4334ed8ec3e9 (válido apenas para esta licença: cmbedu)

const header = {
  contentType: "application/x-www-form-urlencoded",
  app_token: "c755b4f5-f290-4a2e-bae3-e32d566322ab",
  access_token: "cbab0674-71c9-4efc-b862-4334ed8ec3e9",
};

const parametros = {
  fl_status_recb: 2,
  fl_movivocancelar_recb: 2,
};

const boleto = {
  id: "",
  liquidado: "",
  cancelado: "",
  dataLiquidado: "",
  dataCancelado: "",
};

async function fetchData() {
  const url = "https://api.superlogica.net/v2/financeiro/cobranca";

  // const params = new URLSearchParams({
  //   id: boleto.id_recebimento_recb,
  //   exibirComposicaoDosBoletos: 1
  //   });
  const idsToFetch = ["112418", "112419", "112420","112421","112422","112423","112424","112425","112426","112427","112428","112429"]; // Example IDs to fetch

  for (const id of idsToFetch) {
    const params = new URLSearchParams({
      id: id,
      exibirComposicaoDosBoletos: 1,
    });

    const requestOptions = {
      method: "GET",
      headers: {
        app_token: header.app_token,
        access_token: header.access_token,
        "Content-Type": header.contentType,
      },
      redirect: "follow",
    };

    try {
      const response = await fetch(`${url}?${params}`, requestOptions);

      if (response.ok) {
        const result = await response.json();
        console.log(`Data for ID ${id}:`, result[0].dt_liquidacao_recb);

        if (result[0].dt_liquidacao_recb !== "") {
          boleto.id = id;
          boleto.liquidado = true;
          boleto.dataLiquidado = result[0].dt_liquidacao_recb;
          console.log(boleto);
        } else if (result[0].dt_liquidacao_recb == "") {
          boleto.id = id;
          boleto.liquidado = false;
          boleto.dataLiquidado = "";
          console.log(boleto);
        }

        if (result[0].dt_cancelamento_recb !== "") {
          boleto.id = id;
          boleto.cancelado = true;
          boleto.dataCancelado = result[0].dt_cancelamento_recb;
          console.log(boleto);
        } else if (result[0].dt_cancelamento_recb == "") {
          boleto.id = id;
          boleto.cancelado = false;
          boleto.dataCancelado = "";
          console.log(boleto);
        }
      } else {
        console.error(`Error for ID ${id}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error for ID ${id}:`, error);
    }
  }

  if(boleto.cancelado == false && boleto.liquidado == false){
  const params1 = new URLSearchParams({
    id: id,
    exibirComposicaoDosBoletos: 1,
    fl_status_recb: parametros.fl_status_recb,
    fl_movivocancelar_recb: parametros.fl_movivocancelar_recb
  });

  
  const requestOptions1 = {
    method: "PUT",
    headers: {
      app_token: header.app_token,
      access_token: header.access_token,
      "Content-Type": header.contentType,
    },
    redirect: "follow",
  };

  try {
    const response = await fetch(`${url}?${params1}`, requestOptions1);

    if (response.ok) {
      const result = await response.json();
      console.log(`Data for ID ${id}:`, result);

    } else {
      console.error(`Error for ID ${id}:`, response.statusText);
    }
  } catch (error) {
    console.error(`Error for ID ${id}:`, error);
  }

  } 

}

//   if (response.ok) {
//     const result = await response.json();
//     console.log(result[0].dt_liquidacao_recb);
//     console.log(result[0].dt_cancelamento_recb);
//     if(result[0].dt_liquidacao_recb != ""){
//         console.log("Já esta liquidado")

//     }else{
//         console.log("não existe")
//     }

//     if(result[0].dt_cancelamento_recb != ""){
//         console.log("Já existe")
//     }else{
//         console.log("Não Foi cancelado")
//     }
//   } else {

//     console.error('Error:', response.statusText);
//   }
// } catch (error) {
//   console.error('Error:', error);
// }

// Call the asynchronous function
fetchData();
