<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertEmployee.php?firstName=Sam&lastName=Stoppani&jobTitle=SoftwareDeveloper&email=samstoppani@gmail.com&departmentID=10

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	
    
	$query = 'INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES("' . $_REQUEST['firstName'] . '","' . $_REQUEST["lastName"] . '","' . $_REQUEST["jobTitle"] . '","' . $_REQUEST["email"] . '", (SELECT id FROM department WHERE name ="'. $_REQUEST["department"].'" AND locationID = '. $_REQUEST["location"].'))';
	
    
    $result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $result;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>