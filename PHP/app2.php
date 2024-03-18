<?

// Função para remover os espaços da Número
function removerEspacos($string) {
    return str_replace(' ', '', $string);
}

// Função para verificar o código de área associado ao número
function verificarCodigoDeArea($numero) {
    // Array de códigos de áreas permitidos
    $codigosDeArea = ['51', '52', '53', '54', '55'];

    if (strpos($numero, '+55') === 0) {
        $numero = substr($numero, 3);
    }

    foreach ($codigosDeArea as $codigo) {
        if (strpos($numero, $codigo) === 0) {
            return true;
        }
    }
    return false;
}
// Número associado ao contato
// $numero = '51998075746';

$numeroSemEspacos = removerEspacos($numero);
$numeroNovo = verificarCodigoDeArea($numeroSemEspacos);

if (verificarCodigoDeArea($numeroSemEspacos)) {
	$contador = 0;
	$ultimo_vendedor_estaNoArray = false;
	$tamanho_do_array = count($vendedores_medpos_medpos)-1; // conta o numero de vendedores ATENÇÃO a contagem do COUNT INICIA EM 1 E NÃO EM ZERO
	// Percorro todas as posicoes do array em busca do id do ultimo vendedor que recebeu para pegar o proximo
	foreach ($vendedores_medpos_medpos as $value) {
		if($value == $ultimo_vendedor_queRecebeu_card){
			$ultimo_vendedor_estaNoArray = true;
			// Conto a posicao dele mais um se for menor que o tamenho do array de vendedores
			if($contador < $tamanho_do_array){
				// Conto a posicao do array mais um
				$vendedor_eleito = $vendedores_medpos_medpos[$contador+1];
			}else{
				// Pego a primeira posicao do array
				$vendedor_eleito = $vendedores_medpos_medpos[0];
			}
		}else{
			$contador++;
		}
	}
	// Se o ultimo vendedor a receber o produto nao estiver no array eu delego para a primeira posicao
	if(!$ultimo_vendedor_estaNoArray){
		$vendedor_eleito = $vendedores_medpos_medpos[0];	
	}

} else {
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
}