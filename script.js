let balance = 0.00;
const balanceEl = document.getElementById('balance');
const miningBtn = document.getElementById('mining-btn');
const statusText = document.getElementById('status-text');

// Time Update
setInterval(() => {
    const now = new Date();
    document.getElementById('utc-time').innerText = now.toISOString().split('T')[1].split('.')[0] + ' UTC';
}, 1000);

// Mining Action
miningBtn.addEventListener('click', () => {
    // Increment Balance
    balance += 0.50;
    balanceEl.innerText = balance.toFixed(2);

    // Vibration (Mobile only)
    if (navigator.vibrate) {
        navigator.vibrate(15);
    }

    // Visual Feedback
    statusText.innerText = "MINING SEQUENCE ACTIVE...";
    statusText.style.color = "#00F0FF";
    
    // Reset text after 1 second
    setTimeout(() => {
        statusText.innerText = "TAP TO SYNC";
        statusText.style.color = "#444";
    }, 1000);
});
