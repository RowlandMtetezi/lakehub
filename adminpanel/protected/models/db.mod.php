<?php 
	$dsn = 'mysql:host=localhost;dbname=lakehub;';
	$user = 'root';
	$password = '';
	try{
		$dbh = new PDO($dsn, $user, $password);
		
			$name = $_POST['creator'];
			$email = $_POST['email'];
			$subject = $_POST['subject'];
			$message = $_POST['text'];
			$sql = 'INSERT INTO usercomments (email, subject, message, name) VALUES (:email, :subject, :message, :name)';
			$stmt = $dbh->prepare($sql);
			$stmt->bindParam(':email', $email);
			$stmt->bindParam(':subject', $subject);
			$stmt->bindParam(':message', $message);
			$stmt->bindParam(':name', $name);
			$stmt->execute();
			header('Location:\lakehub\#about.php');
		
	}
	catch (PDOException $e){
		echo 'PDO Exception Caught.';
		echo 'Error with the database: <br />';
		echo 'SQL Query: ', $sql;
		echo 'Error: ' . $e->getMessage();
	}
?>