let person = {
    name:"    Kiyoshi ",
    lastName:"          Takahama",
    password:"01825537011",
    userName:"01825537011"
}
console.log(person)

validateUser(person)

function validateUser(person){
    
    person.userName = person.userName.replace(/\D/g,''); // Remove todo caracter n numerico
    person.password = person.password.replace(/\D/g,''); // Remove todo caracter n numerico
    person.name = person.name.replace(/\s+/g, ''); //Remove espacos vazios da Variavel name
    person.lastName = person.lastName.replace(/\s+/g, ''); // Remove espacos vazios da variavel lastName

}





function createUserWP(person){
    let url = "https://ibcmedmais.com.br/wp-json/wp/v2/users";
    let contentType = "application/json";
    let authorization = ""

    var raw = JSON.stringify({
        "username":person.userName,
        "password":person.password,
        "name": person.name,
        "lastname": person.lastName
    });

    let webConnector = _utils.connector.web(url, contentType);

    try {
        let response = webConnector.post();
        if(response.code){
        
        }
    } catch(err){
        throw "Err"
    }


}

console.log(person)