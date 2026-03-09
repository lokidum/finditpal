// ============================================================
// FinditPal Session Logger
// Captures questions, answers, and outcomes for debugging.
// Include BEFORE app.js: <script src="logger.js"></script>
// Download logs at any time by calling: FIPLogger.download()
// ============================================================

const FIPLogger = (() => {
    let sessions = [];
    let current = null;

    function startSession(category, mascot, initialMemory) {
        current = {
            id: Date.now(),
            startedAt: new Date().toISOString(),
            category,
            mascot,
            initialMemory: initialMemory || '',
            questions: [],
            outcome: null,
            endedAt: null,
        };
        sessions.push(current);
        console.log(`[LOG] Session started — category: ${category}, mascot: ${mascot}`);
    }

    function logQuestion(questionNum, questionText, introText) {
        if (!current) return;
        current.questions.push({
            num: questionNum,
            question: questionText,
            intro: introText || '',
            answer: null,
            hint: null,
            timestamp: new Date().toISOString(),
        });
    }

    function logAnswer(answer, hint) {
        if (!current || !current.questions.length) return;
        const last = current.questions[current.questions.length - 1];
        last.answer = answer;
        last.hint = hint || null;
        console.log(`[LOG] Q${last.num}: "${last.question}" → "${answer}"${hint ? ` (hint: "${hint}")` : ''}`);
    }

    function logGuess(guesses, wasCorrect, correctItem) {
        if (!current) return;
        current.outcome = {
            type: 'guess',
            guesses,
            wasCorrect: wasCorrect ?? null,
            correctItem: correctItem || null,
            timestamp: new Date().toISOString(),
        };
        current.endedAt = new Date().toISOString();
        console.log(`[LOG] Guess: ${guesses.join(', ')} | Correct: ${wasCorrect} | Answer: ${correctItem || 'unknown'}`);
    }

    function logImageLoad(itemName, source, imageUrl, success) {
        if (!current) return;
        if (!current.imageLoads) current.imageLoads = [];
        current.imageLoads.push({
            item: itemName,
            source,       // 'tmdb' | 'wiki' | 'itunes' | 'fallback'
            url: imageUrl || null,
            success,
            timestamp: new Date().toISOString(),
        });
        console.log(`[LOG] Image [${source}] for "${itemName}": ${success ? imageUrl : 'FAILED'}`);
    }

    function logStartOver() {
        if (current && !current.endedAt) {
            current.outcome = { type: 'abandoned', timestamp: new Date().toISOString() };
            current.endedAt = new Date().toISOString();
        }
    }

    function getSummary() {
        return sessions.map(s => ({
            id: s.id,
            startedAt: s.startedAt,
            category: s.category,
            mascot: s.mascot,
            totalQuestions: s.questions.length,
            outcome: s.outcome,
        }));
    }

    function getFullLogs() {
        return JSON.parse(JSON.stringify(sessions)); // deep copy
    }

    function download() {
        const data = getFullLogs();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finditpal-log-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('[LOG] Download triggered —', data.length, 'session(s)');
    }

    function printReadable() {
        const sessions = getFullLogs();
        let out = '';
        sessions.forEach((s, si) => {
            out += `\n${'='.repeat(60)}\nSESSION ${si + 1} — ${s.category} | ${s.mascot} | ${s.startedAt}\n`;
            if (s.initialMemory) out += `Initial memory: "${s.initialMemory}"\n`;
            out += `${'─'.repeat(60)}\n`;
            s.questions.forEach(q => {
                out += `Q${q.num}: ${q.question}\n`;
                if (q.intro) out += `  [intro] ${q.intro}\n`;
                out += `  → ${q.answer || '(no answer logged)'}`;
                if (q.hint) out += ` + hint: "${q.hint}"`;
                out += `\n`;
            });
            out += `${'─'.repeat(60)}\n`;
            if (s.outcome) {
                if (s.outcome.type === 'guess') {
                    out += `GUESSES: ${s.outcome.guesses?.join(', ') || 'none'}\n`;
                    out += `CORRECT: ${s.outcome.wasCorrect ?? 'unknown'}\n`;
                    if (s.outcome.correctItem) out += `ACTUAL ANSWER: ${s.outcome.correctItem}\n`;
                } else {
                    out += `OUTCOME: ${s.outcome.type}\n`;
                }
            }
            if (s.imageLoads?.length) {
                out += `\nIMAGE LOADS:\n`;
                s.imageLoads.forEach(img => {
                    out += `  ${img.success ? '✓' : '✗'} [${img.source}] "${img.item}" → ${img.url || 'none'}\n`;
                });
            }
            out += '\n';
        });
        console.log(out);
        return out;
    }

    return { startSession, logQuestion, logAnswer, logGuess, logImageLoad, logStartOver, getSummary, getFullLogs, download, printReadable };
})();

window.FIPLogger = FIPLogger;
