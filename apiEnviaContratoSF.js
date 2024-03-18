const header = {
  //Authorization: "Bearer ",
  connection: "keep-alive",
  contentType: "application/json"
};
const body = {
  contrato:"1231231231",
  chave:"eqweqweqweqweqwe"
};

const target = "https://pluga.webserv.in/webhook-test/db04e8bf-a365-49f1-9a8b-fe56dee29a47";

const webTarget = _utils.connector.web(target, body.contentType, header);

let response = null;

try {
  response = webTarget.post(body);
  _output = response;
} catch (err) {
  response = JSON.parse(parse);
}
return response;
