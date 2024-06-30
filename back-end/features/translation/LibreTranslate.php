<?php
class LibreTranslate {
	private $apiUrl = 'https://libretranslate.com/translate';
	private $certPath = 'C:/Users/germa/OneDrive/Bureau/projects/learn-lang-plateforme/back-end/cacert.pem'; 

	public function translate($text, $sourceLang, $targetLang) {
			$data = array(
					'q' => $text,
					'source' => $sourceLang,
					'target' => $targetLang,
					'format' => 'text'
			);

			$options = array(
					CURLOPT_URL => $this->apiUrl,
					CURLOPT_POST => true,
					CURLOPT_POSTFIELDS => http_build_query($data),
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_HTTPHEADER => array('Content-Type: application/x-www-form-urlencoded'),
					CURLOPT_CAINFO => $this->certPath 
			);

			$ch = curl_init();
			curl_setopt_array($ch, $options);

			$response = curl_exec($ch);
			$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			$curlError = curl_error($ch);

			curl_close($ch);

			error_log("HTTP Response Code: " . $httpCode);
			error_log("cURL Error: " . $curlError);
			error_log("API Response: " . $response);

			return json_decode($response, true);
	}
}



?>
