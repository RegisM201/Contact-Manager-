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
        //   echo "id: " . $row["ID"]. "<br>";
          $id = $row["ID"];
        }
      } else {
        sendResultInfoAsJson("0 results");
      }
}

// userID is the ID from the Users table. We want to get all Contacts from the Contacts table who's UserID = ID from Users Table.
// Example Query to get list of contacts for the User with ID = 19 from Users:
// SELECT * FROM Contacts WHERE UserID = 19;
$userID = $id;

// SQL Statmennt that queries the Contacts table for all contacts associated with this user.
$sql = "SELECT * FROM Contacts WHERE UserID = $userID";

// Set the sql statement defined above.
$stmt = $mysqli->prepare($sql);

// Query the contact information.
$stmt->execute();

// Get the contact list.
$contactList = $stmt->get_result()->fetch_all();

// Respond to request.
sendResultInfoAsJson($contactList);

// Verify the response is an array, then wrap it as a json array.
function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo is_array($obj) ? json_encode($obj) : returnWithError("read contacts");
}

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($err)
{
	$retValue = '{"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}
?>