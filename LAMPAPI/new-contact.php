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
$firstName =$in["firstName"];
if ($firstName === "") {
    returnWithError("2");
}

// Query Users Table to fetch the ID of the user who will have a new contact added to their list.
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

// Add new contact.
$fName = $in["firstName"];
$lName = $in["lastName"];
$addr = $in["address"];
$email = $in["email"];
$phoneNum = $in["phone"];
$userID = $id;

$sql = "INSERT INTO Contacts (FirstName, LastName, Address, Email, PhoneNumber, UserID)
VALUES ('$fName', '$lName', '$addr', '$email', '$phoneNum', '$userID')";
if ($mysqli->query($sql) === TRUE) {
   //echo "'message': 'Contact updated successfully'";
} else {
    echo "'error': " . $sql . "<br>" . $mysqli->error;
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