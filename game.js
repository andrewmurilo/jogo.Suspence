// Variáveis do jogo
let player = document.getElementById('player');
let enemy = document.getElementById('enemy');
let gameInfo = document.getElementById('game-info');
let chest = document.getElementById('chest');
let closet = document.getElementById('closet');
let key = document.getElementById('key');
let door = document.getElementById('door');

let playerSpeed = 5;
let enemySpeed = 2;

let playerPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let hasKey = false; // Variável para armazenar se o jogador pegou a chave
let isHiding = false; // Variável para saber se o jogador está escondido

// Movimentação do jogador
document.addEventListener('keydown', (event) => {
    if (!isHiding) {
        switch (event.key) {
            case 'ArrowUp':
                playerPosition.y -= playerSpeed;
                break;
            case 'ArrowDown':
                playerPosition.y += playerSpeed;
                break;
            case 'ArrowLeft':
                playerPosition.x -= playerSpeed;
                break;
            case 'ArrowRight':
                playerPosition.x += playerSpeed;
                break;
        }
    }
    updatePlayerPosition();
});

// Função para atualizar a posição do jogador
function updatePlayerPosition() {
    player.style.left = `${playerPosition.x}px`;
    player.style.top = `${playerPosition.y}px`;
}

// Função para pegar a chave
function pickUpKey() {
    if (isColliding(player, key)) {
        hasKey = true;
        key.style.display = 'none'; // A chave desaparece quando pega
        gameInfo.textContent = "Você pegou a chave!";
    }
}

// Função para abrir a porta
function openDoor() {
    if (isColliding(player, door) && hasKey) {
        gameInfo.textContent = "Você abriu a porta com a chave!";
        door.style.backgroundColor = '#228B22'; // Porta aberta (verde)
    } else if (isColliding(player, door) && !hasKey) {
        gameInfo.textContent = "Você precisa de uma chave para abrir a porta.";
    }
}

// Função para esconder-se no baú ou armário
function hideInObject(object) {
    if (isColliding(player, object)) {
        isHiding = true;
        gameInfo.textContent = "Você se escondeu!";
        setTimeout(() => {
            isHiding = false;
            gameInfo.textContent = "Você saiu do esconderijo!";
        }, 5000); // Ficar escondido por 5 segundos
    }
}

// Verificar colisões
function isColliding(obj1, obj2) {
    let rect1 = obj1.getBoundingClientRect();
    let rect2 = obj2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// Lógica de perseguição do inimigo
function moveEnemy() {
    let enemyPosition = enemy.getBoundingClientRect();
    let playerPositionRect = player.getBoundingClientRect();

    let deltaX = playerPositionRect.left - enemyPosition.left;
    let deltaY = playerPositionRect.top - enemyPosition.top;

    let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    let moveX = (deltaX / distance) * enemySpeed;
    let moveY = (deltaY / distance) * enemySpeed;

    enemy.style.left = `${enemy.offsetLeft + moveX}px`;
    enemy.style.top = `${enemy.offsetTop + moveY}px`;

    // Verificar se o inimigo "morreu" (encostou no jogador)
    if (distance < 50 && !isHiding) {
        gameInfo.textContent = "Você foi pego pelo inimigo!";
    }
}

// Atualiza a posição do inimigo periodicamente
setInterval(moveEnemy, 100);

// Detectar interações com objetos
document.querySelectorAll('.object').forEach(object => {
    object.addEventListener('click', () => {
        if (object.id === 'chest' || object.id === 'closet') {
            hideInObject(object);
        } else if (object.id === 'key') {
            pickUpKey();
        } else if (object.id === 'door') {
            openDoor();
        }
    });
});
