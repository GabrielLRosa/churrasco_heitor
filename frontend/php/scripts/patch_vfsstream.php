<?php

declare(strict_types=1);

$targetPath = __DIR__ . '/../vendor/mikey179/vfsstream/src/main/php/org/bovigo/vfs/vfsStream.php';

if (!file_exists($targetPath)) {
    // Vendor ainda não instalado; nada a fazer
    exit(0);
}

$originalContents = file_get_contents($targetPath);
if ($originalContents === false) {
    fwrite(STDERR, "Não foi possível ler {$targetPath}\n");
    exit(1);
}

$patchedContents = str_replace('name{0}', 'name[0]', $originalContents);

if ($patchedContents !== $originalContents) {
    $result = file_put_contents($targetPath, $patchedContents);
    if ($result === false) {
        fwrite(STDERR, "Falha ao escrever em {$targetPath}\n");
        exit(1);
    }
    echo "Patched vfsStream.php\n";
}

exit(0);


