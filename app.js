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
    if (typeof setMascotCircleVariant === 'function') setMascotCircleVariant(state.mascot);
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
    document.getElementById('landing-page').classList.remove('landing-expanded');
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
    document.getElementById('landing-page').classList.add('landing-expanded');
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
    state.researchDone = false;
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
    if (window.FIPLogger) FIPLogger.startSession(state.selectedCategory, state.mascot, state.initialMemory);
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
    const jogCard = document.getElementById('memory-jog');
    if (jogCard) jogCard.style.display = 'none';

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

    // Soft prompt after 30 questions to encourage a guess, but don't force it
    if (questionNum >= 30 && questionNum % 5 === 0) {
        state.messages.push({ role: 'user', content: 'We\'ve been going a while — if you have a strong feeling, make your best guess now. Otherwise keep asking!' });
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

        // Check for RESEARCH request - AI wants to look up a Wikipedia article
        if (reply.includes('RESEARCH:') && !state.researchDone) {
            const researchMatch = reply.match(/RESEARCH:\s*(.+)/);
            if (researchMatch) {
                const query = researchMatch[1].trim();
                console.log(`[RESEARCH] AI requested lookup: "${query}"`);

                // Show a brief bubble note while fetching
                const introElR = document.getElementById('question-intro');
                document.getElementById('question-thinking').style.display = 'flex';
                if (introElR) introElR.style.display = 'none';

                const result = await getWikiResearchSummary(query);
                state.researchDone = true; // only one research lookup per session

                if (result) {
                    state.messages.push({
                        role: 'user',
                        content: `RESEARCH RESULTS for "${result.title}":\n${result.text}\n\nNow use this information to continue narrowing down the answer. Resume with your next question.`
                    });
                    console.log(`[RESEARCH] Injected article: "${result.title}"`);
                } else {
                    state.messages.push({
                        role: 'user',
                        content: `Research unavailable for that query. Please continue with what you know.`
                    });
                }
                askNextQuestion();
                return;
            }
        }

        // Parse question text (with personality intro) and options
        const parsed = parseQuestion(reply);

        // Show question
        questionNum++;
        document.getElementById('question-badge').textContent = `Question ${questionNum}`;

        // Update gradient progress bar
        const bar = document.getElementById('question-progress-bar');
        // Progress bar fills over ~21 questions but keeps pulsing after that
        const barPct = Math.min((questionNum / 21) * 100, 95);
        if (bar) bar.style.width = barPct + '%';

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

        // Log question to session logger
        if (window.FIPLogger) FIPLogger.logQuestion(questionNum, parsed.question, introText);

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

    if (window.FIPLogger) FIPLogger.logAnswer(answer, hint);
    state.messages.push({ role: 'user', content: fullAnswer });

    // Mid-session memory jog pause after the 10th question is answered
    if (questionNum === 10) {
        showMemoryJog();
        return;
    }

    askNextQuestion();
}

function showMemoryJog() {
    const card = document.getElementById('memory-jog');
    if (!card) { askNextQuestion(); return; }
    // Hide active question UI
    document.getElementById('question-main').style.display = 'none';
    document.getElementById('dynamic-answers').style.display = 'none';
    document.getElementById('hint-addon').style.display = 'none';
    document.getElementById('question-thinking').style.display = 'none';
    const introEl = document.getElementById('question-intro');
    if (introEl) introEl.style.display = 'none';
    // Show jog card with entrance animation
    card.style.display = 'block';
    card.classList.remove('question-enter');
    void card.offsetWidth;
    card.classList.add('question-enter');
    const jogInput = document.getElementById('memory-jog-input');
    if (jogInput) { jogInput.value = ''; jogInput.focus(); }
}

function submitMemoryJog() {
    const input = document.getElementById('memory-jog-input');
    const text = input ? input.value.trim() : '';
    const card = document.getElementById('memory-jog');
    if (card) card.style.display = 'none';
    if (text) {
        state.messages.push({ role: 'user', content: `New detail that just came to mind: "${text}"` });
        if (window.FIPLogger) FIPLogger.logAnswer('[memory-jog]', text);
    }
    // Restore thinking state before next question
    document.getElementById('question-thinking').style.display = 'flex';
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

// Score how well a TMDB result title matches our search term (0-1)
function tmdbTitleScore(result, targetClean) {
    const t = (result.title || result.name || result.original_title || result.original_name || '').toLowerCase().trim();
    const target = targetClean.toLowerCase().trim();
    if (t === target) return 1.0;
    if (t.startsWith(target) || target.startsWith(t)) return 0.85;
    // Count shared words
    const tWords = new Set(t.split(/\s+/));
    const targetWords = target.split(/\s+/);
    const shared = targetWords.filter(w => tWords.has(w)).length;
    return shared / Math.max(targetWords.length, tWords.size);
}

// Core TMDB search - picks best title match rather than just first result
async function tmdbSearch(endpoint, item) {
    const variants = tmdbQueryVariants(item);
    const targetClean = cleanItemName(item);
    console.log(`[IMG] TMDB ${endpoint} search variants:`, variants, '| target:', targetClean);
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
            console.log(`[IMG] TMDB results count:`, results?.length);
            if (!results?.length) continue;

            // Score all results with a poster by title similarity, pick best match
            const withImg = results.filter(r => r.poster_path || r.profile_path);
            if (!withImg.length) { console.log(`[IMG] No poster found in results`); continue; }

            const scored = withImg.map(r => ({ r, score: tmdbTitleScore(r, targetClean) }));
            scored.sort((a, b) => b.score - a.score);
            const best = scored[0];
            console.log(`[IMG] TMDB best match: "${best.r.title || best.r.name}" score=${best.score.toFixed(2)}`);

            const path = best.r.poster_path || best.r.profile_path;
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
// ---- TVMaze: fictional characters from TV shows ----
// Free, no auth, CORS-friendly. Returns character portraits.
async function fetchTVMazeCharacter(name) {
    try {
        const url = `https://api.tvmaze.com/search/characters?q=${encodeURIComponent(name)}`;
        console.log(`[IMG] TVMaze character search:`, name);
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (!data?.length) return null;
        // Pick best match: exact or closest name, must have an image
        const withImg = data.filter(r => r.character?.image?.original || r.character?.image?.medium);
        if (!withImg.length) return null;
        const target = name.toLowerCase();
        const best = withImg.find(r => (r.character?.name || '').toLowerCase() === target) || withImg[0];
        const img = best.character?.image?.original || best.character?.image?.medium;
        console.log(`[IMG] TVMaze found: "${best.character?.name}" →`, img);
        return img || null;
    } catch (e) {
        console.log(`[IMG] TVMaze error:`, e.message);
        return null;
    }
}

// ---- AniList: anime / manga characters ----
// Free GraphQL API, CORS-friendly.
async function fetchAniListCharacter(name) {
    try {
        console.log(`[IMG] AniList character search:`, name);
        const query = `query($name:String){Character(search:$name){image{large}name{full}}}`;
        const res = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query, variables: { name } })
        });
        if (!res.ok) return null;
        const data = await res.json();
        const img = data?.data?.Character?.image?.large;
        const fullName = data?.data?.Character?.name?.full;
        if (img) console.log(`[IMG] AniList found: "${fullName}" →`, img);
        return img || null;
    } catch (e) {
        console.log(`[IMG] AniList error:`, e.message);
        return null;
    }
}

// ---- Wikipedia: research summary for mid-game context injection ----
// Returns a plain-text summary of the most relevant Wikipedia article for a query.
// Used by the RESEARCH tool so the AI can look up squads, casts, rosters, etc.
async function getWikiResearchSummary(query) {
    try {
        console.log(`[RESEARCH] Searching Wikipedia for: "${query}"`);
        // Step 1: find the best article title
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=3&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        if (!searchRes.ok) return null;
        const searchData = await searchRes.json();
        const hits = searchData?.query?.search;
        if (!hits?.length) return null;

        // Pick the hit whose title most closely matches the query
        const target = query.toLowerCase();
        const best = hits.reduce((a, b) =>
            b.title.toLowerCase().includes(target) && !a.title.toLowerCase().includes(target) ? b : a
        , hits[0]);

        // Step 2: get the article extract (first ~2000 chars of article text)
        const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(best.title)}&prop=extracts&exintro=true&explaintext=true&exsectionformat=plain&format=json&origin=*`;
        const extractRes = await fetch(extractUrl);
        if (!extractRes.ok) return null;
        const extractData = await extractRes.json();
        const pages = extractData?.query?.pages;
        if (!pages) return null;
        const page = Object.values(pages)[0];
        const extract = page?.extract;
        if (!extract) return null;

        // Trim to ~2000 chars so it fits in context without inflating token cost
        const trimmed = extract.length > 2000 ? extract.slice(0, 2000) + '…' : extract;
        console.log(`[RESEARCH] Got article "${best.title}" (${trimmed.length} chars)`);
        return { title: best.title, text: trimmed };
    } catch (e) {
        console.log(`[RESEARCH] Error:`, e.message);
        return null;
    }
}

// Titles to skip — list/aggregate pages never have useful single-item images
const BAD_WIKI_TITLE = /^(list of|characters of|cast of|episodes of|index of|glossary of|outline of)/i;

// ---- Wikipedia: search then thumbnail ----
// skipLists=true fetches more candidates and filters aggregate pages
async function searchWikiTitle(query, skipLists = false) {
    try {
        const limit = skipLists ? 5 : 2;
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}&format=json&origin=*`;
        console.log(`[IMG] Wiki search:`, query);
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const results = data?.query?.search;
        if (!results?.length) return null;
        // Always skip list/aggregate articles — they return show promos not item images
        const good = results.find(r => !BAD_WIKI_TITLE.test(r.title));
        const title = (good || results[0]).title;
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
                const canonicalTitle = (item.titles?.canonical || '').toLowerCase();
                // Skip flags, icons, logos, SVGs (usually diagrams/badges), edit buttons
                if (canonicalTitle.includes('flag') || canonicalTitle.includes('icon') || canonicalTitle.includes('logo')) return false;
                if (src.includes('flag') || src.includes('icon') || src.includes('.svg')) return false;
                // Skip Wikimedia Commons generic/placeholder images
                if (src.includes('question_book') || src.includes('ambox') || src.includes('edit-clear')) return false;
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
            ], true));
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
            ], true));
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

    // Fictional Characters — TVMaze (TV), AniList (anime), then Wikipedia disambiguation
    if (cat === 'Fictional Characters') {
        return (await fetchTVMazeCharacter(cleanItem))
            || (await fetchAniListCharacter(cleanItem))
            || (await fetchWikiImage_inner(cleanItem, [
                `${cleanItem} (character)`,
                `${cleanItem} (comics)`,
                `${cleanItem} (DC Comics)`,
                `${cleanItem} (Marvel Comics)`,
                `${cleanItem} (anime)`,
                `${cleanItem} (manga)`,
                `${cleanItem} (film character)`,
                `${cleanItem} (fictional character)`,
                cleanItem,
            ], true)); // skipLists=true — never use "List of..." for a character image
    }

    const wikiQueries = {
        'Video Games':     [`${cleanItem} video game`, `${cleanItem} game`, cleanItem],
        'Books':           [`${cleanItem} novel`, `${cleanItem} book`, cleanItem],
        'Food':            [`${cleanItem} dish`, `${cleanItem} food`, `${cleanItem} cuisine`, cleanItem],
        'Animals':         [`${cleanItem} animal`, `${cleanItem} species`, cleanItem],
        'Countries':       [cleanItem],
        'Cities':          [`${cleanItem} city`, cleanItem],
        'Brands':          [`${cleanItem} company`, `${cleanItem} brand`, cleanItem],
        'Apps & Websites': [`${cleanItem} app`, `${cleanItem} website`, cleanItem],
        'Colours':         [cleanItem],
        'Something Else':  [cleanItem],
        'General':         [cleanItem],
    };

    return fetchWikiImage_inner(cleanItem, wikiQueries[cat] || [cleanItem]);
}

// Internal wiki fetch used by waterfall
// skipLists: pass true when searching for individual items (characters, people, etc.)
async function fetchWikiImage_inner(item, queries, skipLists = false) {
    for (const query of queries) {
        const title = await searchWikiTitle(query, skipLists);
        if (!title) continue;
        // Extra safety: never use a list/aggregate article even if skipLists=false
        if (BAD_WIKI_TITLE.test(title)) { console.log(`[IMG] Skipping list article: "${title}"`); continue; }
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
        // Detect source from URL for logging
        const src = imgSrc.includes('themoviedb') ? 'tmdb'
                  : imgSrc.includes('itunes') || imgSrc.includes('mzstatic') ? 'itunes'
                  : imgSrc.includes('tvmaze') ? 'tvmaze'
                  : imgSrc.includes('anilist') || imgSrc.includes('s4.anilist') ? 'anilist'
                  : 'wiki';
        if (window.FIPLogger) FIPLogger.logImageLoad(cleanItem, src, imgSrc, true);
        const img = document.createElement('img');
        img.className = 'result-img';
        img.alt = item;
        img.src = imgSrc;
        img.onerror = () => {
            if (window.FIPLogger) FIPLogger.logImageLoad(cleanItem, src, imgSrc, false);
            wrap.innerHTML = `<span class="result-img-placeholder">${fallback}</span>`;
        };
        wrap.innerHTML = '';
        wrap.appendChild(img);
    } else {
        if (window.FIPLogger) FIPLogger.logImageLoad(cleanItem, 'fallback', null, false);
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

    // Log the guess
    if (window.FIPLogger) FIPLogger.logGuess(items.slice(0, 3), null, null);

    // Clean each item name before display and image lookup
    carouselItems = items.slice(0, 3).map(cleanItemName);
    currentCarouselIndex = 0;

    const mascotMsg = lines.filter(l => !l.includes('GUESS:')).join(' ').trim();
    updateAllMascots();
    document.getElementById('results-bubble').textContent = mascotMsg || `Do any of these ring a bell?`;

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
    // Update logger with correctness result
    if (window.FIPLogger) {
        const current = FIPLogger.getFullLogs().slice(-1)[0];
        if (current?.outcome) {
            current.outcome.wasCorrect = !!wasCorrect;
            console.log(`[LOG] Outcome updated — wasCorrect: ${wasCorrect}`);
        }
    }
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
    // Find what was guessed and tell the AI explicitly so it never repeats those names
    const lastAssistantMsg = [...state.messages].reverse().find(m => m.role === 'assistant' && m.content.includes('GUESS:'));
    let wrongGuesses = '';
    if (lastAssistantMsg) {
        const guessLine = lastAssistantMsg.content.match(/GUESS:\s*(.+)/);
        if (guessLine) wrongGuesses = ` The following guesses were WRONG and must NOT be guessed again: ${guessLine[1].trim()}.`;
    }
    state.researchDone = false; // allow one more research lookup after wrong guesses
    state.messages.push({ role: 'user', content: `None of those guesses were correct.${wrongGuesses} Please keep asking more focused yes/no questions to narrow it down further. Think carefully about what you know so far and approach from a different angle.` });
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
    if (window.FIPLogger) FIPLogger.logStartOver();
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
        1: `BROAD SENSORY & EMOTIONAL — ask things answerable from a vague impression, not factual knowledge.
Focus on feelings, senses, and associations that might trigger memory recall.
Examples: "Does it make you feel nostalgic?", "Is it associated with warmth or comfort?",
"Does it make a sound?", "Is it something colourful?", "Does it feel like something from childhood?",
"Is it something that makes you smile?", "Does it feel like a summer thing?"
NEVER ask about specific names, dates, numbers, or technical details at this level.`,

        2: `BROAD CATEGORICAL — ask yes/no questions answerable without precise knowledge.
Focus on general nature and context rather than specifics.
Examples: "Is it something you can hold?", "Was it popular when you were growing up?",
"Is it something you'd encounter indoors?", "Does it involve other people?",
"Is it something you'd pay money for?", "Can you experience it alone?"`,

        3: `CLEAR FACTUAL — ask standard yes/no questions about category, time period, geography, and domain.
Examples: "Is it from Asia?", "Was it made after 2000?", "Is it a real person?",
"Is it something you'd watch?", "Is it still around today?", "Is it from a specific country?"
Standard level — works well when the user remembers moderate detail.`,

        4: `DOMAIN-SPECIFIC — ask more precise questions including sub-categories, rough numbers, and name characteristics.
Examples: "Was it released specifically in the 2010s?", "Does the name have more than two syllables?",
"Was it a lower-order batsman?", "Does the title start with a vowel?", "Was it a sequel?",
"Is it from the same country as another famous example you mentioned?", "Was it award-winning?"`,

        5: `EXPERT TECHNICAL — ask precise, expert-level questions drilling into exact specifics.
Examples: "Did they bat in positions 6 to 8?", "Is the first letter in the second half of the alphabet (N to Z)?",
"Was it a Test-only player?", "Did the title have exactly one word?",
"Was it a franchise with more than three films?", "Did the name end in a vowel sound?",
"Is the surname fewer than six letters long?", "Was it released before the mid-point of the decade?"`
    };

    const personality = MASCOTS[state.mascot]?.personality || '';

    return `You are ${state.mascotName} the ${MASCOTS[state.mascot]?.species || 'companion'}, a memory recovery companion helping ${state.name}.

CORE PURPOSE — READ THIS CAREFULLY:
${state.name} has forgotten something. They do NOT know what it is anymore — they only remember vague characteristics or fragments. Your job is to ask questions that help them *reconstruct* the memory and surface what they're thinking of. This is NOT a guessing game where they know the answer and you have to guess it. They may be just as unsure as you are.

Critical mindset:
- "Not sure" means they genuinely don't remember — not that they're being evasive. Treat it as a signal to approach from a completely different angle.
- Ask questions that might trigger recall: sensory, emotional, contextual, association-based, physical, or time-period.
- When you present guesses, frame them as possibilities that might "ring a bell" — not a triumphant reveal.
- Be warm and collaborative, like a friend helping you think. Not competitive.

RECALL vs RETRIEVAL — HOW THIS APP WORKS:
FinditPal is a RECALL TOOL, not a trivia game. The user is NOT deliberately withholding the answer. They genuinely cannot retrieve it. Your job is DUAL:
1. NARROW DOWN — yes/no questions that eliminate possibilities (binary search)
2. TRIGGER RECALL — questions that might make the memory surface organically

Every question should serve BOTH purposes where possible:
- "Was it a sad song?" → narrows genre AND might trigger emotional memory of the song
- "Did it have a female vocalist?" → narrows options AND might surface a voice memory
- "Was it something you'd hear in the car?" → narrows context AND triggers a scene/memory

Questions that ONLY narrow but do NOT help recall (avoid these when user says they don't know the name/title):
- "Does the name have more than two syllables?" ← useless if they don't know the name
- "Does the first letter come before M in the alphabet?" ← same problem
- "Is the title fewer than 3 words?" ← they told you they don't know the title
ALWAYS ask things that help the user REMEMBER, not just things that help YOU guess.

FRAGMENT PRIORITY — CRITICAL:
If the user provided ANY lyric fragment, title fragment, description, or contextual clue in their initial memory:
- This is your highest-value clue. Use it immediately in the first 1–2 questions.
- If it's a lyric: ask questions about SONG QUALITIES matching that lyric's tone and emotional style (e.g. "I'm out of my head and I'm out of my mind" → ask about emotional/intense vibe, genre, era — NOT about name initials)
- Do NOT ignore the fragment and ask unrelated generic questions
- Do NOT ask the user to repeat information they already gave you
- If a lyric or title fragment is distinctive, use your knowledge to narrow down possible matches and ask confirming questions about those specific candidates

PERSONALITY: ${personality}
Express your personality briefly — one short phrase per response maximum. Never let personality slow the questioning.

CRITICAL RULE - QUESTION FORMAT:
- Ask ONLY pure yes/no questions. Every question must be answerable with Yes, No, or Not sure.
- NEVER use the word "or" in a question. Not ever. Not even in natural phrasing.
- WRONG: "Is this a song by an artist or band?" / "Is it from Asia or Europe?" / "Was it made by a person or a group?"
- RIGHT: "Is it a solo artist?" / "Is it from Asia?" / "Is it made by one person?"
- If you want to distinguish between two things, ask about one of them with a plain yes/no. Never combine them with "or".
- One question per response only. No lists. No explanations.

QUESTION DEPTH LEVEL: ${styleGuide[state.simplicity]}

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

MUSIC / SONG CATEGORY — RECALL PROTOCOL:
If the category is a song, music track, or music artist, follow this branching approach strictly:

STEP 1 — Check what they know (ask as question 1 or 2):
"Do you remember the artist or band name?"
- If YES → ask about the artist: "Are they a solo artist?", "Are they from the US?", era, genre, etc.
- If NO → immediately switch to SONG VIBE MODE below. DO NOT ask about artist name letters or initials.

STEP 2 — SONG VIBE MODE (when artist is unknown):
Ask questions that trigger memory through the song's feel and qualities:
- Tempo: "Was it an upbeat, fast-paced song?"
- Mood/emotion: "Did it feel sad or melancholic?", "Was it romantic?", "Was it energetic?"
- Vocals: "Did it have a male lead vocalist?", "Was it sung by a woman?", "Was it a group?"
- Instrumentation: "Was it guitar-heavy?", "Was it mostly electronic/produced beats?", "Did it have a piano?"
- Era/decade: "Was it from the 2010s or later?", "Is it from before 2000?"
- Genre: "Was it pop?", "Was it hip-hop?", "Was it R&B?", "Was it rock?"
- Context: "Is it a song you'd hear in a club?", "Did it come from a movie or TV show?", "Was it a widely known hit?"
- Lyric fragments: If the user provided ANY lyric fragment in their initial memory, USE IT IMMEDIATELY to guide these questions

NEVER in Song Vibe Mode:
- Ask "Does the artist name start with A–M?" or any variant of name-letter guessing
- Ask about name syllables, initials, or letter positions of an artist the user doesn't know
- Ignore a lyric fragment the user already gave you

SMART NARROWING STRATEGY (binary decision tree):
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

Questions 11-20: Narrow down specifics
  - Physical traits, titles, associated words
  - Specific country/state/city
  - Approach from fresh angles if previous questions haven't narrowed enough

Questions 20+: Keep going until confident — accuracy matters more than speed
  - If still uncertain, try completely different angles
  - Ask about specific attributes: title length, starting letter, famous co-stars, release decade, theme

NAME / IDENTITY STRATEGY — ONLY USE WHEN USER KNOWS PARTIAL NAME:
This section ONLY applies when the user has confirmed they know part of the name/title — e.g. they said "I know it starts with S" or "I know the artist but not the song".
DO NOT apply this strategy if the user said they don't know the artist, title, or name.

When the user DOES know they're thinking of a specific named person/title but can't retrieve it:
1. USE THE RESEARCH TOOL (see below) to look up the actual member list. Do not guess blindly.
2. Ask about name characteristics: "Does the first name start with a letter in the first half of the alphabet (A–M)?"
3. Ask about physical traits, role in the team, batting position, jersey number, etc.
4. If you guessed a name that was WRONG but CLOSE, ask "Is the first name longer than [X] letters?" or "Does the surname have more than one syllable?" to zero in.
5. NEVER guess a made-up or uncertain name. Only guess names you are confident actually exist and match the criteria.

When the user does NOT know the name:
- Skip ALL name-letter questions entirely — they are useless and frustrating
- Focus on recall-triggering characteristics: what it felt like, sounded like, looked like, when they encountered it, what emotions it brought up
- Help them arrive at the name through reconstructive memory (vibe → context → content → identity), not interrogation

RESEARCH TOOL — USE THIS WHEN NARROWED TO A SPECIFIC GROUP:
When you know the answer is a specific team member, cast member, squad player, album track, etc. but you don't know the exact name, you MUST use the research tool:
Output EXACTLY on its own line:
RESEARCH: <specific search query>
Then stop. Do NOT ask a question in the same response.
Examples:
  RESEARCH: 1983 Cricket World Cup West Indies squad
  RESEARCH: original cast Fawlty Towers
  RESEARCH: 1966 England World Cup squad players
  RESEARCH: BTS members names
  RESEARCH: Tamil Nadu 2011 Ranji Trophy cricket team squad
The research results will be provided to you and you can then make a confident, accurate guess.
Only use RESEARCH once. Use it wisely — be specific in your query.

HANDLING "NOT SURE" ANSWERS:
When the user answers "not sure", they genuinely don't remember — not being evasive.
- NEVER repeat a similar question.
- Try a completely different angle: sensory impression, emotional association, time period, physical characteristic.
- Ask something that might jog the memory from a new direction.
- Treat "not sure" as useful information that rules out nothing but signals a new approach is needed.

GUESSING:
- Only guess when genuinely confident — wrong guesses can confuse someone already struggling to remember.
- After 8+ questions, if reasonably confident (>70%): present your guesses.
- Keep asking if still unsure — finding the right answer matters more than speed.
- NEVER guess a name you are not sure actually exists. Use the RESEARCH tool first if uncertain.
- Frame guesses as possibilities that might "ring a bell", not certainties.
- Format EXACTLY:
[One warm, collaborative sentence — e.g. "Based on everything you've shared, here are my best guesses!"]
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

Remember: you are helping someone recover a lost memory together. Be patient, warm, and creative with your angles.`;
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
window.submitMemoryJog   = submitMemoryJog;
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

// ============================================================
// UI ENHANCEMENTS — GlowingEffect, Mascot Circles, Footer
// ============================================================

// 1. GlowingEffect: global pointermove listener with smooth angle lerp (mirrors 21st.dev GlowingEffect)
(function initGlowingEffect() {
    // Smooth angle lerp to avoid jumps when crossing ±180°
    function lerpAngle(current, target, t) {
        let diff = ((target - current + 180) % 360) - 180;
        return current + diff * t;
    }

    const cardAngles = new WeakMap(); // per-card current angle

    let rafId = null;
    let lastX = 0, lastY = 0;

    function updateCards(x, y) {
        document.querySelectorAll('.category-btn').forEach(card => {
            const rect = card.getBoundingClientRect();
            // check if card is visible
            if (rect.width === 0) return;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const targetAngle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
            const current = cardAngles.get(card) || 0;
            const next = lerpAngle(current, targetAngle, 0.12);
            cardAngles.set(card, next);
            card.style.setProperty('--start', String(next));
            const dist = Math.hypot(x - cx, y - cy);
            const threshold = Math.max(rect.width, rect.height) * 0.8;
            card.style.setProperty('--active', dist < threshold ? '1' : '0');
        });
    }

    function tick() {
        updateCards(lastX, lastY);
        rafId = requestAnimationFrame(tick);
    }

    document.body.addEventListener('pointermove', (e) => {
        lastX = e.clientX;
        lastY = e.clientY;
        if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    // Stop RAF when pointer leaves window (performance)
    document.body.addEventListener('pointerleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        document.querySelectorAll('.category-btn').forEach(card => {
            card.style.setProperty('--active', '0');
        });
    }, { passive: true });
})();

// 2. Mascot circle color switching — sets CSS vars per mascot palette
const MASCOT_CIRCLE_PALETTES = {
    panda:   { c1: 'rgba(203,213,225,0.6)', c2: 'rgba(168,230,207,0.5)', c3: 'rgba(148,163,232,0.4)', gradient: 'rgba(168,230,207,0.08)' },
    dragon:  { c1: 'rgba(251,146,60,0.6)',  c2: 'rgba(239,68,68,0.5)',   c3: 'rgba(251,191,36,0.4)', gradient: 'rgba(251,146,60,0.08)' },
    dog:     { c1: 'rgba(251,191,36,0.6)',  c2: 'rgba(245,158,11,0.5)',  c3: 'rgba(234,179,8,0.4)',  gradient: 'rgba(251,191,36,0.08)' },
    cat:     { c1: 'rgba(167,139,250,0.6)', c2: 'rgba(139,92,246,0.5)',  c3: 'rgba(196,181,253,0.4)',gradient: 'rgba(167,139,250,0.08)' },
    penguin: { c1: 'rgba(56,189,248,0.6)',  c2: 'rgba(14,165,233,0.5)',  c3: 'rgba(125,211,252,0.4)',gradient: 'rgba(56,189,248,0.08)' },
    zebra:   { c1: 'rgba(148,163,232,0.6)', c2: 'rgba(99,102,241,0.5)',  c3: 'rgba(199,210,254,0.4)',gradient: 'rgba(148,163,232,0.08)' },
    monkey:  { c1: 'rgba(251,146,60,0.6)',  c2: 'rgba(245,158,11,0.5)',  c3: 'rgba(254,215,170,0.4)',gradient: 'rgba(251,146,60,0.08)' },
};

function setMascotCircleVariant(mascot) {
    const p = MASCOT_CIRCLE_PALETTES[mascot] || MASCOT_CIRCLE_PALETTES.panda;
    const root = document.documentElement;
    root.style.setProperty('--circle-c1', p.c1);
    root.style.setProperty('--circle-c2', p.c2);
    root.style.setProperty('--circle-c3', p.c3);
    root.style.setProperty('--circle-gradient', p.gradient);
}

// 3. Sparkle canvas particle system — tsparticles-style burst on hover
(function initSparkleButton() {
    const COLORS = ['#a5b4fc','#94a3e8','#a8e6cf','#c4b5fd','#fcd5ce','#fde68a','#f9a8d4'];
    const SHAPES = ['circle','star','square'];

    function initCanvas(btn) {
        const canvas = btn.querySelector('.sparkle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let rafId = null;
        let running = false;

        function resize() {
            const r = btn.getBoundingClientRect();
            canvas.width = r.width + 48;
            canvas.height = r.height + 48;
        }

        function spawnBurst() {
            resize();
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            for (let i = 0; i < 22; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.2 + Math.random() * 2.8;
                particles.push({
                    x: cx, y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 0.5,
                    size: 1.5 + Math.random() * 3,
                    color: COLORS[Math.floor(Math.random() * COLORS.length)],
                    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
                    alpha: 1,
                    life: 0,
                    maxLife: 40 + Math.floor(Math.random() * 30),
                    rotate: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.3,
                });
            }
        }

        function drawStar(ctx, x, y, r, rot) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rot);
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI * 2;
                const ia = a + Math.PI / 4;
                ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                ctx.lineTo(Math.cos(ia) * r * 0.4, Math.sin(ia) * r * 0.4);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.life < p.maxLife);
            if (!particles.length) {
                running = false;
                cancelAnimationFrame(rafId);
                return;
            }
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.06; // gravity
                p.rotate += p.rotSpeed;
                p.life++;
                p.alpha = 1 - (p.life / p.maxLife);
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else if (p.shape === 'star') {
                    drawStar(ctx, p.x, p.y, p.size * 1.5, p.rotate);
                } else {
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotate);
                    ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
                    ctx.restore();
                }
            }
            ctx.globalAlpha = 1;
            rafId = requestAnimationFrame(loop);
        }

        btn.addEventListener('mouseenter', () => {
            spawnBurst();
            if (!running) { running = true; rafId = requestAnimationFrame(loop); }
        });
        btn.addEventListener('mouseleave', () => {
            // let particles finish naturally
        });

        resize();
        window.addEventListener('resize', resize, { passive: true });
    }

    function setup() {
        const btn = document.getElementById('sparkle-btn-main');
        if (btn) initCanvas(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
