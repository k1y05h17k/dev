<?PHP
// $current_user = wp_get_current_user();

// $cpf = $current_user->user_login;
// $email = $current_user->user_email;
// $usernome = $current_user->user_firstname;
// $usersobrenome = $current_user->user_lastname;
// $fullName = $usernome."".$usersobrenome;

$student = [
    
    "studentCpf" => "01825537011",
    "studentName" => "Kiyoshi Takahama",
    "studentRegistration" => "01825537011",
    "studentEmail" => "kiyoshi.borges@inspirali.com"
];


$queryStr .= "consumerkey=20200721-IBCMED2";
$queryStr .= "&userid=".$student["studentCpf"];
$queryStr .= "&name=".rawurlencode($student["studentName"]);
$queryStr .= "&email=".rawurlencode($student["studentEmail"]);
$MD5 = md5("12759e332dcd7901942dccfb82e6419a".date('Ymd').$queryStr); 
$queryStr .= "&tok=$MD5";

$prefix = "https://bibliotecaa.grupoa.com.br/lti/launch.php?".$queryStr;

postAcessLib($prefix);

function postAcessLib($prefix){
    
    $ch = curl_init();

    curl_setopt_array($ch, array(
        CURLOPT_URL => "https://bibliotecaa.grupoa.com.br/lti/launch.php?".$prefix,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
      ));
      
      $response = curl_exec($ch);
      
      curl_close($ch);
      $err = curl_error($ch);
      echo $response;

      if($err){

        echo "cURL Error #:".$err;

      }else{
        $response = json_decode($response,true);
        return $response;
      }


}
