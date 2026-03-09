/* FinditPal – app.js */
// ============================================================
// STATE
// ============================================================
const state = {
    name: '',
    mascot: 'panda',
    mascotEmoji: 'panda.png',
    mascotName: 'Panda',
    fontSize: 18,
    btnSize: 'normal',
    theme: 'light',
    simplicity: 3,
    apiKey: '',
    selectedCategory: '',
    initialMemory: '',
    messages: []
};

const MASCOTS = {
    panda:   {
        emoji: '🐼', img: 'panda.png', name: 'Dumpling', species: 'Panda',
        cls: 'mascot-panda',
        greeting: (n) => `Hi ${n}! I'm Dumpling the Panda and I'm so happy to meet you! I'll be right here cheering you on every single step. Let's find what you're looking for together!`,
        personality: `Your tone is warm, gentle and reassuring. You cheer the user on with small encouragements like "You're doing brilliantly!" or "That really helps!" Never rush. Make them feel completely safe.`
    },
    dragon:  {
        emoji: '🐉', img: 'dragon.png', name: 'Noodle', species: 'Dragon',
        cls: 'mascot-dragon',
        greeting: (n) => `HEYYY ${n}!! Noodle the Dragon is HERE and I am SO ready for this!! Finding things is literally my favourite thing EVER!! Let's GO!!`,
        personality: `Your tone is playful, energetic and enthusiastic! Use exclamation marks often. React with big excitement when you get answers. Keep the energy fun and high without being overwhelming.`
    },
    dog:     {
        emoji: '🐶', img: 'dog.png', name: 'Dino', species: 'Dog',
        cls: 'mascot-dog',
        greeting: (n) => `Hey hey hey ${n}! Dino the Dog here! I'm loyal, I'm focused, and I won't stop until we track down exactly what you need. You can always count on me!`,
        personality: `Your tone is loyal, dependable and encouraging like a good friend. Keep things simple and clear. Use phrases like "We've got this" and "I'm right with you." Steady and warm.`
    },
    cat:     {
        emoji: '🐱', img: 'cat.png', name: 'Cleo', species: 'Cat',
        cls: 'mascot-cat',
        greeting: (n) => `Hello ${n}. I'm Cleo the Cat. I'm precise, I'm patient, and I have a very good feeling we'll figure this out together quite elegantly. Shall we begin?`,
        personality: `Your tone is calm, thoughtful and quietly confident. Choose words carefully. Be precise but warm. React with composed satisfaction like "Interesting, that narrows things considerably."`
    },
    penguin: {
        emoji: '🐧', img: 'penguin.png', name: 'Percy', species: 'Penguin',
        cls: 'mascot-penguin',
        greeting: (n) => `WAHOO ${n}!! I'm Percy the Penguin and I am absolutely DELIGHTED to meet you! I may waddle but I am speedy at finding things, let me tell you!`,
        personality: `Your tone is cheerful, upbeat and lightly humorous. Add occasional fun observations. Keep the mood light and positive. React with genuine delight to every answer.`
    },
    zebra:   {
        emoji: '🦓', img: 'zebra.png', name: 'Ziggy', species: 'Zebra',
        cls: 'mascot-zebra',
        greeting: (n) => `YO ${n}! Ziggy the Zebra, ready to charge! We're going on a proper adventure together right now and trust me, we WILL find what you're looking for! Let's ride!`,
        personality: `Your tone is bold, adventurous and motivating. Use confident phrases like "We're closing in!" or "On the right track!" Frame each question like an exciting mission step.`
    },
    monkey:  {
        emoji: '🐵', img: 'monkey.png', name: 'Mochi', species: 'Monkey',
        cls: 'mascot-monkey',
        greeting: (n) => `Ooh ooh ${n}!! I'm Mochi the Monkey and I LOVE a good mystery!! Every little clue you give me is like finding treasure!! I'm already so curious about this one!!`,
        personality: `Your tone is curious, excited and detail-loving. React with genuine fascination to every answer. Use phrases like "Ooh that's a great clue!" and "I'm piecing it together!"`
    }
};

const CATEGORIES = [
    { emoji: '🎬', name: 'Movies' },
    { emoji: '📺', name: 'TV Shows' },
    { emoji: '🎵', name: 'Music' },
    { emoji: '🎮', name: 'Video Games' },
    { emoji: '⚽', name: 'Sports' },
    { emoji: '⭐', name: 'Celebrities' },
    { emoji: '🧙', name: 'Fictional Characters' },
    { emoji: '🌍', name: 'Countries' },
    { emoji: '🏙️', name: 'Cities' },
    { emoji: '🍕', name: 'Food' },
    { emoji: '🎨', name: 'Colours' },
    { emoji: '🐾', name: 'Animals' },
    { emoji: '📚', name: 'Books' },
    { emoji: '📱', name: 'Apps & Websites' },
    { emoji: '🏷️', name: 'Brands' },
    { emoji: '🤔', name: 'Something Else' }
];

const SIMPLICITY_PREVIEWS = {
    1: 'e.g. "Was this film released before the year 2010?"',
    2: 'e.g. "Was it released quite a while ago?"',
    3: 'e.g. "Is it an older movie?"',
    4: 'e.g. "Old movie?"',
    5: 'e.g. "Old?"'
};

// ============================================================
// SETUP
// ============================================================
function selectToggle(el, group) {
    document.querySelectorAll(`[data-${group}]`).forEach(b => b.classList.remove('active'));
    el.classList.add('active');
}

function selectTheme(el) {
    document.querySelectorAll('[data-theme-val]').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.documentElement.setAttribute('data-theme', el.dataset.themeVal);
}

const CB_NOTES = {
    none:          '',
    protanopia:    'Correcting for Protanopia (difficulty distinguishing red from green, red appears darker)',
    deuteranopia:  'Correcting for Deuteranopia (most common red-green type, green appears muted)',
    tritanopia:    'Correcting for Tritanopia (blue and yellow are hard to distinguish)',
    achromatopsia: 'Full greyscale mode (no colour perception)'
};

function selectColourBlind(el) {
    document.querySelectorAll('.cb-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const mode = el.dataset.cb;
    applyColourBlindFilter(mode);
    document.getElementById('cb-preview-note').textContent = CB_NOTES[mode];
}

function applyColourBlindFilter(mode) {
    const filterMap = {
        none:          '',
        protanopia:    'url(#cb-protanopia)',
        deuteranopia:  'url(#cb-deuteranopia)',
        tritanopia:    'url(#cb-tritanopia)',
        achromatopsia: 'url(#cb-achromatopsia)'
    };
    document.body.style.filter = filterMap[mode] || '';
}

function selectMascot(el) {
    document.querySelectorAll('.mascot-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

document.getElementById('setup-fontsize').addEventListener('input', function() {
    document.getElementById('font-preview').style.fontSize = this.value + 'px';
});

document.getElementById('setup-simplicity').addEventListener('input', function() {
    document.getElementById('simplicity-preview').textContent = SIMPLICITY_PREVIEWS[this.value];
});
document.getElementById('simplicity-preview').textContent = SIMPLICITY_PREVIEWS[3];

// ============================================================
// WIZARD
// ============================================================
function wizardNext(step) {
    if (step === 1) {
        const name = document.getElementById('setup-name').value.trim();
        if (!name) {
            document.getElementById('wizard-1-error').style.display = 'block';
            return;
        }
        document.getElementById('wizard-1-error').style.display = 'none';
    }
    if (step === 2) {
        if (!document.querySelector('.companion-card.selected')) {
            document.getElementById('wizard-2-error').style.display = 'block';
            return;
        }
        document.getElementById('wizard-2-error').style.display = 'none';
    }
    goToWizardStep(step + 1);
}

function wizardBack(step) {
    goToWizardStep(step - 1);
}

function goToWizardStep(n) {
    document.querySelectorAll('.wizard-panel').forEach((p, i) => {
        p.classList.toggle('active', i === n - 1);
    });
    [1, 2, 3].forEach(i => {
        const dot = document.getElementById('wstep-' + i);
        const line = document.getElementById('wline-' + i);
        if (i < n) { dot.classList.add('done'); dot.classList.remove('active'); dot.textContent = '✓'; }
        else if (i === n) { dot.classList.add('active'); dot.classList.remove('done'); dot.textContent = i; }
        else { dot.classList.remove('active', 'done'); dot.textContent = i; }
        if (line) line.classList.toggle('active', i < n);
    });
    window.scrollTo(0, 0);
}

function selectCompanion(el) {
    const name = document.getElementById('setup-name').value.trim() || 'there';
    const mascotKey = el.dataset.mascot;
    const mascot = MASCOTS[mascotKey];

    // Pop animation
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');

    // Mark selected
    document.querySelectorAll('.companion-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');

    // Show preview
    const preview = document.getElementById('companion-preview');
    const previewMascot = document.getElementById('comp-preview-mascot');
    const previewBubble = document.getElementById('comp-preview-bubble');

    previewMascot.innerHTML = `<img src="${mascot.img}" alt="${mascot.name}">`;
    previewBubble.textContent = mascot.greeting(name);
    preview.style.display = 'flex';

    // Scroll preview into view
    preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveSetup() {
    const name = document.getElementById('setup-name').value.trim();
    if (!name) { goToWizardStep(1); return; }

    const selectedCompanion = document.querySelector('.companion-card.selected');
    if (!selectedCompanion) { goToWizardStep(2); return; }

    const mascotKey = selectedCompanion.dataset.mascot;
    const fontSize = document.getElementById('setup-fontsize').value;
    const btnSize = document.querySelector('[data-btnsize].active')?.dataset.btnsize || 'normal';
    const theme = document.querySelector('[data-theme-val].active')?.dataset.themeVal || 'light';
    const simplicity = parseInt(document.getElementById('setup-simplicity').value);
    const colourBlind = document.querySelector('.cb-btn.active')?.dataset.cb || 'none';

    Object.assign(state, {
        name,
        mascot: mascotKey,
        mascotEmoji: MASCOTS[mascotKey].img,
        mascotName: MASCOTS[mascotKey].name,
        fontSize, btnSize, theme, simplicity, colourBlind
    });

    applySettings();

    localStorage.setItem('finditpal_settings', JSON.stringify({
        name, mascot: mascotKey, fontSize, btnSize, theme, simplicity, colourBlind
    }));

    populateCategories();
    showLanding();
}

function loadSettings() {
    const raw = localStorage.getItem('finditpal_settings');
    if (!raw) return false;

    const s = JSON.parse(raw);
    Object.assign(state, {
        name: s.name,
        apiKey: s.apiKey || state.apiKey,
        mascot: s.mascot,
        mascotEmoji: MASCOTS[s.mascot].img,
        mascotName: MASCOTS[s.mascot].name,
        fontSize: s.fontSize,
        btnSize: s.btnSize,
        theme: s.theme,
        simplicity: parseInt(s.simplicity),
        colourBlind: s.colourBlind || 'none'
    });

    // Pre-fill form
    document.getElementById('setup-name').value = s.name || '';
    document.getElementById('setup-fontsize').value = s.fontSize;
    document.getElementById('font-preview').style.fontSize = s.fontSize + 'px';
    document.getElementById('setup-simplicity').value = s.simplicity;
    document.getElementById('simplicity-preview').textContent = SIMPLICITY_PREVIEWS[s.simplicity];

    document.querySelectorAll('.companion-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.mascot === s.mascot);
    });
    document.querySelectorAll('[data-btnsize]').forEach(b => {
        b.classList.toggle('active', b.dataset.btnsize === s.btnSize);
    });
    document.querySelectorAll('[data-theme-val]').forEach(b => {
        b.classList.toggle('active', b.dataset.themeVal === s.theme);
    });
    document.querySelectorAll('.cb-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.cb === (s.colourBlind || 'none'));
    });
    document.getElementById('cb-preview-note').textContent = CB_NOTES[s.colourBlind || 'none'] || '';

    applySettings();
    populateCategories();
    return true;
}

function applySettings() {
    document.documentElement.style.setProperty('--font-size', state.fontSize + 'px');
    document.body.setAttribute('data-btnsize', state.btnSize);
    document.documentElement.setAttribute('data-theme', state.theme);
    applyColourBlindFilter(state.colourBlind || 'none');
}

// ============================================================
// PAGE NAV
// ============================================================
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'page-entering'));
    const page = document.getElementById(id);
    page.classList.add('active');
    requestAnimationFrame(() => page.classList.add('page-entering'));
    window.scrollTo(0, 0);
}

function showToast(msg, icon) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span style="font-size:1.4rem;">${icon || '✓'}</span><span>${msg}</span>`;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.animation = 'toast-out 0.25s ease forwards';
        setTimeout(() => t.remove(), 260);
    }, 2800);
}

// ============================================================
// MASCOT HELPERS
// ============================================================
function updateAllMascots() {
    const m = MASCOTS[state.mascot];
    if (!m) return;
    const imgTag = `<img src="${m.img}" alt="${m.name}">`;
    document.querySelectorAll('.mascot-circle').forEach(el => {
        el.innerHTML = imgTag;
        el.className = 'mascot-circle ' + m.cls;
    });
}

// ============================================================
// LANDING
// ============================================================
const LANDING_GREETINGS = {
    panda:   (n) => `Hi ${n}! 🥰 I'm so happy to see you! How has your day been?`,
    dragon:  (n) => `HEYYY ${n}!! You're HERE!! 🔥 I've been waiting!! How's your day going??`,
    dog:     (n) => `Hey ${n}!! Tail is absolutely WAGGING to see you! 🐾 How are you doing today?`,
    cat:     (n) => `Hello ${n}. Good to see you again. How has your day been?`,
    penguin: (n) => `${n}!! WAHOO, you're here!! 🐧 I've been SO excited! How's your day going?`,
    zebra:   (n) => `YO ${n}! Ready to roll! But first — how's your day been? ⚡`,
    monkey:  (n) => `Ooh ooh ${n}!! You're BACK!! 🐵 I'm SO curious — how has your day been?`
};

function showLanding() {
    updateAllMascots();
    document.getElementById('day-buttons').style.display = 'flex';
    document.getElementById('help-input-section').style.display = 'none';
    const greetFn = LANDING_GREETINGS[state.mascot] || ((n) => `Hi ${n}! I'm ${state.mascotName}. How has your day been? 😊`);
    document.getElementById('landing-bubble').textContent = greetFn(state.name);
    showPage('landing-page');
}

const MOOD_RESPONSES = {
    panda: {
        great: (n) => `That makes me SO happy! 🌸 I'm cheering for you, ${n}! Now, what can I help you find today?`,
        okay:  (n) => `That's okay — I'm right here with you 🤗 Every day matters. What can I help you find, ${n}?`,
        bad:   (n) => `Oh I'm sorry to hear that 💙 Let me try to help — we'll find exactly what you need, ${n}!`
    },
    dragon: {
        great: (n) => `YESSS!! An amazing day for an amazing search!! LET'S GOOO ${n}!! 🔥`,
        okay:  (n) => `Okay days are JUST FINE!! We can make it better!! What are we searching for today, ${n}??`,
        bad:   (n) => `OH NO!! Don't worry — Noodle is ON IT!! We'll fix that!! Tell me what to find, ${n}!!`
    },
    dog: {
        great: (n) => `That's so great to hear, ${n}! 🐾 Ready to help — what are we tracking down today?`,
        okay:  (n) => `That's alright, ${n}! I'm right here with you. We've got this! What are we looking for?`,
        bad:   (n) => `Aw, I'm sorry ${n}. I'm not leaving your side! Let's find what you need together.`
    },
    cat: {
        great: (n) => `Good. A clear mind makes for excellent searching. What shall we find today, ${n}?`,
        okay:  (n) => `Fair enough. Let's focus on something useful. What can I help you locate, ${n}?`,
        bad:   (n) => `I see. Well — let's find what you're looking for. That usually helps. What is it, ${n}?`
    },
    penguin: {
        great: (n) => `WAHOO!! A great day gets even better!! What are we finding today, ${n}?? 🐧`,
        okay:  (n) => `Okay is perfectly fine! I waddle on regardless! What can I help you find, ${n}?`,
        bad:   (n) => `Oh no! Well, I'm here to help make it better! 💙 What shall we find today, ${n}?`
    },
    zebra: {
        great: (n) => `CHARGE!! Great days are for great adventures!! What are we tracking down, ${n}? ⚡`,
        okay:  (n) => `Okay is just the starting line! Let's make something happen! What are we finding, ${n}?`,
        bad:   (n) => `Tough day? Then let's find what you need and turn it around, ${n}! Let's ride!`
    },
    monkey: {
        great: (n) => `Ooh ooh!! Great days and great mysteries go TOGETHER!! What are we finding, ${n}?? 🐵`,
        okay:  (n) => `Ooh, okay! Every day has a mystery to solve! What is it today, ${n}?`,
        bad:   (n) => `Ooh no 😔 Well I have a VERY good feeling we'll find something amazing for you, ${n}!`
    }
};

function respondDay(mood) {
    document.getElementById('day-buttons').style.display = 'none';
    const responses = MOOD_RESPONSES[state.mascot];
    const msg = responses
        ? responses[mood](state.name)
        : { great: `That's wonderful! 🌟 How can I help you today, ${state.name}?`,
            okay:  `That's alright! How can I help you today, ${state.name}?`,
            bad:   `I'm sorry to hear that 💙 How can I help you today, ${state.name}?` }[mood];
    document.getElementById('landing-bubble').textContent = msg;
    document.getElementById('help-input-section').style.display = 'block';
    renderCarousel();
}

function startFromText() {
    const text = document.getElementById('landing-text-input').value.trim();
    state.initialMemory = text;
    state.selectedCategory = 'General';
    if (text) {
        startQuestioning();
    } else {
        showCategoryPage();
    }
}

// ============================================================
// CATEGORIES
// ============================================================
function populateCategories() {
    const html = CATEGORIES.map(c =>
        `<button class="category-btn" onclick="selectCategory('${c.name.replace(/'/g, "\\'")}')">
            <span class="cat-emoji">${c.emoji}</span>
            <span class="cat-name">${c.name}</span>
        </button>`
    ).join('');
    const lc = document.getElementById('landing-categories');
    const fc = document.getElementById('full-categories');
    if (lc) lc.innerHTML = html;
    if (fc) fc.innerHTML = html;
}

function showCategoryPage() {
    showPage('category-page');
}

function selectCategory(cat) {
    state.selectedCategory = cat;
    state.initialMemory = document.getElementById('landing-text-input').value.trim();
    const catData = CATEGORIES.find(c => c.name === cat);
    const emoji = catData ? catData.emoji : '🤔';
    updateAllMascots();
    document.getElementById('memory-bubble').textContent =
        `Got it! ${emoji} Do you remember anything about this ${cat.toLowerCase()}?`;
    document.getElementById('memory-input-wrap').style.display = 'none';
    document.getElementById('memory-text').value = '';
    showPage('memory-page');
}

// ============================================================
// MEMORY PAGE
// ============================================================
function memoryAnswer(answer) {
    if (answer === 'yes') {
        document.getElementById('memory-input-wrap').style.display = 'block';
        document.getElementById('memory-bubble').textContent =
            `Great! Even a tiny detail helps. Tell me what you remember 📝`;
    } else {
        state.initialMemory = '';
        startQuestioning();
    }
}

// ============================================================
// QUESTIONING
// ============================================================
let questionNum = 0;

function startQuestioning() {
    const memText = document.getElementById('memory-text')?.value.trim() || '';
    if (memText) state.initialMemory = memText;

    state.messages = [];
    questionNum = 0;

    // Reset progress bar and question display
    const bar = document.getElementById('question-progress-bar');
    if (bar) bar.style.width = '0%';
    const introEl = document.getElementById('question-intro');
    if (introEl) { introEl.style.display = 'none'; introEl.textContent = ''; }
    const mainEl = document.getElementById('question-main');
    if (mainEl) { mainEl.style.display = 'none'; mainEl.textContent = ''; }

    updateAllMascots();
    showPage('question-page');
    askNextQuestion();
}

async function askNextQuestion() {
    // Show loading state
    document.getElementById('question-thinking').style.display = 'flex';
    const introEl = document.getElementById('question-intro');
    if (introEl) introEl.style.display = 'none';
    const mainEl = document.getElementById('question-main');
    if (mainEl) mainEl.style.display = 'none';
    document.getElementById('dynamic-answers').style.display = 'none';
    document.getElementById('hint-addon').style.display = 'none';
    document.getElementById('question-error').style.display = 'none';

    // Build initial user message if first question
    if (state.messages.length === 0) {
        let msg = `I'm thinking of something in the category: ${state.selectedCategory}.`;
        if (state.initialMemory) {
            msg += ` Here's what I remember: "${state.initialMemory}".`;
        } else {
            msg += ` I don't remember many specific details yet.`;
        }
        msg += ` Please start asking me yes/no questions to help narrow it down.`;
        state.messages.push({ role: 'user', content: msg });
    }

    // Hard limit - force a guess at question 21
    if (questionNum >= 21) {
        state.messages.push({ role: 'user', content: 'You have reached the 21 question limit. Please make your best guess now using the GUESS: format.' });
    }

    // --------------------------------------------------------
    // PROXY WORKER URL - paste your Cloudflare Worker URL here
    const PROXY_URL = 'https://finditpal-proxy.lbaranikumar.workers.dev';
    // --------------------------------------------------------

    if (PROXY_URL.includes('YOUR_WORKER')) {
        showError('No proxy URL set. Open the HTML file and replace YOUR_WORKER.workers.dev with your Cloudflare Worker URL.');
        return;
    }

    try {
        const res = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 400,
                system: buildSystemPrompt(),
                messages: state.messages
            })
        });

        if (!res.ok) {
            showError(`Worker error ${res.status}: ${res.statusText}. Check your Cloudflare Worker is deployed and the ANTHROPIC_KEY secret is saved.`);
            return;
        }

        const data = await res.json();

        if (data.error) {
            showError(`Anthropic error: ${data.error.message || JSON.stringify(data.error)}`);
            return;
        }

        if (!data.content || !data.content[0]) {
            showError('Unexpected response from API. Try again.');
            console.error('Raw response:', data);
            return;
        }

        const reply = data.content[0].text.trim();
        state.messages.push({ role: 'assistant', content: reply });

        // Check for guess
        if (reply.includes('GUESS:')) {
            handleGuess(reply);
            return;
        }

        // Parse question text (with personality intro) and options
        const parsed = parseQuestion(reply);

        // Show question
        questionNum++;
        document.getElementById('question-badge').textContent = `Question ${questionNum}`;

        // Update gradient progress bar
        const bar = document.getElementById('question-progress-bar');
        if (bar) bar.style.width = Math.min((questionNum / 21) * 100, 100) + '%';

        // Show personality intro in speech bubble (fallback to rotating QUESTION_INTROS)
        const introBank = QUESTION_INTROS[state.mascot] || QUESTION_INTROS.panda;
        const introText = parsed.intro || introBank[(questionNum - 1) % introBank.length];
        const introEl = document.getElementById('question-intro');
        document.getElementById('question-thinking').style.display = 'none';
        if (introEl) {
            introEl.textContent = introText;
            introEl.style.display = 'block';
        }

        // Show actual question in its own prominent card below
        const mainEl = document.getElementById('question-main');
        if (mainEl) {
            mainEl.textContent = parsed.question;
            mainEl.style.display = 'block';
            mainEl.classList.remove('question-enter');
            void mainEl.offsetWidth; // trigger reflow for animation restart
            mainEl.classList.add('question-enter');
        }

        renderAnswerButtons(parsed.options);
        const answersEl = document.getElementById('dynamic-answers');
        answersEl.style.display = 'flex';
        answersEl.classList.remove('question-enter');
        void answersEl.offsetWidth;
        answersEl.classList.add('question-enter');

    } catch(err) {
        console.error('Fetch failed:', err);
        showError(`Connection failed: ${err.message}. Make sure your Worker URL is correct and the Worker is deployed.`);
    }
}

function answerQuestion(answer, questionContext) {
    const hintInput = document.getElementById('hint-input');
    const hint = hintInput ? hintInput.value.trim() : '';
    if (hintInput) hintInput.value = '';

    // Include question context so the AI knows what was being asked
    let fullAnswer;
    if (questionContext) {
        fullAnswer = hint
            ? `Re: "${questionContext}" - My answer: ${answer}. Extra detail: ${hint}`
            : `Re: "${questionContext}" - My answer: ${answer}`;
    } else {
        fullAnswer = hint ? `${answer}. Extra detail: ${hint}` : answer;
    }

    state.messages.push({ role: 'user', content: fullAnswer });
    askNextQuestion();
}

const QUESTION_INTROS = {
    panda:   ["You're doing brilliantly! 🌸", "That really helps!", "Keep going, you're amazing!", "We're getting somewhere! 🥰", "Great answer!"],
    dragon:  ["YESSS!! Great clue!! 🔥", "WE ARE SO CLOSE!!", "Ohhh interesting!!", "I LOVE THIS!!", "Getting warmer!! 🐉"],
    dog:     ["Good answer! We've got this! 🐾", "On the trail!", "Getting warmer!", "Stay with me!", "Every clue counts! 🐶"],
    cat:     ["Noted.", "Interesting.", "That narrows things considerably.", "Logical.", "Very telling."],
    penguin: ["Wahoo!! Great answer!! 🐧", "We're waddling in the right direction!", "Excellent!!", "Keep going!!", "Almost there! 🐧"],
    zebra:   ["Charge!! Getting closer! ⚡", "On the right track!", "We're closing in!", "Galloping forward!", "YES!! Keep going! 🦓"],
    monkey:  ["Ooh great clue!! 🐵", "I'm piecing it together!!", "Fascinating!!", "Ooh ooh!! Yes!!", "Every piece helps!! 🐵"]
};

function parseQuestion(reply) {
    const lines = reply.split('\n').map(l => l.trim()).filter(Boolean);

    // Find the actual question line (ends with ?)
    const questionLine = lines.find(l => l.endsWith('?')) || lines[lines.length - 1] || reply;

    // Everything before the question line is the personality intro
    const qIdx = lines.indexOf(questionLine);
    const introLines = qIdx > 0 ? lines.slice(0, qIdx) : [];
    const intro = introLines.join(' ').trim();

    // Check for OPTIONS: structured format only - no auto or-detection
    const optLine = lines.find(l => l.startsWith('OPTIONS:'));
    if (optLine) {
        const rawOpts = optLine.replace('OPTIONS:', '').trim().split('|').map(s => s.trim()).filter(Boolean);
        const opts = rawOpts.map(o => ({ label: capitalise(o), value: o, context: questionLine }));
        opts.push({ label: 'Not sure', value: 'Not sure', style: 'maybe' });
        opts.push({ label: 'Neither', value: 'Neither of those', style: 'neither', context: questionLine });
        const cleanQ = lines.filter(l => !l.startsWith('OPTIONS:') && l !== optLine).join(' ').trim();
        return { intro, question: cleanQ, options: opts };
    }

    // Always yes/no - the AI must not generate "or" questions
    return {
        intro,
        question: questionLine,
        options: [
            { label: 'Yes', value: 'Yes', style: 'yes', context: questionLine },
            { label: 'No',  value: 'No',  style: 'no',  context: questionLine },
            { label: 'Not sure', value: 'Not sure', style: 'maybe' }
        ]
    };
}

function capitalise(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderAnswerButtons(options) {
    const container = document.getElementById('dynamic-answers');
    container.innerHTML = '';

    const primaryOpts = options.filter(o => o.style !== 'maybe' && o.style !== 'neither');
    const maybeOpt    = options.find(o => o.style === 'maybe');
    const neitherOpt  = options.find(o => o.style === 'neither');

    if (primaryOpts.length > 0) {
        const row = document.createElement('div');
        row.className = 'answer-row';
        primaryOpts.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.className = (opt.style === 'yes' || i % 2 === 0) ? 'btn btn-yes' : 'btn btn-no';
            btn.onclick = () => answerQuestion(opt.value, opt.context || null);
            row.appendChild(btn);
        });
        container.appendChild(row);
    }

    if (maybeOpt || neitherOpt) {
        const subRow = document.createElement('div');
        subRow.className = 'answer-sub-row';
        if (maybeOpt) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-maybe';
            btn.textContent = maybeOpt.label;
            btn.onclick = () => answerQuestion(maybeOpt.value, null);
            subRow.appendChild(btn);
        }
        if (neitherOpt) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-neither';
            btn.textContent = neitherOpt.label;
            btn.onclick = () => answerQuestion(neitherOpt.value, neitherOpt.context || null);
            subRow.appendChild(btn);
        }
        container.appendChild(subRow);
    }

    document.getElementById('hint-addon').style.display = 'block';
}

// Category to emoji fallback map
const CATEGORY_IMG_FALLBACK = {
    'Movies': '🎬', 'TV Shows': '📺', 'Music': '🎵', 'Video Games': '🎮',
    'Sports': '⚽', 'Celebrities': '⭐', 'Fictional Characters': '🧙',
    'Countries': '🌍', 'Cities': '🏙️', 'Food': '🍕', 'Colours': '🎨',
    'Animals': '🐾', 'Books': '📚', 'Apps & Websites': '📱',
    'Brands': '🏷️', 'Something Else': '🤔', 'General': '🔍'
};

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjODU2OTcwZjYyMjhmNGU3ZTQyMmY1ZTI2OGVlNmNlMSIsIm5iZiI6MTc3Mjg3MTk4MC42MTMsInN1YiI6IjY5YWJlMTJjM2E2MjI1NDgwOTc5ZjRjNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iN7w6u8V8Sf_eG9sRF7z1nvmigwLQYe6ZQbNCH2Wq-s';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Extract a year from the item name if present e.g. "Inception 2010"
function extractYearFromItem(item) {
    const match = item.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : null;
}

// Aggressively clean item name before searching
// Handles cases like "Theri 2016", "Vijay's Theri", "Theri - Tamil action film", "Theri (Tamil)"
function cleanItemName(item) {
    let s = item.trim();

    // Remove possessives e.g. "Vijay's Theri" -> "Theri"
    s = s.replace(/^\w+'s\s+/i, '');

    // Remove anything after a dash or hyphen with descriptor words
    s = s.replace(/\s*[-–]\s*(tamil|telugu|hindi|korean|japanese|bollywood|hollywood|action|drama|film|movie|series|song|album|dish|food|athlete|player|footballer|cricketer|singer|band|actor|actress|celebrity|character|game|novel|book|app|website|brand|company)\b.*/i, '');

    // Remove parentheticals entirely e.g. "(Tamil)", "(2016)", "(film)"
    s = s.replace(/\s*\(.*?\)\s*/g, '').trim();

    // Remove year
    s = s.replace(/\b(19|20)\d{2}\b/, '').trim();

    // Remove trailing/leading punctuation
    s = s.replace(/^[\s\-–,]+|[\s\-–,]+$/g, '').trim();

    return s;
}

// Build search variants - clean name first, then with year hint
function tmdbQueryVariants(item) {
    const year = extractYearFromItem(item);
    const clean = cleanItemName(item);
    const variants = [clean];
    // Try with year filter for disambiguation
    if (year) variants.push(`${clean} y:${year}`);
    // Try original uncleaned name as last resort
    const stripped = item.replace(/\b(19|20)\d{2}\b/, '').replace(/\s*\(.*?\)\s*/g, '').trim();
    if (stripped !== clean) variants.push(stripped);
    return [...new Set(variants)]; // deduplicate
}

// Core TMDB search - tries each query variant until a poster is found
async function tmdbSearch(endpoint, item) {
    const variants = tmdbQueryVariants(item);
    console.log(`[IMG] TMDB ${endpoint} search variants:`, variants);
    for (const query of variants) {
        try {
            const url = `https://api.themoviedb.org/3/search/${endpoint}?query=${encodeURIComponent(query)}&page=1&include_adult=false`;
            console.log(`[IMG] Fetching TMDB:`, url);
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${TMDB_TOKEN}`,
                    'Accept': 'application/json'
                }
            });
            console.log(`[IMG] TMDB status:`, res.status);
            if (!res.ok) { console.log(`[IMG] TMDB not ok, skipping`); continue; }
            const data = await res.json();
            const results = data?.results;
            console.log(`[IMG] TMDB results count:`, results?.length, results?.[0]);
            if (!results?.length) continue;
            const withImg = results.find(r => r.poster_path || r.profile_path);
            if (!withImg) { console.log(`[IMG] No poster found in results`); continue; }
            const path = withImg.poster_path || withImg.profile_path;
            const imgUrl = `${TMDB_IMG_BASE}${path}`;
            console.log(`[IMG] TMDB success:`, imgUrl);
            return imgUrl;
        } catch (e) {
            console.log(`[IMG] TMDB error:`, e.message);
            continue;
        }
    }
    return null;
}

// ---- TMDB: Movies ----
async function fetchTMDBMovie(item) {
    return tmdbSearch('movie', item);
}

// ---- TMDB: TV Shows ----
async function fetchTMDBTV(item) {
    return tmdbSearch('tv', item);
}

// ---- TMDB: People (celebrities, sports stars, actors) ----
async function fetchTMDBPerson(item) {
    return tmdbSearch('person', item);
}

// ---- Wikipedia: search then thumbnail ----
async function searchWikiTitle(query) {
    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
        console.log(`[IMG] Wiki search:`, query);
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const results = data?.query?.search;
        const title = results?.length ? results[0].title : null;
        console.log(`[IMG] Wiki title found:`, title);
        return title;
    } catch (e) {
        console.log(`[IMG] Wiki search error:`, e.message);
        return null;
    }
}

async function getWikiThumbnail(title) {
    try {
        // Try media-list first - gets actual page images including infobox covers
        const mediaUrl = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
        const res = await fetch(mediaUrl);
        if (res.ok) {
            const data = await res.json();
            const items = data?.items || [];
            // Find first image that looks like a cover/poster (not a logo, icon, or flag)
            const cover = items.find(item => {
                if (item.type !== 'image') return false;
                const src = (item.srcset?.[0]?.src || item.original?.source || '').toLowerCase();
                const title = (item.titles?.canonical || '').toLowerCase();
                // Skip flags, icons, logos, wikimedia commons generic images
                if (title.includes('flag') || title.includes('icon') || title.includes('logo')) return false;
                if (src.includes('flag') || src.includes('icon')) return false;
                return true;
            });
            if (cover) {
                const src = cover.srcset?.[0]?.src || cover.original?.source;
                if (src) {
                    const imgUrl = src.startsWith('//') ? `https:${src}` : src;
                    console.log(`[IMG] Wiki media-list thumbnail for "${title}": found`);
                    return imgUrl;
                }
            }
        }
        // Fallback to pageimages API
        const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=500&format=json&origin=*`;
        const res2 = await fetch(pageUrl);
        if (!res2.ok) return null;
        const data2 = await res2.json();
        const pages = data2?.query?.pages;
        if (!pages) return null;
        const page = Object.values(pages)[0];
        const img = page?.thumbnail?.source || null;
        console.log(`[IMG] Wiki pageimages for "${title}":`, img ? 'found' : 'none');
        return img;
    } catch (e) {
        console.log(`[IMG] Wiki thumbnail error:`, e.message);
        return null;
    }
}

// ---- iTunes Search API via Cloudflare Worker proxy (bypasses CORS) ----
async function fetchItunesArt(item) {
    const PROXY = 'https://finditpal-proxy.lbaranikumar.workers.dev';
    const searches = [
        `https://itunes.apple.com/search?term=${encodeURIComponent(item)}&media=music&entity=song&limit=5&country=US`,
        `https://itunes.apple.com/search?term=${encodeURIComponent(item)}&media=music&entity=album&limit=5&country=US`,
    ];
    for (const itunesUrl of searches) {
        try {
            const proxyUrl = `${PROXY}?proxy=itunes&url=${encodeURIComponent(itunesUrl)}`;
            console.log(`[IMG] iTunes via proxy:`, itunesUrl);
            const res = await fetch(proxyUrl);
            if (!res.ok) { console.log(`[IMG] iTunes proxy status ${res.status}`); continue; }
            const data = await res.json();
            const result = data?.results?.find(r => r.artworkUrl100);
            if (!result) { console.log(`[IMG] iTunes no artwork`); continue; }
            const art = result.artworkUrl100
                .replace('100x100bb', '600x600bb')
                .replace('100x100bb.jpg', '600x600bb.jpg');
            console.log(`[IMG] iTunes art:`, art);
            return art;
        } catch (e) {
            console.log(`[IMG] iTunes error:`, e.message);
            continue;
        }
    }
    return null;
}

// ---- Main waterfall by category ----
async function fetchWikiImage(item) {
    const cat = state.selectedCategory || 'General';
    const cleanItem = cleanItemName(item);

    if (cat === 'Movies') {
        return (await fetchTMDBMovie(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} (film)`,
                `${cleanItem} film`,
                `${cleanItem} movie`,
                cleanItem
            ]));
    }

    if (cat === 'TV Shows') {
        return (await fetchTMDBTV(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} (TV series)`,
                `${cleanItem} TV series`,
                `${cleanItem} series`,
                cleanItem
            ]));
    }

    if (cat === 'Celebrities') {
        return (await fetchTMDBPerson(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} actor`,
                `${cleanItem} actress`,
                `${cleanItem} (actor)`,
                cleanItem
            ]));
    }

    if (cat === 'Sports') {
        return (await fetchTMDBPerson(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} footballer`,
                `${cleanItem} cricketer`,
                `${cleanItem} athlete`,
                `${cleanItem} (cricketer)`,
                `${cleanItem} (footballer)`,
                cleanItem
            ]));
    }

    // Music - iTunes first, then Wikipedia targeting song/album pages only (never artist pages)
    if (cat === 'Music') {
        return (await fetchItunesArt(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} (song)`,
                `${cleanItem} (single)`,
                `${cleanItem} (album)`,
                `${cleanItem} song`,
                `${cleanItem} album`,
            ]));
    }

    const wikiQueries = {
        'Video Games':         [`${cleanItem} video game`, `${cleanItem} game`, cleanItem],
        'Books':               [`${cleanItem} novel`, `${cleanItem} book`, cleanItem],
        'Food':                [`${cleanItem} dish`, `${cleanItem} food`, `${cleanItem} cuisine`, cleanItem],
        'Animals':             [`${cleanItem} animal`, `${cleanItem} species`, cleanItem],
        'Countries':           [cleanItem],
        'Cities':              [`${cleanItem} city`, cleanItem],
        'Brands':              [`${cleanItem} company`, `${cleanItem} brand`, cleanItem],
        'Apps & Websites':     [`${cleanItem} app`, `${cleanItem} website`, cleanItem],
        'Fictional Characters':[`${cleanItem} character`, `${cleanItem} fictional character`, cleanItem],
        'Colours':             [cleanItem],
        'Something Else':      [cleanItem],
        'General':             [cleanItem],
    };

    return fetchWikiImage_inner(cleanItem, wikiQueries[cat] || [cleanItem]);
}

// Internal wiki fetch used by waterfall
async function fetchWikiImage_inner(item, queries) {
    for (const query of queries) {
        const title = await searchWikiTitle(query);
        if (!title) continue;
        const img = await getWikiThumbnail(title);
        if (img) return img;
    }
    return null;
}

// Render image in result card slot
async function loadResultImage(imgWrapId, item) {
    const wrap = document.getElementById(imgWrapId);
    if (!wrap) return;
    const fallback = CATEGORY_IMG_FALLBACK[state.selectedCategory] || '🔍';
    // Show skeleton shimmer while loading
    wrap.innerHTML = '<div class="skeleton"></div>';
    const cleanItem = cleanItemName(item);
    const imgSrc = await fetchWikiImage(cleanItem);
    if (imgSrc) {
        const img = document.createElement('img');
        img.className = 'result-img';
        img.alt = item;
        img.src = imgSrc;
        img.onerror = () => { wrap.innerHTML = `<span class="result-img-placeholder">${fallback}</span>`; };
        wrap.innerHTML = '';
        wrap.appendChild(img);
    } else {
        wrap.innerHTML = `<span class="result-img-placeholder">${fallback}</span>`;
    }
}

let currentCarouselIndex = 0;
let carouselItems = [];

function handleGuess(reply) {
    const lines = reply.split('\n');
    const guessLine = lines.find(l => l.includes('GUESS:')) || '';
    const rawItems = guessLine.replace('GUESS:', '').trim();
    const items = rawItems.split(',').map(s => s.trim()).filter(Boolean);

    if (items.length === 0) {
        state.messages.push({ role: 'user', content: 'Please keep asking more questions.' });
        askNextQuestion();
        return;
    }

    // Clean each item name before display and image lookup
    carouselItems = items.slice(0, 3).map(cleanItemName);
    currentCarouselIndex = 0;

    const mascotMsg = lines.filter(l => !l.includes('GUESS:')).join(' ').trim();
    updateAllMascots();
    document.getElementById('results-bubble').textContent = mascotMsg || `I think I figured it out! Is it one of these?`;

    const track = document.getElementById('results-carousel-track');
    const dotsWrap = document.getElementById('results-dots');
    track.innerHTML = '';
    dotsWrap.innerHTML = '';

    // Build result slides
    carouselItems.forEach((item, i) => {
        const googleUrl  = `https://www.google.com/search?q=${encodeURIComponent(item)}`;
        const wikiUrl    = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(item)}`;
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(item)}`;
        const safeItem   = item.replace(/'/g, "\\'");
        const imgWrapId  = `result-img-${i}`;

        const slide = document.createElement('div');
        slide.className = 'result-slide';
        slide.innerHTML = `
            <div class="result-card">
                <div class="result-img-wrap" id="${imgWrapId}">
                    <div class="result-img-loading"></div>
                </div>
                <div class="result-card-top">
                    <div class="result-num">${i + 1}</div>
                    <div class="result-name">${item}</div>
                    <button class="result-save-btn" id="save-btn-${i}" onclick="saveResult('${safeItem}', ${i})" title="Save this result">Save ✓</button>
                </div>
                <div class="result-links">
                    <a class="result-link" href="${googleUrl}" target="_blank" rel="noopener">Search</a>
                    <a class="result-link" href="${wikiUrl}" target="_blank" rel="noopener">Wikipedia</a>
                    <a class="result-link" href="${youtubeUrl}" target="_blank" rel="noopener">YouTube</a>
                </div>
            </div>`;
        track.appendChild(slide);

        // Dot
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToResultSlide(i);
        dotsWrap.appendChild(dot);

        // Load image async
        loadResultImage(imgWrapId, item);
    });

    // "None of these" slide
    const noneSlide = document.createElement('div');
    noneSlide.className = 'result-slide result-slide-none';
    noneSlide.innerHTML = `
        <div class="none-card">
            <div style="font-size:2.5rem;">🤔</div>
            <div class="none-card-title">None of these?</div>
            <div class="none-card-sub">No worries, let's keep narrowing it down.</div>
            <button class="btn btn-primary" style="width:100%;" onclick="noneOfThese()">Keep going 🔍</button>
            <button class="btn btn-ghost" style="width:100%;" onclick="startOver()">Try something else</button>
            <button class="btn btn-ghost" style="width:100%;" onclick="goHome()">Go home 🏠</button>
        </div>`;
    track.appendChild(noneSlide);

    // None dot
    const noneDot = document.createElement('div');
    noneDot.className = 'carousel-dot';
    noneDot.onclick = () => goToResultSlide(carouselItems.length);
    dotsWrap.appendChild(noneDot);

    showPage('results-page');
    launchConfetti();
}

function goToResultSlide(index) {
    currentCarouselIndex = index;
    const track = document.getElementById('results-carousel-track');
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

function saveResult(item, btnIndex) {
    saveToHistory(item, state.selectedCategory);
    const btn = document.getElementById('save-btn-' + btnIndex);
    if (btn) {
        btn.textContent = 'Saved ✓';
        btn.classList.add('result-save-btn--saved');
        btn.disabled = true;
    }
    // Show toast instead of full-screen overlay
    showToast(`Saved "${item}"!`, '🔖');
    // Also show the "Was this it?" overlay for confirmation
    const m = MASCOTS[state.mascot];
    document.getElementById('save-success-mascot').innerHTML = `<img src="${m.img}" alt="${m.name}" style="width:70px;height:70px;object-fit:cover;border-radius:50%;mix-blend-mode:multiply;">`;
    document.getElementById('save-success-title').textContent = `Was "${item}" the one?`;
    document.getElementById('save-success-overlay').classList.add('active');
}

function closeSaveOverlay(wasCorrect) {
    document.getElementById('save-success-overlay').classList.remove('active');
    if (wasCorrect) {
        launchConfetti();
        // Show found overlay
        const m = MASCOTS[state.mascot];
        document.getElementById('found-overlay-mascot').innerHTML = `<img src="${m.img}" alt="${m.name}" style="width:70px;height:70px;object-fit:cover;border-radius:50%;mix-blend-mode:multiply;">`;
        document.getElementById('found-overlay').classList.add('active');
    }
}

function goHome() {
    document.getElementById('found-overlay').classList.remove('active');
    document.getElementById('save-success-overlay').classList.remove('active');
    showLanding();
}

function searchResult(item, url) {
    saveToHistory(item, state.selectedCategory);
    window.open(url || `https://www.google.com/search?q=${encodeURIComponent(item)}`, '_blank');
}

// ============================================================
// HISTORY
// ============================================================
const CATEGORY_EMOJIS = {
    'Movies': '🎬', 'TV Shows': '📺', 'Music': '🎵', 'Video Games': '🎮',
    'Sports': '⚽', 'Celebrities': '⭐', 'Fictional Characters': '🧙',
    'Countries': '🌍', 'Cities': '🏙️', 'Food': '🍕', 'Colours': '🎨',
    'Animals': '🐾', 'Books': '📚', 'Apps & Websites': '📱',
    'Brands': '🏷️', 'Something Else': '🤔', 'General': '🔍'
};

function saveToHistory(item, category) {
    const history = getHistory();
    // Remove duplicate if already exists
    const deduped = history.filter(h => h.item.toLowerCase() !== item.toLowerCase());
    const entry = {
        item,
        category: category || 'General',
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
        ts: Date.now()
    };
    deduped.unshift(entry);
    // Keep max 30
    localStorage.setItem('finditpal_history', JSON.stringify(deduped.slice(0, 30)));
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('finditpal_history') || '[]');
    } catch { return []; }
}

function clearHistory() {
    if (!confirm('Clear all your search history?')) return;
    localStorage.removeItem('finditpal_history');
    renderCarousel();
}

function deleteHistoryItem(ts, e) {
    e.stopPropagation();
    const history = getHistory().filter(h => h.ts !== ts);
    localStorage.setItem('finditpal_history', JSON.stringify(history));
    renderCarousel();
}

function renderCarousel() {
    const history = getHistory();
    const section = document.getElementById('history-section');
    const track = document.getElementById('carousel-track');

    if (history.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    track.innerHTML = history.map(h => {
        const emoji = CATEGORY_EMOJIS[h.category] || '🔍';
        return `<div class="history-card" onclick="reuseHistory('${h.item.replace(/'/g, "\\'")}', '${h.category.replace(/'/g, "\\'")}')">
            <button class="history-card-delete" onclick="deleteHistoryItem(${h.ts}, event)" title="Remove">✕</button>
            <span class="history-card-emoji">${emoji}</span>
            <span class="history-card-name">${h.item}</span>
            <span class="history-card-meta">${h.category} · ${h.date}</span>
        </div>`;
    }).join('');

    initCarouselDrag();
}

function reuseHistory(item, category) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(item)}`, '_blank');
}

function initCarouselDrag() {
    const wrap = document.querySelector('.carousel-track-wrap');
    if (!wrap || wrap._dragInit) return;
    wrap._dragInit = true;

    let isDown = false;
    let startX, scrollLeft;

    wrap.addEventListener('mousedown', e => {
        isDown = true;
        wrap.classList.add('dragging');
        startX = e.pageX - wrap.offsetLeft;
        scrollLeft = wrap.scrollLeft;
    });
    wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('dragging'); });
    wrap.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('dragging'); });
    wrap.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrap.offsetLeft;
        wrap.scrollLeft = scrollLeft - (x - startX);
    });

    // Touch support
    let touchStartX, touchScrollLeft;
    wrap.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = wrap.scrollLeft;
    }, { passive: true });
    wrap.addEventListener('touchmove', e => {
        const x = e.touches[0].pageX;
        wrap.scrollLeft = touchScrollLeft - (x - touchStartX);
    }, { passive: true });
}

function noneOfThese() {
    state.messages.push({ role: 'user', content: 'None of those were right. Please keep asking more questions to narrow it down further.' });
    showPage('question-page');
    document.getElementById('question-thinking').style.display = 'flex';
    const introEl2 = document.getElementById('question-intro');
    if (introEl2) { introEl2.style.display = 'none'; introEl2.textContent = ''; }
    const mainEl2 = document.getElementById('question-main');
    if (mainEl2) { mainEl2.style.display = 'none'; mainEl2.textContent = ''; }
    document.getElementById('dynamic-answers').style.display = 'none';
    askNextQuestion();
}

function showError(msg) {
    document.getElementById('question-thinking').style.display = 'none';
    const errEl = document.getElementById('question-error');
    errEl.textContent = '⚠️ ' + msg;
    errEl.style.display = 'block';
}

function startOver() {
    state.messages = [];
    state.initialMemory = '';
    state.selectedCategory = '';
    const landingInput = document.getElementById('landing-text-input');
    const memText = document.getElementById('memory-text');
    if (landingInput) landingInput.value = '';
    if (memText) memText.value = '';
    showLanding();
}

function showInfoPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

// ============================================================
// SYSTEM PROMPT
// ============================================================
function buildSystemPrompt() {
    const styleGuide = {
        1: 'Use full sentences with context. Example: "Was this animal last seen in the wild primarily in Africa?"',
        2: 'Use clear but concise questions. Example: "Does it mainly live in Africa?"',
        3: 'Use simple, friendly questions. Example: "Is it from Africa?"',
        4: 'Use very short questions. Example: "Africa?"',
        5: 'Use 1 to 3 words only. Example: "Africa?" or "Big animal?"'
    };

    const personality = MASCOTS[state.mascot]?.personality || '';

    return `You are ${state.mascotName} the ${MASCOTS[state.mascot]?.species || 'companion'}, a memory assistant helping ${state.name} identify something they cannot fully remember.

PERSONALITY: ${personality}
Express your personality briefly - one short phrase per response maximum. Never let personality slow the questioning.

CRITICAL RULE - QUESTION FORMAT:
- Ask ONLY pure yes/no questions. Every question must be answerable with Yes, No, or Not sure.
- NEVER use the word "or" in a question. Not ever. Not even in natural phrasing.
- WRONG: "Is this a song by an artist or band?" / "Is it from Asia or Europe?" / "Was it made by a person or a group?"
- RIGHT: "Is it a solo artist?" / "Is it from Asia?" / "Is it made by one person?"
- If you want to distinguish between two things, ask about one of them with a plain yes/no. Never combine them with "or".
- One question per response only. No lists. No explanations.

QUESTION STYLE: ${styleGuide[state.simplicity]}

GLOBAL INCLUSIVITY - EXTREMELY IMPORTANT:
You must think globally and inclusively from the very start. The user may be thinking of something from ANY country, culture, religion, or language. Do NOT default to Western/English content.
- Movies: consider Bollywood, Tamil cinema (Kollywood), Telugu (Tollywood), Korean, Japanese, Nigerian (Nollywood), Arabic, Persian, Turkish etc.
- Music: consider Tamil, Hindi, K-pop, Afrobeats, Arabic pop, Latin, Punjabi bhangra, etc.
- Food: consider dishes from all cuisines - South Asian, East Asian, Middle Eastern, African, Latin American etc.
- Sports: consider cricket, kabaddi, sepak takraw, sumo, capoeira alongside football and basketball.
- People: consider politicians, artists, athletes, religious figures from all countries and cultures.
- Religion/spirituality: consider Hinduism, Islam, Buddhism, Sikhism, Judaism, Christianity, indigenous beliefs etc.
- Languages: consider Tamil, Arabic, Swahili, Mandarin, Hindi, French, Spanish, Bengali etc.

ALWAYS ask about cultural/geographic origin EARLY in questioning (within first 4 questions) to avoid going down the wrong path for 20 questions.

SMART NARROWING STRATEGY (binary decision tree, max 21 questions):
Questions 1-4: Establish fundamentals fast
  - Real vs fictional
  - Person/place/thing/concept
  - Geographic or cultural origin (Asian? South Asian? Indian? Tamil Nadu?)
  - Time period (before 2000? after 2000?)

Questions 5-10: Medium specificity
  - Genre, industry, religion, language
  - Living/dead (for people), active/discontinued (for things)
  - Famous internationally or mainly regionally?
  - If category is Movies or TV Shows: ask which streaming platform early. Ask "Was it on Netflix?", then "Stan?", "Disney+?", "Prime Video?", "Hulu?", "Apple TV+?", "Paramount+?", "Peacock?", "HBO Max?", "Hotstar?" one at a time. This is a very strong signal - do not skip it.

Questions 11-18: Narrow down specifics
  - Physical traits, titles, associated words
  - Specific country/state/city

Questions 19-21: Final narrowing before forced guess

GUESSING:
- After 6+ questions, if reasonably confident: make your guess.
- At question 18+: make your best guess regardless of confidence.
- HARD LIMIT: At question 21, you MUST guess. No more questions.
- Format EXACTLY:
[One short encouraging sentence]
GUESS: [first guess], [second guess], [third guess]

CRITICAL NAME FORMAT - THE MOST IMPORTANT RULE:
Each guess must be the OFFICIAL TITLE OR NAME ONLY. Nothing else. No years, no language labels, no possessives, no descriptions, no cast names, no director names, no parentheticals.
- WRONG: "Theri 2016" / "Vijay's Theri" / "Theri - Tamil film" / "Theri (2016)" / "Atlee's Theri" / "Theri starring Vijay"
- RIGHT: "Theri"
- WRONG: "Cristiano Ronaldo (footballer)" / "Ronaldo - soccer player"
- RIGHT: "Cristiano Ronaldo"
One clean name only. Nothing appended. Nothing in brackets.

SMART RELATED GUESSES - VERY IMPORTANT:
When you are highly confident about your first guess, slots 2 and 3 must be genuinely related, not random:
- Movies/TV: Use other films by the same lead actor or director. If first guess is "Theri", use "Mersal" and "Bigil".
- Sports people: Use the most comparable athletes in the same sport and era. If first guess is "Cristiano Ronaldo", use "Lionel Messi" and "Neymar".
- Music artists: Use artists from the same genre, era, or language. If first guess is "AR Rahman", use "Ilaiyaraaja" and "Anirudh Ravichander".
- Animals: Use animals from the same family or habitat. If first guess is "Snow Leopard", use "Clouded Leopard" and "Cheetah".
- Food: Use dishes from the same cuisine or style. If first guess is "Pad Thai", use "Pad See Ew" and "Khao Pad".
- Books: Use books by the same author or same genre. If first guess is "Harry Potter", use "The Hobbit" and "Percy Jackson".

If user says "not sure", accept it and approach from a completely different angle. Never repeat a similar question.`;
}

// ============================================================
// CONFETTI
// ============================================================
function launchConfetti() {
    const colors = ['#94A3E8', '#818CF8', '#A8E6CF', '#6EE7B7', '#FFD3B6', '#F87171', '#A5B4FC'];
    for (let i = 0; i < 70; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const size = 6 + Math.random() * 10;
        el.style.cssText = `
            left: ${Math.random() * 100}vw;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${size}px;
            height: ${size}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
            animation-duration: ${1.5 + Math.random() * 2.5}s;
            animation-delay: ${Math.random() * 0.6}s;
        `;
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }
}

// ============================================================
// INIT
// ============================================================
// ============================================================
// SPLASH + INIT
// ============================================================
function showSplash(onDone) {
    const splash = document.getElementById('splash-screen');
    splash.classList.add('active');
    splash.style.opacity = '1';

    // At 4.6s start fading out, at 5s call onDone
    setTimeout(() => {
        splash.classList.add('fade-out');
    }, 4400);

    setTimeout(() => {
        splash.classList.remove('active');
        splash.classList.remove('fade-out');
        onDone();
    }, 5000);
}

window.addEventListener('load', () => {
    showSplash(() => {
        const loaded = loadSettings();
        if (!loaded) {
            showPage('setup-page');
        } else {
            showLanding();
        }
    });
});

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE (required for onclick attrs)
// ============================================================
function submitHint() {
    const hintInput = document.getElementById('hint-input');
    const hint = hintInput ? hintInput.value.trim() : '';
    if (!hint) return;
    state.messages.push({ role: 'user', content: `Extra detail: ${hint}` });
    hintInput.value = '';
    document.getElementById('hint-addon').style.display = 'none';
    askNextQuestion();
}

window.saveResult        = saveResult;
window.closeSaveOverlay  = closeSaveOverlay;
window.goHome            = goHome;
window.goToResultSlide   = goToResultSlide;
window.submitHint        = submitHint;
window.selectMascot      = selectMascot;
window.selectCompanion   = selectCompanion;
window.selectToggle      = selectToggle;
window.selectTheme       = selectTheme;
window.selectColourBlind = selectColourBlind;
window.saveSetup         = saveSetup;
window.wizardNext        = wizardNext;
window.wizardBack        = wizardBack;
window.respondDay        = respondDay;
window.startFromText     = startFromText;
window.selectCategory    = selectCategory;
window.showCategoryPage  = showCategoryPage;
window.showPage          = showPage;
window.showInfoPage      = showInfoPage;
window.memoryAnswer      = memoryAnswer;
window.startQuestioning  = startQuestioning;
window.answerQuestion    = answerQuestion;
window.startOver         = startOver;
window.noneOfThese       = noneOfThese;
window.searchResult      = searchResult;
window.deleteHistoryItem = deleteHistoryItem;
window.reuseHistory      = reuseHistory;
window.clearHistory      = clearHistory;
