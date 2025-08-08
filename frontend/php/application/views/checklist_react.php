<?php $this->load->view('templates/header'); ?>
<?php
    $vitePort = getenv('VITE_PORT');
    if (!$vitePort) {
        $vitePort = isset($_SERVER['VITE_PORT']) ? $_SERVER['VITE_PORT'] : '5173';
    }
?>
    
    <div id="root"></div>

    <?php if (ENVIRONMENT === 'development'): ?>
		<script type="module">
			import RefreshRuntime from 'http://localhost:<?=$vitePort?>/@react-refresh'
			RefreshRuntime.injectIntoGlobalHook(window)
			window.$RefreshReg$ = () => {}
			window.$RefreshSig$ = () => (type) => type
			window.__vite_plugin_react_preamble_installed__ = true
		</script>
		<script type="module" src="http://localhost:<?=$vitePort?>/@vite/client"></script>
		<script type="module" src="http://localhost:<?=$vitePort?>/src/main.tsx"></script>
    <?php else: ?>
        <script type="module" src="/public/assets/index.js"></script>
    <?php endif; ?>
