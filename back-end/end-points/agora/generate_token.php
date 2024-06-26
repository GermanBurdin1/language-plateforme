<?php
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json'); 

use BoogieFromZk\AgoraToken\RtcTokenBuilder;

require_once __DIR__ . '../../../../back-end/vendor/boogiefromzk/agora-token/src/RtcTokenBuilder.php';
require_once __DIR__ . '../../../../back-end/vendor/autoload.php';

$appId = 'a020b374553e4fac80325223fba38531';
$appCertificate = '1952a57a7c4c4f93b579dd2e073a1218';
$channelName = 'rtc_token';
$uid = 0; 
$role = RtcTokenBuilder::RoleAttendee;
$expireTimeInSeconds = 36000; 
$currentTimestamp = (new \DateTime("now", new \DateTimeZone('UTC')))->getTimestamp();
$privilegeExpiredTs = $currentTimestamp + $expireTimeInSeconds;

$token = RtcTokenBuilder::buildTokenWithUid($appId, $appCertificate, $channelName, $uid, $role, $privilegeExpiredTs);

echo json_encode(['token' => $token]);

?>