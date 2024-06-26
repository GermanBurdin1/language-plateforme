<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error_log.log');

require_once '../features/translation/LibreTranslate.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents('php://input');
    error_log("Raw input: " . $input);

    $data = json_decode($input, true);
    error_log("Decoded input: " . print_r($data, true));
    
    if (isset($data['q']) && isset($data['source']) && isset($data['target'])) {
        $text = $data['q'];
        $sourceLang = $data['source'];
        $targetLang = $data['target'];

        $translator = new LibreTranslate();
        $result = $translator->translate($text, $sourceLang, $targetLang);

        error_log("Translation result: " . print_r($result, true));

        if (isset($result['translatedText'])) {
            echo json_encode(array('translatedText' => $result['translatedText']));
        } else {
            error_log("Translation API did not return 'translatedText'");
            echo json_encode(array('error' => 'Translation failed', 'details' => $result));
        }
    } else {
        error_log("Invalid input data: " . print_r($data, true));
        echo json_encode(array('error' => 'Invalid input'));
    }
} else {
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode(array('error' => 'Invalid request method'));
}
?>

