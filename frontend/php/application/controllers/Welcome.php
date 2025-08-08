<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	public function index()
	{
		echo "<h1>CodeIgniter está funcionando!</h1>";
		echo "<p>Controller Welcome carregado com sucesso.</p>";
		echo "<p>Environment: " . ENVIRONMENT . "</p>";
	}
}
