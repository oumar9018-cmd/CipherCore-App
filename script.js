// WAIT FOR PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REMOVE INTRO SCREEN
    setTimeout(() => {
        const intro = document.getElementById('intro-layer');
        intro.style.opacity = '0';
        // Wait for fade out then remove completely (Fixing button click issue)
        setTimeout(() => {
            intro.style.display = 'none'; 
        }, 500);
    }, 2000);

    // VARIABLES
    let balance = 0.00;
    let isMining = false;
    const balanceDisplay = document.getElementById('balance-display');
    const timerText = document.getElementById('timer-text');
    const mineBtn = document.getElementById('mine-btn');

    // 2. MINING FUNCTION
    window.startMining = function() {
        if(isMining) return; // Agar pehle se chal raha hai to ruk jao

        isMining = true;
        
        // UI Change
        mineBtn.innerHTML = "MINING ACTIVE";
        mineBtn.style.background = "#1a1a1a";
        mineBtn.style.color = "#00f2ea"; // Cyan color
        mineBtn.style.boxShadow = "none";
        
        // Timer Start
        timerText.innerText = "SESSION ENDS IN 11:59:59";
        timerText.style.color = "#00f2ea";

        // Vibrate
        if(navigator.vibrate) navigator.vibrate(50);

        // Fake Mining Loop
        setInterval(() => {
            balance += 0.005; // Slow increase
            // Update Balance Text
            balanceDisplay.innerHTML = balance.toFixed(3) + ' <span class="unit">CPR</span>';
        }, 1000);
    }

    // 3. MENU FUNCTIONS
    const sidebar = document.getElementById('side-drawer');
    
    window.openMenu = function() {
        sidebar.classList.add('open');
    }
    
    window.closeMenu = function() {
        sidebar.classList.remove('open');
    }

});
