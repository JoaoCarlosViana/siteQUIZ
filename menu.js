
/*
document.addEventListener("DOMContentLoaded", () => {
    // Lista com os IDs ou nomes dos quizzes
    const quizzes = [
        { id: 'psico', botao: 'pscg.html' },
        { id: 'odonto', botao: 'odnt.html' },
        { id: 'pedago', botao: 'pedgia.html' }
    ];

    quizzes.forEach(q => {
        const jaFeito = localStorage.getItem(`quizFeito_${q.id}`);
        const botoes = document.querySelectorAll(`a[href="${q.botao}"]`);
        
        botoes.forEach(botao => {
            if (jaFeito) {
                botao.textContent = 'JÁ FEITO';
                botao.classList.add('bloqueado');
                botao.style.pointerEvents = 'none';
                botao.style.opacity = '0.5';
            } else {
                // Ao clicar, registra como feito
                botao.addEventListener('click', () => {
                    localStorage.setItem(`quizFeito_${q.id}`, 'true');
                });
            }
        });
    });
});
*/
