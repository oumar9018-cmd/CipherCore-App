// --- CONFIGURATION ---
const STORAGE_KEY = 'cipher_data_v1';
const MINING_RATE = 0.005; // Coins per second
const SESSION_TIME = 12 * 60 * 60 * 1000; // 12 Hours in milliseconds

// --- STATE MANAGEMENT ---
let state = {
    balance: 0.000,
    miningStartTime: 0,
    isMining: false
};

// --- DOM ELEMENTS ---
const elBalance = document.getElementById('main-balance');
const elTimer = document.getElementById('mining-timer');
const elBtn = document.getElementById('mine-btn');
const introLayer = document.getElementById('intro-layer');

// --- INITIALIZATION ---
window.onload = () => {
    // 1. Remove Intro
    setTimeout(() => {
        introLayer.style.opacity = '0';
        setTimeout(() => introLayer.style.display = 'none', 500);
    }, 2000);

    // 2. Load Data from Storage
    loadState();
    
    // 3. Start UI Loop
    requestAnimationFrame(updateUI);
};

function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        state = JSON.parse(saved);
        // Check if mining session expired
        const now = Date.now();
        if (state.isMining) {
            const elapsed = now - state.miningStartTime;
            if (elapsed > SESSION_TIME) {
                // Session finished while away
                state.isMining = false;
                state.balance += (SESSION_TIME / 1000) * MINING_RATE;
            } else {
                // Still mining, add catch-up balance
                // (Realtime update happens in loop)
            }
        }
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// --- MINING LOGIC ---
window.startMining = function() {
    if (state.isMining) return;

    state.isMining = true;
    state.miningStartTime = Date.now();
    saveState();
    
    // Button Feedback
    if (navigator.vibrate) navigator.vibrate(50);
}

// --- MAIN LOOP (Runs every frame) ---
function updateUI() {
    const now = Date.now();
    
    if (state.isMining) {
        const elapsed = now - state.miningStartTime;
        
        if (elapsed < SESSION_TIME) {
            // Mining Active
            const earned = (elapsed / 1000) * MINING_RATE;
            const currentDisplay = state.balance + earned;
            
            elBalance.innerText = currentDisplay.toFixed(3);
            
            // Timer Logic
            const remaining = SESSION_TIME - elapsed;
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            elTimer.innerText = `${hours}h ${minutes}m ${seconds}s REMAINING`;
            elTimer.style.color = "#00f2ea";
            
            elBtn.innerHTML = "MINING IN PROGRESS...";
            elBtn.style.opacity = "0.7";
            elBtn.style.background = "#1a1a1a";
            elBtn.style.color = "#fff";
            
        } else {
            // Session Just Ended
            state.isMining = false;
            state.balance += (SESSION_TIME / 1000) * MINING_RATE;
            saveState();
        }
    } else {
        // Mining Stopped
        elBalance.innerText = state.balance.toFixed(3);
        elTimer.innerText = "SYSTEM READY";
        elTimer.style.color = "#666";
        elBtn.innerHTML = '<i class="fa-solid fa-power-off"></i> INITIATE PROTOCOL';
        elBtn.style.opacity = "1";
        elBtn.style.background = "#fff";
        elBtn.style.color = "#000";
    }
    
    requestAnimationFrame(updateUI);
}

// --- PANEL LOGIC ---
window.openPanel = function(id) {
    document.getElementById(id).classList.add('open');
}
window.closePanel = function(id) {
    document.getElementById(id).classList.remove('open');
}
