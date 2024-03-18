<?php
// Função para remover os espaços da Número
function removerEspacos($string) {
    return str_replace(' ', '', $string);
}

// Função para verificar o código de área associado ao número
function verificarCodigoDeArea($numero) {
    // Array de códigos de áreas permitidos
    $codigosDeArea = ['51', '52', '53', '54', '55'];
    $caracteresParaRemover = ['+', '(', ')', ' ', '-'];

    // Remover cada caractere da lista
    foreach ($caracteresParaRemover as $caractere) {
        $numero = str_replace($caractere, '', $numero);
    }

    if (strpos($numero, '55') === 0) {
        $numero = substr($numero, 2);
    }

    foreach ($codigosDeArea as $codigo) {
        if (strpos($numero, $codigo) === 0) {
            return true;
        }
    }
    return false;
}
// Número associado ao contato
$numero = '+55 (55) 9 9999-9999"';

$numeroSemEspacos = removerEspacos($numero);
$numeroNovo = verificarCodigoDeArea($numeroSemEspacos);
// echo $numeroSemEspacos;
if (verificarCodigoDeArea($numeroSemEspacos)) {
    echo "Número com DD válido: $numero";
} else {
    echo "Número com DD inválido.";
}

