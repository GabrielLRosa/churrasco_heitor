<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Create extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper('url');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('create');
    }
} 