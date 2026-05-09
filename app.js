// Global Initialization
window.utils = window.utils || {};
window.utils.generateArray = (size = 20, min = 10, max = 100) => {
    return Array.from({length: size}, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
window.algorithms = window.algorithms || {};

// Global State
const state = {
    currentAlgo: null,
    isPaused: false,
    speed: 500,
    runId: 0,
    isRunning: false,
    stats: {
        comparisons: 0,
        swaps: 0,
        startTime: 0,
        intervalId: null
    }
};

// UI Elements
const themeToggle = document.getElementById('theme-toggle');
const homeView = document.getElementById('home-view');
const vizView = document.getElementById('visualizer-view');
const backBtn = document.getElementById('back-btn');
const vizTitle = document.getElementById('viz-title');
const vizArea = document.getElementById('visualization-area');
const pseudoPanel = document.getElementById('pseudocode-content');
const customInputContainer = document.getElementById('custom-input-container');

// Controls
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const randomBtn = document.getElementById('random-btn');
const speedSlider = document.getElementById('speed-slider');

// Stats
const statComps = document.getElementById('stat-comparisons');
const statSwaps = document.getElementById('stat-swaps');
const statTime = document.getElementById('stat-time');

// Theme Logic
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️ Chế Độ Sáng' : '🌙 Chế Độ Tối';
});

// View Navigation
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const algo = card.dataset.algo;
        const title = card.querySelector('h3').textContent;
        openVisualizer(algo, title);
    });
});

backBtn.addEventListener('click', () => {
    state.runId++; 
    vizView.classList.remove('active');
    homeView.classList.add('active');
    state.isRunning = false;
});

function openVisualizer(algoId, title) {
    state.currentAlgo = algoId;
    vizTitle.textContent = title;
    homeView.classList.remove('active');
    vizView.classList.add('active');
    
    // First load initialization
    state.runId++;
    state.isRunning = false;
    state.isPaused = false;
    pauseBtn.textContent = '⏸ Tạm Dừng';
    resetStats();
    
    vizArea.innerHTML = '';
    customInputContainer.innerHTML = '';
    
    if (window.algorithms && window.algorithms[state.currentAlgo]) {
        if (window.algorithms[state.currentAlgo].generateRandom) {
            window.algorithms[state.currentAlgo].generateRandom();
        }
        window.algorithms[state.currentAlgo].init(vizArea, pseudoPanel, customInputContainer);
    }
}

// Controller Logic
async function wait() {
    const currentRunId = state.runId;
    while (state.isPaused) {
        await new Promise(r => setTimeout(r, 100));
        if (currentRunId !== state.runId) throw new Error("STOP");
    }
    const delay = 1010 - state.speed; 
    await new Promise(r => setTimeout(r, delay));
    if (currentRunId !== state.runId) throw new Error("STOP");
}

window.appState = state; // Expose for algorithms that need direct state access

function updateStats(comps = 0, swaps = 0) {
    state.stats.comparisons += comps;
    state.stats.swaps += swaps;
    statComps.textContent = `Số Lần So Sánh: ${state.stats.comparisons}`;
    statSwaps.textContent = `Hoán Đổi: ${state.stats.swaps}`;
}

function startTimer() {
    state.stats.startTime = Date.now();
    clearInterval(state.stats.intervalId);
    state.stats.intervalId = setInterval(() => {
        if(!state.isPaused) {
            const elapsed = ((Date.now() - state.stats.startTime) / 1000).toFixed(1);
            statTime.textContent = `Thời Gian: ${elapsed}s`;
        } else {
             state.stats.startTime += 100;
        }
    }, 100);
}

function stopTimer() {
    clearInterval(state.stats.intervalId);
}

function resetStats() {
    state.stats.comparisons = 0;
    state.stats.swaps = 0;
    updateStats(0, 0);
    stopTimer();
    statTime.textContent = 'Thời Gian: 0.0s';
}

// Control Event Listeners
playBtn.addEventListener('click', async () => {
    if (state.isPaused) {
        state.isPaused = false;
        pauseBtn.textContent = '⏸ Tạm Dừng';
        return;
    }
    if (state.isRunning) return;
    
    state.isRunning = true;
    resetStats();
    startTimer();
    
    try {
        if (window.algorithms && window.algorithms[state.currentAlgo]) {
            await window.algorithms[state.currentAlgo].run(wait, updateStats);
        }
    } catch(e) {
        if(e.message !== "STOP") console.error(e);
    }
    
    state.isRunning = false;
    stopTimer();
});

pauseBtn.addEventListener('click', () => {
    if (!state.isRunning) return;
    state.isPaused = !state.isPaused;
    pauseBtn.textContent = state.isPaused ? '▶ Tiếp Tục' : '⏸ Tạm Dừng';
});

resetBtn.addEventListener('click', () => {
    state.runId++;
    state.isRunning = false;
    state.isPaused = false;
    pauseBtn.textContent = '⏸ Tạm Dừng';
    resetStats();
    if (window.algorithms && window.algorithms[state.currentAlgo]) {
        window.algorithms[state.currentAlgo].reset();
    }
});

randomBtn.addEventListener('click', () => {
    state.runId++;
    state.isRunning = false;
    state.isPaused = false;
    pauseBtn.textContent = '⏸ Tạm Dừng';
    resetStats();
    if (window.algorithms && window.algorithms[state.currentAlgo]) {
        window.algorithms[state.currentAlgo].generateRandom();
        window.algorithms[state.currentAlgo].reset();
    }
});

speedSlider.addEventListener('input', (e) => {
    state.speed = e.target.value;
});
