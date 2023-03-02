<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

	// Report all errors.
	error_reporting(E_ALL);

	// Display errors.
    ini_set("log_errors", 1);
    ini_set("error_log", "/tmp/php-error.log");

    // Get json from frontend.
	$inData = getRequestInfo();
	
	// Set default values.
	$id = 0;
	$FirstName = "";
	$LastName = "";

	// Always connect to the database through [localhost, adminUserName, password, databaseName]
	$connection = new mysqli("localhost", "Administrator", "Master User", "COP4331");

	if($connection->connect_error) {
		returnWithError($connection->connect_error);
	} else {
		$stmt = $connection->prepare("SELECT ID, FirstName, LastName FROM Users WHERE Login = ? AND Password = ?");
		$stmt->bind_param("ss", $inData["Login"], $inData["Password"]);
		$stmt->execute();

		$result = $stmt->get_result();

		// Check to see if the user login info is in the relation.
		if($row = $result->fetch_assoc()) {
			returnWithInfo($row['FirstName'], $row['LastName']);
		}
		else {
			returnWithError("No record in relation found");
		}
	}

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo($firstName, $lastName) {
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithError($err) {
		$retValue = '{"id": 0, "firstName":"", "lastName":"", "error": " ' . $err . ' "}';
		sendResultInfoAsJson($retValue);
	}
?>
