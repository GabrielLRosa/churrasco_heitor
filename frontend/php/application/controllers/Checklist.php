<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Checklist extends CI_Controller {
	public function __construct() {
        parent::__construct();
        $this->load->helper('url');
    }

	public function index() {
        $data['title'] = 'Checklist de Veículo - PrologApp';
        $this->load->view('checklist_react', $data);
    }

}
