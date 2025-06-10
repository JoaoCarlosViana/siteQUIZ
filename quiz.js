
const perguntas = document.querySelectorAll('.pergunta');
let perguntaAtual = 0;         
let pontos = 0;                
let tempoResposta;            
let timeoutFeedback;         
let bloqueado = false;        
let timer;                    
// Soma o total de pontos possíveis no quiz
let totalPossivel = Array.from(perguntas).reduce((total, pergunta) => {
    return total + (parseInt(pergunta.getAttribute('data-pontos')) || 0);
}, 0);


// Função principal para iniciar o quiz
function iniciarQuiz() {
    timer = new Date(); // Marca o tempo de início

    mostrarPergunta();  // Mostra a primeira pergunta
}


// Exibe a pergunta atual na tela
function mostrarPergunta() {
    
    perguntas.forEach((q, i) => {
        q.classList.remove('visivel');
    });

    // Aguarda um pequeno tempo para resetar a visibilidade
    setTimeout(() => {
        
        perguntas.forEach((q, i) => {
            if (i !== perguntaAtual) q.style.display = 'none';
        });

        const pergunta = perguntas[perguntaAtual];
        pergunta.style.display = 'block'; 

        //animação CSS
        requestAnimationFrame(() => {
            pergunta.classList.add('visivel');
        });

        bloqueado = false;

        // Inicia o temporizador para responder
        tempoResposta = setTimeout(() => {
            mostrarFeedback(-1);
        }, 30000);
    }, 200);
}


// Mostra o feedback visual após resposta ou tempo
function mostrarFeedback(respostaSelecionada) {
    clearTimeout(tempoResposta); 
    bloqueado = true;            

    const pergunta = perguntas[perguntaAtual];
    const opcoes = pergunta.querySelectorAll('.option');
    const correta = parseInt(pergunta.getAttribute('data-resposta'));

    // Marca as opções corretas/incorretas com cor e desativa clique
    opcoes.forEach((opcao, index) => {
        opcao.classList.remove('correta', 'incorreta');

        if (index === correta) {
            opcao.classList.add('correta');
        } else {
            opcao.classList.add('incorreta');
        }

        opcao.style.pointerEvents = 'none';
    });

    
    if (respostaSelecionada === correta) {
        const valor = parseInt(pergunta.getAttribute('data-pontos')) || 0;
        pontos += valor;
    }

    // Aguarda 5 segundos antes de ir para a próxima pergunta
    timeoutFeedback = setTimeout(() => {
        perguntaAtual++;
        if (perguntaAtual < perguntas.length) {
            mostrarPergunta();
        } else {
            mostrarResultado();
        }
    }, 3000);
}


// Exibe a tela final com a pontuação e tempo total
function mostrarResultado() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    const taimerfim = new Date();
    const taimertotal = Math.floor((taimerfim - timer) / 1000);
    const minutos = Math.floor(taimertotal / 60);
    const segundos = taimertotal % 60;

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('resultado-final');

    resultadoDiv.innerHTML = 
        `<h2 class="question">Quiz finalizado!</h2>
        <p class="resultado">Sua pontuação foi: ${pontos} de ${totalPossivel}</p>
        <p class="resultado">Tempo total: ${minutos}m ${segundos}s</p>
        <a href="index.html" class="option"><div class="questao">Voltar ao menu</div></a>`;

    container.appendChild(resultadoDiv);

    // Aplica a animaçãoda da tela final
    setTimeout(() => {
        resultadoDiv.classList.add('visivel');
    }, 10);
}


// Espera o DOM estar carregado para ativar os eventos
document.addEventListener("DOMContentLoaded", () => {
    // Adiciona clique em cada alternativa do quiz
    document.querySelectorAll('.option').forEach((option) => {
        option.addEventListener('click', function () {
            if (bloqueado) return;

            const perguntaContainer = this.closest('.pergunta');
            if (!perguntaContainer || perguntaContainer.style.display === 'none') return;

            const opcoes = Array.from(perguntaContainer.querySelectorAll('.option'));
            const idx = opcoes.indexOf(this); // Descobre o índice da opção clicada

            mostrarFeedback(idx);
        });
    });

    iniciarQuiz(); // Começa o quiz automaticamente
});
