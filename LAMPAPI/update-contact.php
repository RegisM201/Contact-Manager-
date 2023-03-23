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
	$in = getRequestInfo();

	$mysqli = new mysqli("localhost", "Administrator", "Master User", "COP4331");

	// Check connection
	if ($mysqli->connect_error) {
    	die("Connection failed: " . $mysqli->connect_error);
	}

	// Get username and password of user wanting to update a contact.
	$usr = $in["Login"];
	$pwd = $in["Password"];
	//$phoneNumber = $in["PhoneNumber"];

	// Declare an id that will store a users id from the User table.
	$userID = "";

	if(empty($usr) || empty($pwd)) {
		reportLoginErr("invalid username or password");
	}

	function reportLoginErr($emptyInputStr) {
		$retValue = '{"error": " ' . $emptyInputStr . ' "}';
		sendResultInfoAsJson($retValue);
	}

	// Query Users Table to fetch the ID of the user who will update a contact in their list.
	if ($result = $mysqli -> query("SELECT ID FROM Users WHERE Login = '$usr' AND Password = '$pwd'")) {
		if ($result->num_rows > 0) {
			// Get ID from Users table.
			while($row = $result->fetch_assoc()) {
				$userID = $row["ID"];
			}
		} else {
			sendResultInfoAsJson("0 results");
		}
	}

	// Holds the ID of the contact that will be updated in Contacts table.
	$contactID = "";

	// Query Contacts Table to fetch the ID of the contact that needs to be updated.
	if ($result = $mysqli -> query("SELECT ID FROM Contacts WHERE UserID = '$userID')) {
		if ($result->num_rows > 0) {
			// Get ID from Users table.
			while($row = $result->fetch_assoc()) {
				$contactID = $row["ID"];
			}
		} else {
			sendResultInfoAsJson("0 results");
		}
	}

	// Update the contact info.
	$newFirstName = $in["firstName"];
	$newLastName = $in["lastName"];
	$newAddr = $in["address"];
	$newEmail = $in["email"];
	$newNumber = $in["phone"];

	$sql = "UPDATE Contacts
			SET FirstName='$newFirstName', LastName='$newLastName', Address='$newAddr',
			Email='$newEmail', PhoneNumber='$newNumber'
			WHERE ID='$contactID' AND UserID='$userID';

	if ($mysqli->query($sql) === TRUE) {
		echo "Contact updated successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $mysqli->error;
	}

	function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj) {
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo($firstName, $lastName, $id) {
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithError($err) {
		$retValue = '{"id": 0, "firstName":"", "lastName":"", "error": " ' . $err . ' "}';
		sendResultInfoAsJson($retValue);
	}

	$mysqli->close();
?>