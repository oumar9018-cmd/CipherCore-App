// CONFIGURATION
const SESSION = 12 * 60 * 60 * 1000;
const RATE = 0.005;

// APP STATE
let state = {
    balance: 0.000,
    startTime: 0,
    mining: false,
    referrals: 0
};

// UI REFERENCES
const ui = {
    balance: document.getElementById('balance'),
    timer: document.getElementById('timer'),
    bar: document.getElementById('progress-bar'),
    intro: document.getElementById('intro'),
    rank: document.getElementById('rank-name'),
    refCount: document.getElementById('ref-count')
};

// INITIALIZE
window.onload = () => {
    // 1. Intro Animation
    setTimeout(() => {
        ui.intro.style.opacity = '0';
        setTimeout(() => ui.intro.style.display = 'none', 800);
    }, 2000);

    // 2. Load Data
    const saved = localStorage.getItem('cipher_final_v2');
    if(saved) state = JSON.parse(saved);

    // 3. Update Rank based on Balance
    updateRank();

    // 4. Start Loop
    requestAnimationFrame(loop);
};

// MINING ACTION
window.mine = () => {
    if(state.mining) return;
    state.mining = true;
    state.startTime = Date.now();
    save();
    if(navigator.vibrate) navigator.vibrate(50);
};

// NAVIGATION
window.openP = (id) => document.getElementById(id).classList.add('active');
window.closeP = (id) => document.getElementById(id).classList.remove('active');

// REFERRAL LOGIC
window.shareLink = () => {
    const url = "https://t.me/TheCipherCore_bot?start=ref123";
    const text = "Join the Cipher Protocol. The Reset is here.";
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
};

window.copyLink = () => {
    navigator.clipboard.writeText("https://t.me/TheCipherCore_bot?start=ref123");
    alert("Referral Link Copied!");
};

// HELPERS
function save() {
    localStorage.setItem('cipher_final_v2', JSON.stringify(state));
}

function updateRank() {
    let r = "INITIATE NODE";
    if(state.balance > 100) r = "VALIDATOR NODE";
    if(state.balance > 1000) r = "MASTER NODE";
    ui.rank.innerText = r;
    ui.refCount.innerText = state.referrals;
}

// MAIN LOOP
function loop() {
    const now = Date.now();
    
    if(state.mining) {
        const elapsed = now - state.startTime;
        
        if(elapsed < SESSION) {
            const earned = (elapsed / 1000) * RATE;
            ui.balance.innerText = (state.balance + earned).toFixed(3);
            
            // Timer Logic
            const left = SESSION - elapsed;
            const h = Math.floor(left/3600000);
            const m = Math.floor((left%3600000)/60000);
            const s = Math.floor((left%60000)/1000);
            ui.timer.innerText = `SYNCING: ${h}h ${m}m ${s}s`;
            ui.timer.style.color = "#fff";
            
            ui.bar.style.width = ((elapsed/SESSION)*100) + "%";
            
        } else {
            state.mining = false;
            state.balance += (SESSION/1000) * RATE;
            updateRank(); // Check if rank upgrade
            save();
            ui.bar.style.width = "0%";
        }
    } else {
        ui.balance.innerText = state.balance.toFixed(3);
        ui.timer.innerText = "TAP CORE TO START";
        ui.timer.style.color = "#666";
    }
    
    requestAnimationFrame(loop);
}
