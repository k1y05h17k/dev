
let horarioServidorUTC = '2023-03-10T15:45:00Z';
let horarioServidor = new Date();

async function getSaudacao(horario){
    let hora = horario.getHours();
    console.log(hora)
    console.log(14 === hora);
    let message = ` Dr. , tudo bem? Me chamo  do time de consultores premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de . Estou à sua disposição, como posso ajudar você?`;
    if(hora  < 12){
      return `Boa dia ${message}`;
    }else if(hora >= 12 && hora < 18){
      return `Boa Tarde ${message}`;
    }else if(hora > 18 && hora < 22){
      return `Boa Noite ${message}`;
    }else{
      let messageGoodNight = `Olá, Dr. ! Tudo bem? 
 
      No momento, nosso time de consultores premium dos cursos de Educação Médica Continuada da inspirali/IBCMED está fora do horário de atendimento. Mas retornaremos assim que possível 😉
       
      Recebemos seu interesse no nosso curso de Pós-graduação em . Como podemos ajudar você? `
      return messageGoodNight;
    }


}
let saudacao = getSaudacao(horarioServidor);
console.log(horarioServidor)
console.log(saudacao);


// let message = ` Dr. ${packageBitrix.nameContact}, tudo bem? Me chamo ${packageBitrix.nameDealer}, do time de consultores premium dos cursos de Educação Médica continuada da inspirali/IBCMED. Vi que você se interessou pelo nosso curso de ${packageBitrix.productName}. Estou à sua disposição, como posso ajudar você?`;