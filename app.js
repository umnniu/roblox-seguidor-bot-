document.getElementById('bot-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const cookies = document.getElementById('cookies').value.split('\n').map(cookie => cookie.trim());

    if (!username || cookies.length === 0) {
        alert("Preencha todos os campos.");
        return;
    }

    document.getElementById('status').innerText = "Iniciando...";

    fetch(`https://api.roblox.com/users/get-by-username?username=${username}`)
        .then(response => response.json())
        .then(data => {
            const userId = data.Id;
            followUser(cookies, userId);
        })
        .catch(error => {
            document.getElementById('status').innerText = "Erro ao pegar ID do usuário.";
            console.error(error);
        });
});

function followUser(cookies, userId) {
    cookies.forEach(cookie => {
        const headers = {
            "Cookie": `.ROBLOSECURITY=${cookie}`,
            "X-CSRF-TOKEN": ""
        };

        fetch('https://auth.roblox.com/v2/logout', { method: 'POST', headers })
            .then(response => {
                const csrfToken = response.headers.get('x-csrf-token');
                headers['X-CSRF-TOKEN'] = csrfToken;
                return fetch(`https://friends.roblox.com/v1/users/${userId}/follow`, { method: 'POST', headers });
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('status').innerText = `Seguidor adicionado com sucesso!`;
            })
            .catch(error => {
                document.getElementById('status').innerText = "Erro ao seguir usuário.";
                console.error(error);
            });
    });
}