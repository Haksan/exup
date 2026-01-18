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
            // KLUCZOWA ZMIANA: Odczytujemy plik jako czysty tekst JSON
            const content = e.target.result;
            const allQuestions = JSON.parse(content);
            
            const count = parseInt(document.getElementById('draw-count').value) || 30;
            
            // Losowanie i przycinanie do wybranej liczby pytań
            quizData = allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
            
            if (quizData.length > 0) startQuiz();
        } catch (err) { 
            alert("Błąd: Plik nie jest poprawnym formatem JSON lub ma błędy w strukturze!"); 
            console.error(err);
        }
    };
    reader.readAsText(files[0]);
}

function startQuiz() {
    document.getElementById('drop-zone').classList.add('hidden');
    document.getElementById('quiz-header').classList.remove('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    document.getElementById('total-q').innerText = quizData.length;
    
    renderQuestions(); 
    

    renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError : false
    });

    window.scrollTo(0,0);
}

function renderQuestions() {
    const root = document.getElementById('questions-root');
    root.innerHTML = "";
    
    quizData.forEach((q, idx) => {
        // Rozdzielamy tekst na tytuł i kod
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
                <span class="q-index-info">Zadanie ${idx + 1}</span>
            </div>
            
            <div class="q-title">${titleText}</div>
            
            ${codeContent ? `<pre class="q-code-wrapper"><code>${codeContent}</code></pre>` : ''}

            <div class="options" id="opts-${idx}">
                ${q.o.map((opt, oi) => `
                    <button class="option" onclick="handleSelect(${idx}, ${oi}, this)">${opt}</button>
                `).join('')}
            </div>
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
            container.querySelectorAll('.option')[q.c].classList.add('correct');
        }
        finalize(qIdx);
    }
};

window.checkMulti = (qIdx) => {
    const q = quizData[qIdx];
    const container = document.getElementById(`opts-${qIdx}`);
    if (container.classList.contains('locked')) return;

    const selected = Array.from(container.querySelectorAll('.option.selected')).map(b => 
        Array.from(container.querySelectorAll('.option')).indexOf(b)
    ).sort();
    
    const correct = Array.isArray(q.c) ? [...q.c].sort() : [q.c];
    const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);

    container.querySelectorAll('.option').forEach((btn, i) => {
        if (correct.includes(i)) btn.classList.add('correct');
        else if (selected.includes(i)) btn.classList.add('wrong');
    });

    if (isCorrect) score++;
    container.classList.add('locked');
    document.getElementById(`check-${qIdx}`).style.display = 'none';
    finalize(qIdx);
};

function finalize(qIdx) {
    answered++;
    document.getElementById('score').innerText = score;
    document.getElementById('current-q').innerText = answered;
    document.getElementById('progress-bar').style.width = (answered / quizData.length * 100) + "%";
    document.getElementById(`hint-${qIdx}`).style.display = 'block';
}