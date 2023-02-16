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
	$connection = new mysqli("localhost", "Administrator", "Master User", "COP4331");
	if ($connection->connect_errno)
	{
		echo "Failed to connect to MySQL: " . $connection->connect_error;
		exit();
	}

	// prepare and bind
	$stmt = $connection->prepare("SELECT ID FROM Users WHERE Login = ?");
	$stmt->bind_param("s",$login);

	// set parameters and execute
	$firstname = $inData["FirstName"];
	$lastname = $inData["LastName"];
	$login = $inData["Login"];
	$password = $inData["Password"];
	$stmt->execute();

	$result = $stmt->get_result();

	// Check if the user is already in the relation.
	if($row = $result->fetch_assoc())
	{
		returnWithError("Record in relation found");
	}
	
	// The user is unique, register the client
	else
	{
		$stmt = $connection->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstname, $lastname, $login, $password);
		$stmt->execute();
		$stmt->close();
		$connection->close();
		returnWithError("New record created");
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