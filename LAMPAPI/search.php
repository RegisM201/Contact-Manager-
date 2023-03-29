<?php
	// Standard HTTP Request headers.
	header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

        error_reporting(E_ALL);

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
	// Get username and password from front end.
$usr = $inData["Login"];
$pwd = $inData["Password"];
$id = "";

// Query Users Table to fetch the ID of the user who wants to read their contact list.
if ($result = $connection -> query("SELECT ID FROM Users WHERE Login = '$usr' AND Password = '$pwd'")) {
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
        //   echo "id: " . $row["ID"]. "<br>";
          $id = $row["ID"];
        }
      } else {
        returnWithError("0 results");
      }
}

	// Define search pattern.
	$searchStr = $inData["search"];
	$patternMatcher = "%" . $searchStr . "%";

	// Query the contact information.
	$stmt = $connection->prepare("SELECT * FROM Contacts WHERE UserID = '$id' AND (FirstName like ? OR LastName like ? OR Email like ? OR Address like ? OR PhoneNumber like ?)");

	// Represents our pattern matcher data type which is a string('s') because FirstName is a string.
	$bindType = "sssss";

	// Verify that the pattern string can be binded to '?' part of the sql statment above, then execute query.
	if ($stmt->bind_param($bindType, $patternMatcher, $patternMatcher, $patternMatcher, $patternMatcher, $patternMatcher) == 'true') {
		$stmt->bind_param("sssss", $patternMatcher, $patternMatcher, $patternMatcher, $patternMatcher, $patternMatcher);
		$stmt->execute();
	}

	// Get row of each contact from the database that matches the request search pattern.
	$contactList = $stmt->get_result()->fetch_all();

	// Respond to request.
	sendResultInfoAsJson($contactList);

	// Verify the response is an array, then wrap it as a json array.
	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo is_array($obj) ? json_encode($obj) : '[]';
	}
?>
