<?PHP 

// $cpf = $user_info->data->user_login;
// $mail = $user_info->user_email;
// $fullName = $user_info->user_fisrtname+" "+$user_infor->user_lastname;

$clientId = "295bf844-9be9-43da-a36c-969827cd21b3";
$senhaDoSyspass = "bZ.8Q~1YA1tXFWFC4s1mscrzF53EBKNXXFE-Pddr";
$secret = $senhaDoSyspass;
$tokenURL = "https://login.microsoftonline.com/80f6a699-b024-4b7b-8cca-5ecfdd2a2fe3/oauth2/v2.0/token";
$libURL = "https://cloudapp-hml.animaeducacao.com.br/servico-gestao-bibliotecas/services/v1/libraries/brands/14";

// $student = [
//     "organizationID" => "14",
//     "studentCpf" => $cpf,
//     "studentName" => $fullName,
//     "studentRegistration" => $cpf,
//     "studentEmail" => $mail
// ];

$student = [
    "organizationID" => "14",
    "studentCpf" => "01825537011",
    "studentName" => "Kiyoshi Takahama",
    "studentRegistration" => "01825537011",
    "studentEmail" => "kiyoshi.borges@inspirali.com"
];


function getAccessToken($clientId, $secret, $tokenURL) {
    
    $ch = curl_init();

    $data = [
        'grant_type' => 'client_credentials',
        'client_id' => $clientId,
        'client_secret' => $secret,
        'scope' => 'api://servico_gestao_bibliotecas_devhml/.default'
    ];

    curl_setopt($ch, CURLOPT_URL, $tokenURL);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        $response = json_decode($response, true);
        echo "Token de Acesso: " . $response['access_token'] . "\n";
        return $response['access_token'];
    }
}

$token = getAccessToken($clientId, $secret, $tokenURL);

// function getAccessToken($clientId, $secret, $tokenURL) {
//     $ch = curl_init();


//     $data = [
//         'grant_type' => 'client_credentials',
//         'client_id' => $clientId,
//         'client_secret' => $secret,
//         'scope' => 'api://servico_gestao_bibliotecas_devhml/.default'
//     ];

//     curl_setopt($ch, CURLOPT_URL, $tokenURL);
//     curl_setopt($ch, CURLOPT_POST, true);
//     curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//     curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

//     $response = curl_exec($ch);
//     $err = curl_error($ch);
//     curl_close($ch);

//     if ($err) {
//         echo "cURL Error #:" . $err;
//     } else {
//         $response = json_decode($response, true);
//         echo "Token de Acesso: " . $response['access_token'] . "\n";
//         return $response['access_token'];
//     }
// }

$token = getAccessToken($clientId, $secret, $tokenURL);

function getAccessLib($token, $libURL) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $libURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $token",
    ]);

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        $data = json_decode($response, true);
        echo '<div class="library-buttons">';
        foreach($data as $library){
            echo '<tr>',
                        '<td>'.$library['libraryId'].'</td>',
                        '<td>'.$library['libraryImage'].'</td>',
                        '<td>'.$library['libraryName'].'</td>',
                        '</tr>'
            ;
        };
        echo '</div>';

        echo "Lista de Bibliotecas Disponíveis: ";
        print_r($data);
		getLibrary($data,$token);
    }
}

// getAccessLib($token, $libURL);


function getLibrary($data,$token){
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_URL,'https://cloudapp-hml.animaeducacao.com.br/servico-gestao-bibliotecas/services/v1/libraries/98/brands/14/redirect');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
		"content-Type: application/json",
		"Authorization: Bearer $token",
	]);
	
	$response = curl_exec($ch);
	$err = curl_error($ch);
	curl_close($ch);
	
	if ($err){
		echo "cURL Error #:". $err;
	}else{
		$data = json_decode($response, true);
		echo "Biblioteca: ";
		print_r($data);
	}
	
}





