<?PHP
$json = file_get_contents('php://input');
$resultado = json_decode($json, true);

//Funções BITRIX

include_once "../../../private_html/bitrixOffLine/interacoes-com-bitrix.php";
include_once "../../../private_html/bitrixOffLine/funcoes-secundarias.php";

//===============================================================================================================================

//Função para gravar os dados do negocio no txt

function gravaTXT($objeto){
  $name = '03-cria-negocio-form-ninja-medpos.txt';
  $file = fopen($name, 'a');
  fwrite($file, print_r($objeto, true));
  fclose($file);
}


gravaTXT($resultado);
gravaTXT("\n\n");
die();

//===================================================************************************************************************************************


$nome = $resultado["nome"];
$email = $resultado["email"];
$telefone = $resultado["telefone"];
$observacoes = $resultado["observacoes"];
$url = $resultado["url"];
$campanha = $resultado["campanha"];
$term = $resultado["term"];
$source = $resultado["source"];
$medium = $resultado["medium"];
$content = $resultado["content"];
$ip = $resultado["ip"];
$pipe = $resultado["pipe"];
$coluna_pipe = $resultado["coluna_pipe"];
$qual_formacao = $resultado["qual_formacao"]; // informação deve ser salva dentro do contato (retorna o código da lista)
$crm = $resultado["crm"];
$quant_tempo_emedico = $resultado["quanto_tempo_emedico"];
$source_id = $resultado["source_id"];
$sou_medico = $resultado["sou_medico"];
$produto_oculto = $resultado["produto_oculto"];
// Se nao tiver preenchido no formulario a fonte ($source_id) define por padrao o WEBFORM
if($source_id == "" ){
	$source_id = "WEBFORM";
}

//===================================================*************************************************************************************************




//$valendo_sourceURL = "https://ibcmed.com/cursos/pos/pediatria-511/?utm_source=facebook&utm_medium=ads&utm_campaign=pediaexp&utm_id=pediatria&utm_term=agosto21&fbclid=IwAR1hDnIuovUfiSGTJhcQTI7patko4L0R7Ri7md6X3WEMNIyZJrC5Yd";


//Função para pegar a partir daqui: /cursos/pos/pediatria-511/

$path = array(parse_url($url));

//$id_produto = preg_replace('/[^0-9]/', '', $path[0][path]);

//--------------------------------------------------------------------------------------------------------------------

// Adicionando os valores as variaveis

$nome = preg_replace('/\s+/', " ",$nome); // retira mais de 1 espaço entre o nome
$nome = ucwords(strtolower($nome)); // Formata Nome completo com a primeira letra maiuscula
$array_nome = explode(" ",$nome); // Separa o primeiro nome e o sobrenome
$primeiro_nome = $array_nome[0];
unset($array_nome[0]);
$sobrenome = implode(" ", $array_nome);

// Pego o final da URL para identificar a página de obrigado de destino
//$nome_cursoEid_inicio = explode("/",$path[0][path]);

gravaTXT("Explode da URL identificar onde ta o ID");
gravaTXT($nome_cursoEid_inicio);
gravaTXT("\n\n");

$nome_cursoEid = $nome_cursoEid_inicio[3];




// // ------------------------------------------------------------------------------------------------------

// // Busca informações do produto no Bitrix (Retorna Array com informações do produto)

// $info_produto_bitrix = busca_produto_bitrix_comID($id_produto);
// $nome_produto = $info_produto_bitrix["result"]["NAME"];
// $valor_produto = $info_produto_bitrix["result"]["PRICE"];
// $tipo_produto_ead_ou_pos = $info_produto_bitrix["result"]["SECTION_ID"];




// $infosDeal = array(
// 	"FIELDS[TITLE]" => "Oportunidade - $primeiro_nome ($nome_produto) / $source",
// 	"FIELDS[STAGE_ID]" => $coluna_pipe,	// FASE DEFINIDA DA PIPE
// 	"FIELDS[CATEGORY_ID]" => $pipe, 	// CATEGORIA DA PIPE
// 	"FIELDS[TYPE_ID]" => "SALE",
// 	"FIELDS[OPENED]" => "Y",
// 	"FIELDS[CREATED_BY_ID]" => "7",
// 	"FIELDS[ASSIGNED_BY_ID]" => "185", // gerson
// 	"FIELDS[SOURCE_ID]" => $source_id,
// 	"FIELDS[UTM_SOURCE]" => "$source",
// 	"FIELDS[UTM_MEDIUM]" => "$medium",
// 	"FIELDS[UTM_CAMPAIGN]" => "$campanha",
// 	"FIELDS[UTM_TERM]" => "$term",
// 	"FIELDS[UTM_CONTENT]" => "$content",
// 	"FIELDS[COMMENTS]" => $observacoes.$quant_tempo_emedico,
// 	"FIELDS[UF_CRM_1625230139]" => $url, // Cadastro da URL
// 	"FIELDS[UF_CRM_1637240555]" => $nome_produto,
// 	"FIELDS[UF_CRM_5D1BBD0B445E4]" => $sou_medico,
// );


// $retorno_criacao_negocio = cria_negocio_bitrix($infosDeal);
// $idNegocioCriado = $retorno_criacao_negocio["result"];

// // Se o retorno do bitrix for ID vazio quer dizer que não criou o card negocio
// if (is_null($idNegocioCriado)){
// 	gravaTXT($resultado);
// }

// // ------------------------------------------------------------------------------------------------------


// // adiciona um produto ao card LEAD criado se o produto existir
// $info_prod_para_adicionar = array(
//      "ROWS[0][PRICE]" => $valor_produto,     // valor do produto
//      "ID" => $idNegocioCriado,                // id do lead criado
//      "ROWS[0][PRODUCT_ID]" => $id_produto,    //id do produto
// );
// $retorno_produto_adicionado = adiciona_produto_ao_deal($info_prod_para_adicionar);









// // -----------------------------------------------------********************************************************************************************************************









// // 	Verifico se existe contato com mesmo email DUPLICIDADE

// $retorno_contato = pesquisa_se_existe_contato_bitrix($email);

// // Se existir um contato com este email entra aqui
// if($retorno_contato){
// // 		SE EXISTIR MAIS DE UM CONTATO COM O MESMO EMAIL NÃO DEVE SER FEITO NADA APENAS AVISAR PARA ALGUEM UNIFICAR OS CONTATOS
// 	if( $retorno_contato["total"] > 1 ){
// 		$mensagem = "Contato com email DUPLICADO detectado https://ibcmed.bitrix24.com.br/crm/contact/dedupe/ <br>segue link do card https://ibcmed.bitrix24.com.br/crm/lead/details/$idNegocioCriado/";
// 		$assunto = "API 03 cria negocio - Contato duplicado detectado no BITRIX";
// 		$destino = "darlan@ibcmed.com";
// 		enviaEmail($mensagem, $assunto, $destino);

		
// // 		Aqui deve ser feito uma verificação de propriedade do contato duplicado. Caso sejam de vendedores diferentes não deve ser adicionado um proprietário
		
// 	}
	
	
// // 	Atualizo contato com novo telefone, e-mail e área de formação informados pelo formulário preenchido
// // 	Verifico se o campo qual formação do formulário está vazio, se tiver alguma coisa atualizo a frmação do cliente
// 	if (!empty($qual_formacao)){
// 		$array_atualizacao_contato = array(
// 			"ID" => $retorno_contato["result"]["0"]["ID"], // id do contato existente
// 			"FIELDS[UF_CRM_5D00F93069FC7]" => $qual_formacao, // Cadastro da URL
// 			"FIELDS[UF_CRM_5CE2CB03D5105]" => $crm,
// 		);
// 		$retorno_atualizacao_contato = atualiza_info_contato_bitrix($array_atualizacao_contato);
// 	}
// // Verifico se o Campo do formulário está vazio se não estiver eu qtualizo o crm do contato
// 	if (!empty($crm)){
// 		$array_atualizacao_contato = array(
// 			"ID" => $retorno_contato["result"]["0"]["ID"], // id do contato existente
// 			"FIELDS[UF_CRM_5CE2CB03D5105]" => $crm,
// 		);
// 		$retorno_atualizacao_contato = atualiza_info_contato_bitrix($array_atualizacao_contato);
// 	}

	
	
	
// // 		Se encontrou associo o primeiro CONTATO encontrado ao LEAD
// 	$array_com_ID_do_contato = array(
// 		"ID" => $idNegocioCriado, // id do negocio criado
// 		"FIELDS[CONTACT_ID]" => $retorno_contato["result"]["0"]["ID"], // ID do contato encontrado
// 		"FIELDS[UF_CRM_1625230139]" => $url, // Cadastro da URL
// 	);
// 	$retorno_associacao_contato_aoLead = atualiza_info_negocio_bitrix($array_com_ID_do_contato);
	
// }else{
// // Se não existir um contato verifica se o telefone existe em algum contato
	
// // 	gravaTXT($valendo_telefone);
// // 	gravaTXT("\n\n");
// 	$user_tel = pesquisa_se_existe_contato_bitrix_telefone($telefone);
// // 	gravaTXT($user_tel);
	
// 	// Verifico se o telefone informado já existe na base dos contatos
// 	if($user_tel){
// // 		Se encontrou algum telefone associa o contato com o mesmo numero
// 		$array_com_ID_do_contato_tel = array(
// 			"ID" => $idNegocioCriado, // id do negocio criado
// 			"FIELDS[CONTACT_ID]" => $user_tel["result"][0]["ID"], // ID do contato encontrado
// 			"FIELDS[EMAIL][1][VALUE_TYPE]" => "WORK",
// 			"FIELDS[EMAIL][1][VALUE]" => $email,
// 			"FIELDS[UF_CRM_1625230139]" => $url, // Cadastro da URL
// 		);
// 		$retorno_associacao_contato_aoLead = atualiza_info_negocio_bitrix($array_com_ID_do_contato_tel);
		
// 	}else{
// // 		Se não encontrou crio o CONTATO
// 		$array_com_info_paraCriar_contato = array(
// 			"FIELDS[NAME]" => $primeiro_nome,
// 			"FIELDS[LAST_NAME]" => $sobrenome,
// 			"FIELDS[OPENED]" => "Y",
// 			"FIELDS[ASSIGNED_BY_ID]" => "7",  //ID do administrador
// 			"FIELDS[TYPE_ID]" => "CLIENT",
// 			"FIELDS[SOURCE_ID]" => $source_id,
// 			"FIELDS[EMAIL][0][VALUE_TYPE]" => "WORK",
// 			"FIELDS[EMAIL][0][VALUE]" => $email,
// 			"FIELDS[PHONE][0][VALUE_TYPE]" => "WORK",
// 			"FIELDS[PHONE][0][VALUE]" => $telefone,
// 			"FIELDS[REGISTER_SONET_EVENT]" => "Y",	//registra o evento de criação do contato
// 			"FIELDS[UF_CRM_5D00F93069FC7]" => $qual_formacao,
// 			"FIELDS[UF_CRM_5CE2CB03D5105]" => $crm,
// 		);
// 		$info_doContato_criado = cria_contato_bitrix($array_com_info_paraCriar_contato);
// 		$id_doContato_criado = $info_doContato_criado["result"];
// // 		gravaTXT("\n\n\nDados Contato Criado\n");
// // 		gravaTXT($info_doContato_criado);
// // 		Associo o contato criado ao negocio
// 		$array_com_ID_do_contato2 = array(
// 			"ID" => $idNegocioCriado, // id do lead criado
// 			"FIELDS[CONTACT_ID]" => $id_doContato_criado, // ID do contato encontrado
// 			"FIELDS[UF_CRM_1625230139]" => $url, // Cadastro da URL
// 		);
// 		$retorno_associacao_contato_aoLead2 = atualiza_info_negocio_bitrix($array_com_ID_do_contato2);
// 	}
// }


// die();
 
// ?>