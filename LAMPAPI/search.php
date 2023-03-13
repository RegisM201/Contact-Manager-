<?php
	// Standard HTTP Request headers.
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

	// Read in request body and store as json.
	$inData = getRequestInfo();

	// Wrap request body into a json object.
	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	$connection = new mysqli("localhost", "Administrator", "Master User", "COP4331");

	// Verify database connection.
	if ($connection->connect_errno) {
		echo "Failed to connect to MySQL: " . $connection->connect_error;
		exit();
	}

	// Define search pattern.
	$searchStr = $inData["search"];
	$patternMatcher = "%" . $searchStr . "%";

	// Query the contact information.
	$stmt = $connection->prepare("SELECT FirstName, LastName,
				Address, Email, PhoneNumber FROM Contacts WHERE FirstName like ?");

	// Represents our pattern matcher data type which is a string('s') because FirstName is a string.
	$bindType = "s";

	// Verify that the pattern string can be binded to '?' part of the sql statment above, then execute query.
	if ($stmt->bind_param($bindType, $patternMatcher) == 'true') {
		$stmt->bind_param("s", $patternMatcher);
		$stmt->execute();
	}

	// Get row of each contact from the database that matches the request search pattern.
	$contactList = $stmt->get_result()->fetch_all();

	// Respond to request.
	sendResultInfoAsJson($contactList);

	// Verify the response is an array, then wrap it as a json array.
	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo is_array($obj) ? json_encode($obj) : 'No contacts found';
	}
?>
