<?php

	// example use from browser
	

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

	// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

	$countRequest = 'SELECT COUNT(id) as pc FROM personnel WHERE departmentID = ' . $_REQUEST['id'];

	$count = $conn->query($countRequest);

	$sum = 0;
	while($row = $count->fetch_array()) {
        $sum = $row['pc'];
        };

	if($sum==0){

	$query = 'DELETE FROM department WHERE id = ' . $_REQUEST['id'];

	$result = $conn->query($query);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $result;
	
	mysqli_close($conn);

	echo json_encode($output); 
	} else {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = $sum;

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	

?>