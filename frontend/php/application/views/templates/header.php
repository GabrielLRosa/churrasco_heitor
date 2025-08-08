<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?php echo isset($title) ? $title : 'PrologApp'; ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link rel="icon" href="<?php echo base_url('public/assets/favicon.ico'); ?>" type="image/x-icon">
    <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/assets/css/helpers.css">
    <link rel="stylesheet" href="/public/assets/index.css">
    <style type="text/css">
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .header {
            background-color: #3D5FD9;
            padding: 24px;
        }

        .nav {
			display: flex;
			gap: 12px;
            justify-self: center;
			align-items: center;
			justify-content: space-between;
			max-width: 1200px;
			width: 100%;
        }

        .nav a {
            display: flex;
            align-items: center;
        }

        .nav-create {
            color: white;
            text-decoration: none;
            font-size: 16px;
            border: 1px solid white;
            padding: 0 16px;
            border-radius: 8px;
            height: 40px;
            transition: all 0.2s ease-in-out;
        }

        .nav-create:hover {
            background-color: #4D78E4;
            border-color: #4D78E4;
        }

		.nav-links {
			display: flex;
			gap: 16px;
		}

		.nav-links--list,
		.nav-links--create {
			color: white;
			text-decoration: none;
			font-size: 16px;
			border: 1px solid white;
			padding: 0 16px;
			border-radius: 8px;
		}
    </style>
    <script>
        function handleCreateChecklistClick(event) {
            event.preventDefault();
            
            // Verificar se a função do React está disponível
            if (typeof window.openChecklistForm === 'function') {
                window.openChecklistForm();
            } else {
                // Fallback: se o React não carregou ainda, aguardar um pouco e tentar novamente
                setTimeout(function() {
                    if (typeof window.openChecklistForm === 'function') {
                        window.openChecklistForm();
                    } else {
                        console.warn('Função openChecklistForm não encontrada. Redirecionando...');
                        // Fallback final: redirecionar para a página de criação
                        window.location.href = '<?php echo base_url('checklist'); ?>';
                    }
                }, 100);
            }
        }
    </script>
</head>
<body class="light">
    <header class="header">
        <nav class="nav">
            <a href="<?php echo base_url(); ?>">
                <svg width="171" height="41" viewBox="0 0 171 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.74848 0H23.2515C28.0777 0 32 3.92229 32 8.74848V23.2515C32 28.0773 28.0777 32 23.2515 32H8.74848C3.92275 32 0 28.0773 0 23.2515V8.74848C0 3.92229 3.92275 0 8.74848 0ZM22.2414 10.7639C18.4716 7.09486 12.4402 7.19517 8.77071 10.965L5.90591 13.9557L8.34384 16.3181L11.2338 13.3273C13.571 10.9146 17.4416 10.8395 19.879 13.2018L22.8446 16.0918L25.207 13.6539L22.2414 10.7639ZM22.317 19.2332C18.5472 15.5642 12.5158 15.6645 8.84632 19.4343L5.95633 22.425L8.39426 24.7874L11.2843 21.7967C13.6214 19.3839 17.492 19.3088 19.9295 21.6712L22.9202 24.5612L25.2826 22.1232L22.317 19.2332Z" fill="white"/>
                    <path d="M70.8811 13.5727C70.8811 18.9392 66.9047 20.9886 61.88 20.9886H52.6104V28.2333H48V5.8892H61.88C66.9047 5.8892 70.8811 8.20617 70.8811 13.5727ZM66.2707 13.5727C66.2707 11.1579 64.7095 9.8163 62.2943 9.8163H52.6104V17.3051H62.2943C64.7095 17.3295 66.2707 15.939 66.2707 13.5727Z" fill="white"/>
                    <path d="M87.2247 19.6958C87.2247 13.8901 91.6888 10.6703 98.1774 10.6703C104.641 10.6703 109.032 13.8901 109.032 19.6958C109.032 25.5256 104.617 28.6481 98.1774 28.6481C91.6644 28.6481 87.2247 25.5256 87.2247 19.6958ZM104.495 19.6958C104.495 16.1831 101.812 14.1342 98.1774 14.1342C94.5428 14.1342 91.7617 16.1586 91.7617 19.6958C91.7617 23.2571 94.4939 25.2086 98.1774 25.2086C101.763 25.2086 104.495 23.2571 104.495 19.6958Z" fill="white"/>
                    <path d="M85.2488 10.6703H85.127C82.6144 10.6703 80.4189 11.158 78.6629 12.0608C75.8574 13.5243 74.1743 16.1097 74.1743 19.6959V28.2578H78.6629V19.6714C78.6629 19.33 78.6869 19.037 78.7358 18.7201C79.1995 15.7683 81.8338 14.1342 85.127 14.1342H85.2488V10.6703Z" fill="white"/>
                    <path d="M117.228 28.2578H112.74V4.15729H117.228V28.2578Z" fill="white"/>
                    <path d="M120.936 19.6958C120.936 13.8901 125.4 10.6703 131.889 10.6703C138.353 10.6703 142.744 13.8901 142.744 19.6958C142.744 25.5256 138.328 28.6481 131.889 28.6481C125.4 28.6481 120.936 25.5256 120.936 19.6958ZM138.207 19.6958C138.207 16.1831 135.523 14.1342 131.889 14.1342C128.254 14.1342 125.473 16.1586 125.473 19.6958C125.473 23.2571 128.205 25.2086 131.889 25.2086C135.474 25.2086 138.207 23.2571 138.207 19.6958Z" fill="white"/>
                    <path d="M170.503 10.6947H156.331C149.842 10.7192 145.402 13.939 145.402 19.7203C145.402 24.2084 148.037 27.0868 152.184 28.1848C148.647 28.2093 145.988 29.1846 145.988 32.039C145.988 34.2831 147.525 35.9906 152.55 35.9906H159.038C161.868 35.9906 163.624 36.8686 163.624 39.4056V40.3813H169.04V38.4298C169.04 33.4291 165.771 31.8439 160.209 31.8439H153.403C152.135 31.8439 151.476 31.3558 151.476 30.5023C151.476 29.1117 153.135 28.7943 156.672 28.6725C156.867 28.6725 157.087 28.6725 157.282 28.6481C159.697 28.5507 161.795 27.9652 163.454 26.965C165.868 25.4771 167.283 23.0375 167.283 19.7203C167.283 17.4518 166.6 15.5732 165.405 14.1342H170.503V10.6947ZM162.722 19.7203C162.722 23.2815 159.99 25.2331 156.404 25.2331C152.721 25.2331 149.988 23.2815 149.988 19.7203C149.988 16.1586 152.769 14.1342 156.404 14.1342C160.014 14.1342 162.722 16.1831 162.722 19.7203Z" fill="white"/>
                </svg>
            </a>
			<span class="nav-links">
			<a class="nav-links--list" href="<?php echo base_url('checklist/list'); ?>" >Listar</a>
			<a class="nav-links--create" href="<?php echo base_url('checklist/new'); ?>" >Criar</a>
			</span>
			<?php if (uri_string() !== 'checklist/new'): ?>
                <a class="nav-create" href="#" onclick="handleCreateChecklistClick(event)">Realizar Novo Checklist</a>
            <?php endif; ?>
        </nav>
    </header>
    <main>
