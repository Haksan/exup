let quizData = [];
let score = 0;
let answered = 0;

const dropArea = document.getElementById('drop-area');

// Obsługa Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => dropArea.addEventListener(e, (ev) => { ev.preventDefault(); ev.stopPropagation(); }, false));
dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
document.getElementById('file-input').addEventListener('change', (e) => handleFiles(e.target.files), false);

function handleFiles(files) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            let allQuestions = JSON.parse(content);
            const count = parseInt(document.getElementById('draw-count').value) || 30;
            
            // 1. Losowanie zestawu pytań z puli
            let selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
            
            // 2. Mieszanie kolejności odpowiedzi wewnątrz każdego pytania
            quizData = selectedQuestions.map(q => shuffleOptions(q));
            
            if (quizData.length > 0) startQuiz();
        } catch (err) { 
            alert("Błąd: Plik nie jest poprawnym formatem JSON lub ma błędy w strukturze!"); 
            console.error(err);
        }
    };
    reader.readAsText(files[0]);
}

// Funkcja tasująca odpowiedzi i aktualizująca indeksy poprawnych odpowiedzi
function shuffleOptions(question) {
    // Tworzymy tablicę obiektów {tekst, czyPoprawna}
    let optionsWithStatus = question.o.map((text, index) => {
        const isCorrect = Array.isArray(question.c) 
            ? question.c.includes(index) 
            : question.c === index;
        return { text, isCorrect };
    });

    // Tasujemy opcje
    optionsWithStatus.sort(() => Math.random() - 0.5);

    // Wyciągamy przetasowane teksty
    question.o = optionsWithStatus.map(opt => opt.text);

    // Aktualizujemy indeksy poprawnych odpowiedzi w polu 'c'
    if (question.type === "multiple") {
        question.c = optionsWithStatus
            .map((opt, index) => opt.isCorrect ? index : null)
            .filter(index => index !== null);
    } else {
        question.c = optionsWithStatus.findIndex(opt => opt.isCorrect);
    }

    return question;
}

function startQuiz() {
    document.getElementById('drop-zone').classList.add('hidden');
    document.getElementById('quiz-header').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('total-q').innerText = quizData.length;
    
    renderQuestions(); 
    
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError : false
        });
    }

    window.scrollTo(0,0);
}

function renderQuestions() {
    const root = document.getElementById('questions-root');
    root.innerHTML = "";
    
    quizData.forEach((q, idx) => {
        const isMulti = q.type === "multiple";
        const firstNewLineIndex = q.q.indexOf('\n');
        let titleText = q.q;
        let codeContent = "";

        if (firstNewLineIndex !== -1) {
            titleText = q.q.substring(0, firstNewLineIndex);
            codeContent = q.q.substring(firstNewLineIndex + 1).trim();
        }

        const card = document.createElement('div');
        card.className = 'q-card';
        card.innerHTML = `
            <div class="q-header-row">
                <span class="q-id-badge">ID: ${q.id || 'N/A'}</span>
                <span class="q-index-info">Zadanie ${idx + 1} ${isMulti ? '(Wielokrotny wybór)' : ''}</span>
            </div>
            
            <div class="q-title">${titleText}</div>
            
            ${codeContent ? `<pre class="q-code-wrapper"><code>${codeContent}</code></pre>` : ''}

            <div class="options" id="opts-${idx}">
                ${q.o.map((opt, oi) => `
                    <button class="option" onclick="handleSelect(${idx}, ${oi}, this)">${opt}</button>
                `).join('')}
            </div>

            ${isMulti ? `<button class="btn-check" id="check-${idx}" onclick="checkMulti(${idx})">Zatwierdź odpowiedź</button>` : ''}
            
            <div class="hint-box" id="hint-${idx}">💡 ${q.h}</div>
        `;
        root.appendChild(card);
    });
}

window.handleSelect = (qIdx, oIdx, btn) => {
    const q = quizData[qIdx];
    const container = document.getElementById(`opts-${qIdx}`);
    if (container.classList.contains('locked')) return;

    if (q.type === "multiple") {
        btn.classList.toggle('selected');
    } else {
        container.classList.add('locked');
        if (oIdx === q.c) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            const options = container.querySelectorAll('.option');
            if (options[q.c]) options[q.c].classList.add('correct');
        }
        finalize(qIdx);
    }
};

window.checkMulti = (qIdx) => {
    const q = quizData[qIdx];
    const container = document.getElementById(`opts-${qIdx}`);
    const checkBtn = document.getElementById(`check-${qIdx}`);
    
    if (container.classList.contains('locked')) return;

    const buttons = Array.from(container.querySelectorAll('.option'));
    const selectedIndices = buttons
        .map((btn, index) => btn.classList.contains('selected') ? index : null)
        .filter(index => index !== null)
        .sort();

    const correctIndices = (Array.isArray(q.c) ? [...q.c] : [q.c]).sort();
    const isCorrect = JSON.stringify(selectedIndices) === JSON.stringify(correctIndices);

    buttons.forEach((btn, i) => {
        const isSelected = btn.classList.contains('selected');
        const isRight = correctIndices.includes(i);
        if (isRight) btn.classList.add('correct');
        else if (isSelected) btn.classList.add('wrong');
    });

    if (isCorrect) score++;
    container.classList.add('locked');
    if (checkBtn) checkBtn.style.display = 'none';
    finalize(qIdx);
};

function finalize(qIdx) {
    answered++;
    document.getElementById('score').innerText = score;
    document.getElementById('current-q').innerText = answered;
    document.getElementById('progress-bar').style.width = (answered / quizData.length * 100) + "%";
    const hint = document.getElementById(`hint-${qIdx}`);
    if (hint) hint.style.display = 'block';
}