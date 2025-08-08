<?php
// Debug completo do CodeIgniter
define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : (getenv('CI_ENV') ? getenv('CI_ENV') : 'development'));

echo "<h2>Debug CodeIgniter</h2>";
echo "<strong>ENVIRONMENT:</strong> " . ENVIRONMENT . "<br>";
echo "<strong>PHP Version:</strong> " . PHP_VERSION . "<br>";

// Verificar se os diretórios essenciais existem
echo "<br><strong>Estrutura de diretórios:</strong><br>";
echo "system/: " . (is_dir('system') ? '✅' : '❌') . "<br>";
echo "application/: " . (is_dir('application') ? '✅' : '❌') . "<br>";
echo "application/config/: " . (is_dir('application/config') ? '✅' : '❌') . "<br>";
echo "application/controllers/: " . (is_dir('application/controllers') ? '✅' : '❌') . "<br>";

// Verificar arquivos essenciais
echo "<br><strong>Arquivos essenciais:</strong><br>";
echo "system/core/CodeIgniter.php: " . (file_exists('system/core/CodeIgniter.php') ? '✅' : '❌') . "<br>";
echo "application/config/config.php: " . (file_exists('application/config/config.php') ? '✅' : '❌') . "<br>";
echo "application/config/routes.php: " . (file_exists('application/config/routes.php') ? '✅' : '❌') . "<br>";
echo "application/controllers/CheckList.php: " . (file_exists('application/controllers/CheckList.php') ? '✅' : '❌') . "<br>";

// Verificar permissões
echo "<br><strong>Permissões:</strong><br>";
echo "application/ readable: " . (is_readable('application') ? '✅' : '❌') . "<br>";
echo "system/ readable: " . (is_readable('system') ? '✅' : '❌') . "<br>";

// Tentar carregar a configuração de rotas
echo "<br><strong>Configuração de rotas:</strong><br>";
if (file_exists('application/config/routes.php')) {
    ob_start();
    include 'application/config/routes.php';
    ob_end_clean();
    
    if (isset($route)) {
        echo "default_controller: " . (isset($route['default_controller']) ? $route['default_controller'] : 'não definido') . "<br>";
        echo "404_override: " . (isset($route['404_override']) ? $route['404_override'] : 'não definido') . "<br>";
    } else {
        echo "❌ Variável \$route não foi definida<br>";
    }
} else {
    echo "❌ routes.php não encontrado<br>";
}

// Verificar se consegue incluir o controller
echo "<br><strong>Teste do Controller:</strong><br>";
$controller_file = 'application/controllers/CheckList.php';
if (file_exists($controller_file)) {
    $content = file_get_contents($controller_file);
    if (strpos($content, 'class Checklist') !== false) {
        echo "✅ Classe Checklist encontrada no arquivo<br>";
    } else {
        echo "❌ Classe Checklist não encontrada no arquivo<br>";
    }
    
    if (strpos($content, 'public function index') !== false) {
        echo "✅ Método index() encontrado<br>";
    } else {
        echo "❌ Método index() não encontrado<br>";
    }
} else {
    echo "❌ Controller não encontrado<br>";
}

// Verificar .htaccess
echo "<br><strong>Configuração Apache:</strong><br>";
if (file_exists('.htaccess')) {
    echo "✅ .htaccess existe<br>";
    $htaccess = file_get_contents('.htaccess');
    if (strpos($htaccess, 'RewriteEngine On') !== false) {
        echo "✅ RewriteEngine está ativo<br>";
    } else {
        echo "❌ RewriteEngine não encontrado<br>";
    }
} else {
    echo "❌ .htaccess não encontrado<br>";
}

echo "<br><strong>Informações do servidor:</strong><br>";
echo "SERVER_NAME: " . ($_SERVER['SERVER_NAME'] ?? 'não definido') . "<br>";
echo "REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'não definido') . "<br>";
echo "SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'não definido') . "<br>";
echo "DOCUMENT_ROOT: " . ($_SERVER['DOCUMENT_ROOT'] ?? 'não definido') . "<br>";
?>
