<?PHP
// https://app.textografo.com/share/YXV0aDB8NWRhODY0YzAxMzZkMjMwZTJjNDQ0NDJhK2FieTcrZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SmxlSEFpT2pNeU5UQXpOamd3TURBd0xDSjJJam93TENKa0lqcDdJblZwWkNJNkltRjFkR2d3ZkRWa1lUZzJOR013TVRNMlpESXpNR1V5WXpRME5EUXlZU0lzSW1selUyaGhjbVZrSWpwMGNuVmxmU3dpYVdGMElqb3hOVGN4TkRVNE9EQXhmUS5SQlZJeXhuOWNPdHE3MGRlcFoybmhsWVpnTS05UDVWTVZjVnRfNjd0TmcwK2VkaXQ%3D

// Este processo será executado toda vez que um lead for qualificado para vendas (vai ser verificado se ja existe um negocio deste contato em andamento, se sim apenas avisa consultor. Se nao existir cria um negocio novo)
$hookRecebido = $_POST;

function gravaTXT138($objeto){
	$name = 'verifica-Propriedade-contato-RoundRobin-amarelo.txt';
	$file = fopen($name, 'a');
	fwrite($file, print_r($objeto, true));
	fclose($file);
}

// gravaTXT138($hookRecebido);
// gravaTXT138("\n");


if( empty($hookRecebido) ){
     header('Location: https://ibcmed.com');
	 gravaTXT138("\n------------\nTeve uma entrada sem parametros\n\n");
     die();
}


// Inclui funcoes
include_once "../../../private_html/bitrixOffLine/interacoes-com-bitrix.php";
include_once "../../../private_html/bitrixOffLine/funcoes-secundarias.php";


$idNegocio1 = $hookRecebido["document_id"]["2"];
// Retiroqualquer caractere que nao seja numero
$idNegocio = preg_replace('/[^\d]/', '',$idNegocio1);



sleep(4);

// busco informacoes do produto associado ao LEAD
$info_produto_deal = busca_produto_associado_negocio($idNegocio);
$nome_produto_interesse = $info_produto_deal["result"][0]["PRODUCT_NAME"];
$ID_produto = $info_produto_deal["result"][0]["PRODUCT_ID"];
$valor_produto = $info_produto_deal["result"][0]["PRICE"];

// retorna array se existir lead ou falso se nao existir
$retorno_infos_deal = busca_informacoes_negocio($idNegocio);
$id_contato_doAluno = $retorno_infos_deal["result"]["CONTACT_ID"];
$titulo = $retorno_infos_deal["result"]["TITLE"];
$responsavel_pelo_card = $retorno_infos_deal["result"]["ASSIGNED_BY_ID"];

// Busco informacoes do contato para saber seu proprietario
$retorno_infos_contato = busca_informacoes_contato($id_contato_doAluno);
$email = $retorno_infos_contato["result"]["EMAIL"][0]["VALUE"];
$numero = $retorno_infos_contato["result"]["PHONE"][0]["VALUE"];
$responsavel_pelo_Contato = $retorno_infos_contato["result"]["ASSIGNED_BY_ID"];



// Verifico se tem um produto associado ao card
if( empty($info_produto_deal) ){
// 	Atrinuo o card para o gerson
	$infoAtualizacaoNegocio = array(
		"ID" => $idNegocio, // id do Negocio
		"FIELDS[ASSIGNED_BY_ID]" => 185, // 185 = gerson
	);
	atualiza_info_negocio_bitrix($infoAtualizacaoNegocio);
	
	// gravaTXT138("\n------------\nSEM PRODUTO ADICIONADO AO CARD $idNegocio\n------------------------------------\n");

	$infoFormularioInscricao = array(
		"FIELDS[ENTITY_ID]" => $idNegocio,
		"FIELDS[ENTITY_TYPE]" => "deal",
		"FIELDS[COMMENTS]" => "ATENÇÃO: Negocio sem PRODUTO associado.",
	);
	$retorno_comentario_associado = adiciona_comentario_timeline_bitrix($infoFormularioInscricao);
	die();
}




// -------------------------*************************************-------------------------------------------


// 	busco informações do produto para pegar o array de vendedores habilitados a vender e realizar o round robin
$retorno_info_produto = busca_produto_bitrix_comID($ID_produto);
// 	pego o ultimo vendedor que recebeu um card
// 	aqui fica o ID do ultimo vendedor que recebeu um card deste produto
$ultimo_vendedor_queRecebeu_card = $retorno_info_produto["result"]["PROPERTY_122"]["value"]; 



// Grupo amarelo (PEDIATRIA, UTI PEDIATRICA E NEONATAL, NEONATOLOGIA, EMERGÊNCIA EM PEDIATRIA E NEONATAL, PEDIATRIA INTEGRATIVA E SAÚDE DA CRIANÇA, MEDICINA DO TRABALHO, NEUROPEDIATRIA,)

// $produtos_amarelos = array(523,511,513,495,775,509,525,535,705,983,861,427);

//Produtos atualizados para o Grupo Amarelo 19/02/2023
$produtos_amarelos = array(525,775,509,983,523,511,535,565,501,739,499,987,495,861,427);


//Produtos atualizados para o Grupo Azul 19/02/2023
$produtos_azuis = array(567,505,563,507,1135,727,531,527,541,643,521,503);


// MEDPOS (Dermatologia,Dermoestética,Cirurgia Regenerativa,Cirurgia Dermatologica,)
$produtos_medpos = array(883,967,971,911,1087);

$produtos_inspirali = array(1395,1431,1427,1423,1419,1451,1455,1459,1463,1467,1471,1499,1503,1507,1371,1375,1479,1383,1387,1391,1399,1407,1411,1415,1419,1423,1431,1435,1439,1443,1447,1291,1295,1299,1303,1307,1335,1339,1343,1347,1351,1355,1359,1363,1367,1211,1215,1223,1227,1231,1235,1239,1243,1247,1251,1251,1259,1263,1267,1271,1275,1279,1283,1287);

$produtos_inspirali_interno = array(1179,1183,1187,1191,1195,1199,915,1131);

$vendedores_amarelos = array(4803,243,237,241,4775,4777,4673,4365,4385);

$vendedores_azuis = array(4379,4385,4391,4537,4779,4781,4783);

// vendedor MEDPOS Dentro do IBCMED (Tamires, juliana correa, Rafael Emerim)
$vendedores_medpos = array(4607,4657,1761);


// Vendedores AMIB (JACK DENI, KEISY LOPES, FERNANDA)
$vendedores_amib = array(4703,4709,4665);

// Vendedores IBCMED Vendendo produtos Inspirali
$vendedores_inspirali_interno = array(4703,4709,4665);

// Vendedores Inspirali OnSite 
$vendedores_inspirali = array(4829,4827,4839,4835,4833,4831,4837);









// Se o dono do contato estiver entre os vendedores acima elencados ja permito que seja dono do card
if(in_array($responsavel_pelo_Contato, $vendedores_amarelos) || in_array($responsavel_pelo_Contato, $vendedores_azuis) || in_array($responsavel_pelo_Contato, $vendedores_medpos) || in_array($responsavel_pelo_Contato, $vendedores_inspirali) || in_array($responsavel_pelo_Contato, $vendedores_inspirali_interno)){
	// 	Atrinuo o card para o dono do contato
	$infoAtualizacaoNegocio = array(
		"ID" => $idNegocio, // id do Negocio
		"FIELDS[ASSIGNED_BY_ID]" => $responsavel_pelo_Contato,
		"FIELDS[STAGE_ID]" => "C83:UC_98M2V4",	// FASE DEFINIDA DA PIPE
		"FIELDS[CATEGORY_ID]" => "83", 
	);
	atualiza_info_negocio_bitrix($infoAtualizacaoNegocio);
	gravaTXT138("\n------------\nDONO DO CONTATO JÁ EXISTIA E ERA VENDEDOR id = $responsavel_pelo_Contato NO NEGOCIO = $idNegocio\n------------------------------------\n");
	die();
}









$vendedor_eleito = 7; // por enquanto me coloco (DARLAN) como eleito

// Pesquiso se o id do produto do negocio esta no array
if (in_array($ID_produto, $produtos_amarelos)) {
	gravaTXT138("\n------------\nEstá no AMARELO\n------------------------------------\n");
	// ultimo vendedor que recebeu uma oportunidade esta no array?
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_amarelos)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	gravaTXT138("\nTamanho do array = $tamanho_do_array \n");
	foreach ($vendedores_amarelos as $value) {
		 gravaTXT138("\n Vendedor = $value \n");
		if($value == $ultimo_vendedor_queRecebeu_card){
			gravaTXT138("\n Encontrado o ultimo vendedor que recebeu card = $value \n");
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_amarelos[$contador+1];
				gravaTXT138("\n Contador = $contador é menor que o tamanho do array vendedor eleito = $vendedor_eleito \n");
			break;
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_amarelos[0];
				gravaTXT138("\n Contador = $contador ------ é maior ou igual ao tamanho do array vendedor eleito = $vendedor_eleito \n");
			}
        }else{
			$contador++;
		}
	}
	
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_amarelos[0];	
		gravaTXT138("\n Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao = $vendedor_eleito \n");
	}

}elseif(in_array($ID_produto, $produtos_azuis)) {
	// gravaTXT138("\n------------\nEstá no AZUL\n------------------------------------\n");
	// ultimo vendedor que recebeu uma oportunidade esta no array?
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_azuis)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	foreach ($vendedores_azuis as $value) {
		if($value == $ultimo_vendedor_queRecebeu_card){
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_azuis[$contador+1];
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_azuis[0];
			}
		}else{
			$contador++;
		}
	}
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_azuis[0];	
	}

}elseif(in_array($ID_produto, $produtos_medpos)) {
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_medpos)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	foreach ($vendedores_medpos as $value) {
		if($value == $ultimo_vendedor_queRecebeu_card){
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_medpos[$contador+1];
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_medpos[0];
			}
		}else{
			$contador++;
		}
	}
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_medpos[0];	
	}
// }



// ----------------------------------------------------------------------


}elseif(in_array($ID_produto, $produtos_inspirali)) {
	// gravaTXT138("\n------------\nEstá na MEDPOS\n------------------------------------\n");
	// ultimo vendedor que recebeu uma oportunidade esta no array?
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_inspirali)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	foreach ($vendedores_amib as $value) {
		if($value == $ultimo_vendedor_queRecebeu_card){
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_inspirali[$contador+1];
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_inspirali[0];
			}
		}else{
			$contador++;
		}
	}
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_inspirali[0];	
	}

}elseif(in_array($ID_produto, $produtos_inspirali_interno)) {
	gravaTXT138("\n------------\nEstá nos produtos internos\n------------------------------------\n");
	// ultimo vendedor que recebeu uma oportunidade esta no array?
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_inspirali_interno)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	foreach ($vendedores_inspirali_interno as $value) {
		if($value == $ultimo_vendedor_queRecebeu_card){
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_inspirali_interno[$contador+1];
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_inspirali_interno[0];
			}
		}else{
			$contador++;
		}
	}
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_inspirali_interno[0];	
	}

}else{
	// gravaTXT138("\n------------\nProduto ID = $ID_produto não está em nenhum array delegado ao gerson\n------------------------------------\n");
	$vendedor_eleito = 4513; //gerson
}



$infoAtualizacaoNegocio = array(
	"ID" => $idNegocio, // id do Negocio
	"FIELDS[ASSIGNED_BY_ID]" => $vendedor_eleito,
	"FIELDS[STAGE_ID]" => "C83:UC_98M2V4",	// FASE DEFINIDA DA PIPE
	"FIELDS[CATEGORY_ID]" => "83", 
);
atualiza_info_negocio_bitrix($infoAtualizacaoNegocio);

// Atualizo o produto com o campo do ultimo vendedor que recebeu um card
$arrayAtualizacaoProduto = array(
	"ID" => $ID_produto, // id do produto
	"FIELDS[PROPERTY_122]" => $vendedor_eleito,
);
atualiza_info_produto($arrayAtualizacaoProduto);

$infoAtualizacaoContato = array(
	"ID" => $id_contato_doAluno, // id do Contato
	"FIELDS[ASSIGNED_BY_ID]" => $vendedor_eleito,
);
atualiza_info_contato_bitrix($infoAtualizacaoContato);

// gravaTXT138("\n\n\n\n\n");

die();
