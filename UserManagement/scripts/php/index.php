<?php

use Slim\Slim;

require '../../Slim/Slim.php';
require_once '../../Swift-4.3.0/lib/swift_required.php';

\Slim\Slim::registerAutoloader();

$app = new Slim();

$app->get('/apps','getApps');
$app->get('/users','getUsers');
$app->post('/users/:id','getUser');
$app->get('/users/search/:query','findUser');
$app->post('/users','addUser');
$app->put('/users/:id','updateUser');
$app->delete('/users/:id','deleteUser');

$app->run();

function getApps() {
	$sql = "SELECT * FROM apps ORDER BY _id";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$apps = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($apps);
	}
	catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
	}
}

function getUsers() {
	$sql = "SELECT * FROM users ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	}
	catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
	}
}

function getUser($id) {
	$request = Slim::getInstance()->request();
	create_log($request->getBody());
	$data = json_decode($request->getBody());
	create_log($data->password);
	$sql = "SELECT * FROM users WHERE username='" . ":id" . "' OR email='" . ":id" . "' AND password='" . ":password" . "'";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->bindParam("password", $data->password);
		$stmt->execute();
		$user = $stmt->fetchObject();
		$db = null;
		echo json_encode($user);
	} catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
		return FALSE;
	}
}

function findUser($query) {
	$sql = "SELECT * FROM users WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($users);
	} catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
	}
}

function addUser() {
	$request = Slim::getInstance()->request();
	$user = json_decode($request->getBody());
	create_log('Attempting to add ' . $user->username . '...' . "\r\n");
	$sql = "INSERT INTO users(username,password,name,email,authorized,dma,fa,va,im) VALUES (:username,:password,:name,:email,:authorized,:dma,:fa,:va,:im)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("username", $user->username);
		$stmt->bindParam("password", $user->password);
		$stmt->bindParam("name", $user->name);
		$stmt->bindParam("email", $user->email);
		$stmt->bindParam("authorized", $user->authorized);
		$stmt->bindParam("dma", $user->dma);
		$stmt->bindParam("fa", $user->fa);
		$stmt->bindParam("va", $user->va);
		$stmt->bindParam("im", $user->im);
		$stmt->execute();
		$db = null;
		
		$transport = Swift_SmtpTransport::newInstance('pod51018.outlook.com',587,'tls')
		->setUsername('avantikai@systechusa.com')
		->setPassword('chick157!');
		$mailer = Swift_Mailer::newInstance($transport);
		$message = Swift_Message::newInstance('Registration@ATG')
		->setFrom(array('avantikai@systechusa.com' => 'ATG@SystechUSA'))
		->setTo(array($user->email => $user->name))
		->setBody('Thank you for registering on ATG@SystechUSA' . "\r\n" . "\r\n" .
				'Your Username is ' . $user->username . "\r\n" .
				'Your Password is ' . $user->password . "\r\n" . "\r\n" .
				'Your account will be activated shortly!' . "\r\n" . "\r\n" .
				'ATG@SystechUSA');
		$mailer->send($message);
		
		create_log('Successfully added ' . $user->username . '.' . "\r\n");
		echo json_encode($user);
	} catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
		if (strpos($e->getMessage(),'PRIMARY') !== false) {
			echo '{"error":' . '"This Username is already in use. Please enter a different Username."' . '}';
		}
		else if (strpos($e->getMessage(),'email') !== false) {
			echo '{"error":' . '"A User already exists with this e-mail address. Please enter another email address."' . '}';
		}
	}
}

function updateUser($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$user = json_decode($body);
	$exists = getUser($id);
	if($exists == FALSE) {
		addUser();
	}
	else {
		create_log('Attempting to update ' . $id . '...' . "\r\n");
		$sql = "UPDATE users SET authorized=:authorized, dma=:dma, fa=:fa, va=:va, im=:im WHERE username=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("authorized", $user->authorized);
			$stmt->bindParam("dma", $user->dma);
			$stmt->bindParam("fa", $user->fa);
			$stmt->bindParam("va", $user->va);
			$stmt->bindParam("im", $user->im);
			$stmt->bindParam("id", $id);
			$stmt->execute();
			$db = null;
			echo json_encode($user);
			create_log('Successfully updated ' . $id . '.' . "\r\n");
		} catch(PDOException $e) {
			create_log($e->getMessage() . "\r\n");
		}
	}
}

function deleteUser($id) {
	create_log('Attempting to delete ' . $id . '...' . "\r\n");
	$sql = "DELETE FROM users WHERE username=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		create_log('Successfully deleted ' . $id . '.' . "\r\n");
	} catch(PDOException $e) {
		create_log($e->getMessage() . "\r\n");
	}
}

function getConnection() {
	create_log('Attempting database connection...' . "\r\n");
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="kurt20cobain2.";
	$dbname="user_mgmt";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	create_log('Database connection successful.' . "\r\n");
	return $dbh;
}

function create_log($message) {
	$path = '/var/tmp/php.log';
	error_log($message,3,$path);
}
?>
