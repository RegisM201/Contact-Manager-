<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

error_reporting(E_ALL);
ini_set("display_errors", "1");
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

$in = getRequestInfo();

$mysqli = new mysqli("localhost", "Administrator", "Master User", "COP4331");

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get username and password from front end.
$usr = $in["Login"];
$pwd = $in["Password"];
$id = "";

// Query Users Table to fetch the ID of the user who wants to read their contact list.
if ($result = $mysqli -> query("SELECT ID FROM Users WHERE Login = '$usr' AND Password = '$pwd'")) {
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {

          $id = $row["ID"];
        }
      } else {
        returnWithError("No Users Found");
      }
}

// userID is the ID from the Users table. We want to delete from the Contacts table for a specific UserID = ID from Users Table.
$userID = $id;

// Query the contact and delete it.
$stmt = $mysqli->prepare("DELETE FROM Contacts WHERE UserID = $userID AND PhoneNumber=?");
if ($stmt->bind_param("s", $in["PhoneNumber"]) == 'true') {
    $stmt->bind_param("s", $in["PhoneNumber"]);
    $stmt->execute();
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
	$retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}
?>