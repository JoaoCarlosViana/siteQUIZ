let currentQuestionIndex = 0;
let score = 0;
let totalTimeSpent = 0;
let timer;
let groupName = '';
let questionStartTime;

const loginSection = document.querySelector('.login');
const quizContainer = document.getElementById('quiz-container');
const startQuizButton = document.getElementById('start-quiz');
const usernameInput = document.getElementById('username');
const questions = document.querySelectorAll('.pergunta');

// Esconde o quiz inicialmente
quizContainer.style.display = 'none';

// Event listener para o botão de iniciar quiz
startQuizButton.addEventListener('click', () => {
    groupName = usernameInput.value.trim();
    if (groupName) {
        loginSection.style.display = 'none';
        quizContainer.style.display = 'block';
        showQuestion(currentQuestionIndex);
    } else {
        alert('Por favor, informe o nome do grupo para começar o quiz.');
    }
});

// Event listener para pressionar Enter no campo de nome
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startQuizButton.click();
    }
});

function showQuestion(index) {
    // Esconde todas as perguntas
    questions.forEach((question) => {
        question.classList.remove('pergunta-visivel');
        question.style.display = 'none';
    });

    if (index < questions.length) {
        const currentQuestion = questions[index];
        currentQuestion.style.display = 'block';
        currentQuestion.classList.add('pergunta-visivel');
        
        // Remove timer anterior se existir
        const existingTimer = currentQuestion.querySelector('.timer-display');
        if (existingTimer) {
            existingTimer.remove();
        }
        
        // Remove classes de resposta anterior
        const options = currentQuestion.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('correta', 'incorreta');
            option.style.pointerEvents = 'auto';
        });
        
        questionStartTime = Date.now();
        startTimer();
    } else {
        showResults();
    }
}

function startTimer() {
    let timeLeft = 60;
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer-display');
    timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;

    const currentQuestion = questions[currentQuestionIndex];
    currentQuestion.insertBefore(timerDisplay, currentQuestion.firstChild);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Tempo restante: ${timeLeft}s`;
        
        // Adiciona classe de aviso quando restam 10 segundos
        if (timeLeft <= 10) {
            timerDisplay.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
            totalTimeSpent += timeSpent;
            
            // Desabilita as opções quando o tempo acaba
            const options = currentQuestion.querySelectorAll('.option');
            options.forEach(opt => opt.style.pointerEvents = 'none');
            
            // Mostra a resposta correta
            const correctAnswerIndex = parseInt(currentQuestion.dataset.resposta);
            options[correctAnswerIndex].classList.add('correta');
            
            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }, 2000);
        }
    }, 1000);
}

// Adiciona event listeners para as opções de resposta
questions.forEach((question, qIndex) => {
    const options = question.querySelectorAll('.option');
    options.forEach((option, oIndex) => {
        option.addEventListener('click', () => {
            clearInterval(timer);
            const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
            totalTimeSpent += timeSpent;

            const correctAnswerIndex = parseInt(question.dataset.resposta);
            const points = parseInt(question.dataset.pontos);

            if (oIndex === correctAnswerIndex) {
                score += points;
                option.classList.add('correta');
            } else {
                option.classList.add('incorreta');
                options[correctAnswerIndex].classList.add('correta');
            }

            // Desabilita as opções após a resposta
            options.forEach(opt => opt.style.pointerEvents = 'none');

            setTimeout(() => {
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            }, 2000);
        });
    });
});

function showResults() {
    const totalPossiblePoints = Array.from(questions).reduce((total, question) => {
        return total + parseInt(question.dataset.pontos);
    }, 0);
    
    const percentage = Math.round((score / totalPossiblePoints) * 100);
    
    quizContainer.innerHTML = `
        <div class="resultado-final visivel">
            <h1 class="question">🎉 Quiz Finalizado! 🎉</h1>
            <div class="resultado-container">
                <p class="resultado"><strong>Grupo:</strong> ${groupName}</p>
                <p class="resultado"><strong>Pontuação:</strong> ${score} de ${totalPossiblePoints} pontos (${percentage}%)</p>
                <p class="resultado"><strong>Tempo total:</strong> ${Math.floor(totalTimeSpent / 60)}min ${totalTimeSpent % 60}s</p>
                <p class="resultado performance">${getPerformanceMessage(percentage)}</p>
            </div>
           <a href = "index.html"> <button class="restart-btn">Voltar ao Menu</button> </a>
        </div>
    `;
}

function getPerformanceMessage(percentage) {
    if (percentage >= 90) return "🏆 Excelente! Vocês dominam o assunto!";
    if (percentage >= 70) return "👏 Muito bom! Bom conhecimento sobre o tema!";
    if (percentage >= 50) return "👍 Razoável! Continuem estudando!";
    return "📚 Precisam estudar mais sobre o assunto!";
}

