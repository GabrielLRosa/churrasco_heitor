<?php
// Usar a mesma lógica do index.php corrigido
define('ENVIRONMENT', isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : (getenv('CI_ENV') ? getenv('CI_ENV') : 'development'));

echo "PHP está funcionando!";
echo "<br>\$_SERVER['CI_ENV']: " . (isset($_SERVER['CI_ENV']) ? $_SERVER['CI_ENV'] : 'não definido');
echo "<br>getenv('CI_ENV'): " . (getenv('CI_ENV') ? getenv('CI_ENV') : 'não definido');
echo "<br>ENVIRONMENT (corrigido): " . ENVIRONMENT;

// Testar se o controller existe e é acessível
echo "<br><br>Testando controller...";
$controller_path = 'application/controllers/CheckList.php';
if (file_exists($controller_path)) {
    echo "<br>CheckList.php existe: sim";
    // Tentar incluir o controller para ver se há erros de sintaxe
    ob_start();
    $error = false;
    try {
        include_once $controller_path;
        if (class_exists('Checklist')) {
            echo "<br>Classe Checklist carregada: sim";
        } else {
            echo "<br>Classe Checklist carregada: não";
        }
    } catch (Exception $e) {
        $error = true;
        echo "<br>Erro ao carregar controller: " . $e->getMessage();
    }
    ob_end_clean();
    
    if (!$error) {
        echo "<br>Controller carregado sem erros";
    }
} else {
    echo "<br>CheckList.php existe: não";
}
?>
