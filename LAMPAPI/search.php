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

	// Try to connect to the database.
	$connection = new mysqli("localhost", "Administrator", "Master User", "COP4331");

	// Connection error checking.
	if ($connection->connect_errno)
	{
		echo "Failed to connect to MySQL: " . $connection->connect_error;
		exit();
	}
	
	// Set default values.
	$searchResults = "";
	$searchCount = 0;
    
	// Prepare before bind
	$stmt = $connection->prepare("SELECT * FROM Users WHERE FirstName like ?");

	// Define search pattern.
	$searchStr = $inData["search"];
	$patternMatcher = "%" . $searchStr . "%";

	// Pattern matcher is a string type therefore, the bind type is a string.
	$bindType = "s";

	if ($stmt->bind_param($bindType, $patternMatcher) == 'true')
	{
		$stmt->execute();
	}

	$sqli_result_obj = $stmt->get_result();

	// $list [] = array();
	while ($row = $sqli_result_obj->fetch_assoc()) {
		if($searchCount > 0) {
			$searchResults .= ",";
		}
		$searchCount++;
		// $searchResults .= '{"id": ' . $row["ID"] . ',"FirstName":" ' . $row["FirstName"] . ' ","LastName": '. $row["LastName"] .'"}';
		$searchResults = json_encode($row);
		// $list[$searchCount] = $searchResults; 
		// array_push($list,$searchResults);
		echo $searchResults;
	}

	// returnWithInfo($searchResults);
	returnWithInfo($searchResults);

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo($searchResults) {
		$retValue = '{"results":['. $searchResults .'],"error":""}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithError($err) {
		$retValue = '{"id": 0,"firstName":"","lastName":"","error":""' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
?>