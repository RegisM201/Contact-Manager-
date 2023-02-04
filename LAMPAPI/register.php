<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

	 // reports all errors
	error_reporting(E_ALL);

	// Display all errors
	ini_set("display_errors", "1");
	ini_set("log_errors", 1);
	ini_set("error_log", "/tmp/php-error.log");

	$inData = getRequestInfo();

	// Connect to the database.
	$connection = new mysqli("localhost", "Administrator", "Gr0upNumb3rFive", "COP4331");

	// Check for connection error.
	if ($connection->connect_error) {
		returnWithError($connection->connect_error);
	} else {
		$stmt = $connection->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $inData["FirstName"], $$inData["LastName"], $inData["Login"], $inData["Password"]);
		$stmt->execute();

		$stmt->close();
		$connection->close();

		returnWithError("Successfully registered");
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
