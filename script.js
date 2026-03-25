// VARIABLES
let balance = 0.00;
let isMining = false;
const balanceEl = document.getElementById('balance');
const miningBtn = document.getElementById('mining-btn');
const timerEl = document.getElementById('timer');
const introScreen = document.getElementById('intro-screen');

// 1. INTRO ANIMATION LOGIC
window.onload = function() {
    setTimeout(() => {
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.style.display = 'none';
        }, 1000);
    }, 2500); // 2.5 seconds loading time
};

// 2. MENU TOGGLE LOGIC
function toggleMenu() {
    const menu = document.getElementById('side-menu');
    menu.classList.toggle('active');
}

// 3. MINING LOGIC (12 HOURS)
miningBtn.addEventListener('click', () => {
    if (isMining) return;

    // Start Mining
    isMining = true;
    miningBtn.innerText = "MINING IN PROGRESS...";
    miningBtn.disabled = true;
    timerEl.innerText = "11:59:59 REMAINING";
    timerEl.style.color = "#00f2ea"; // Neon Blue

    // Haptic Feedback
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

    // Start Balance Increment Loop
    startMiningLoop();
});

function startMiningLoop() {
    setInterval(() => {
        if(isMining) {
            balance += 0.01; // Dheere dheere badhega (Real feel)
            balanceEl.innerText = balance.toFixed(2);
        }
    }, 1000); // Har second update
}
