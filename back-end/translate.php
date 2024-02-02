<?php
require_once __DIR__ . '/vendor/autoload.php';
use Dejurin\GoogleTranslateForFree;


$data = json_decode(file_get_contents('php://input'), true);
$text = $data['text'];
$source = $data['source'];
$target = $data['target'];


$tr = new GoogleTranslateForFree();
$result = $tr->translate($source, $target, $text, 3);


echo json_encode(['translatedText' => $result]);

?>