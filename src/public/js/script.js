
// tela de login frontend
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    console.log("Tentando logar com:", email, senha);

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('token', data.token); // Armazena token JWT
            window.location.href = '/pages/dashboard.html'; // Redireciona após login
        } else {
            alert(data.error || 'Erro ao fazer login.');
        }

    } catch (err) {
        console.error('Erro na requisição:', err);
        alert('Erro ao conectar com o servidor.');
    }
});
