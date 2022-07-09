<?php
	
	$errors = array();

	// Check if name has been entered
	if (!isset($_POST['name'])) {
		$errors['name'] = 'Please enter your name';
	}
	
	// Check if email has been entered and is valid
	if (!isset($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
		$errors['email'] = 'Please enter a valid email address';
	}
	
	//Check if message has been entered
	if (!isset($_POST['massage'])) {
		$errors['message'] = 'Please enter your message';
	}

	$errorOutput = '';

	if(!empty($errors)){

		$errorOutput .= '<div class="alert alert-danger alert-dismissible" role="alert">';
 		$errorOutput .= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';

		$errorOutput  .= '<ul>';

		foreach ($errors as $key => $value) {
			$errorOutput .= '<li>'.$value.'</li>';
		}

		$errorOutput .= '</ul>';
		$errorOutput .= '</div>';

		echo $errorOutput;
		die();
	}



	$name = $_POST['name'];
	$email = $_POST['email'];
	$message = $_POST['massage'];
	$from = $email;
	$to = 'praveshjain999@gmail.com.com';  // please change this email id
	$subject = 'Contact Form :';
	
	$body = "From: $name\n E-Mail: $email\n\n Message:\n ,<b>$message</b>";


	//send the email
	$result = '';
	if (mail ($to, $subject, $body)) {
		$result .= '<div class="alert alert-success alert-dismissible" role="alert">';
 		$result .= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
		$result .= 'Thank You! "#"';  // <- Add your message here
		$result .= '</div>';

		echo $result;
		die();
	}

	$result = '';
	$result .= '<div class="alert alert-danger alert-dismissible" role="alert">';
	$result .= '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	$result .= 'Something bad happend during sending this message. Please try again later';
	$result .= '</div>';

	echo $result;
	