/* --- PART 1: QUANTUM BACKGROUND ENGINE --- */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 1.5;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for(let i=0; i<50; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Connect particles
    for(let i=0; i<particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        for(let j=i; j<particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if(dist < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 243, 255, ${0.1 - dist/1000})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

initParticles();
animate();


/* --- PART 2: APP LOGIC --- */
const CONFIG = {
    sessionLength: 12 * 60 * 60 * 1000, // 12 Hours
    rate: 0.008 // Speed
};

let state = {
    balance: 0.000,
    startTime: 0,
    isMining: false
};

const ui = {
    balance: document.getElementById('balance'),
    timer: document.getElementById('timer-display'),
    reactor: document.getElementById('reactor-btn'),
    intro: document.getElementById('intro-layer')
};

window.onload = () => {
    // 1. Remove Intro
    setTimeout(() => {
        ui.intro.style.opacity = '0';
        setTimeout(() => ui.intro.style.display = 'none', 800);
    }, 2200);

    // 2. Load
    const saved = localStorage.getItem('quantum_data');
    if(saved) state = JSON.parse(saved);

    // 3. Loop
    requestAnimationFrame(gameLoop);
};

window.toggleMining = () => {
    if(state.isMining) return;
    
    state.isMining = true;
    state.startTime = Date.now();
    saveData();
    
    // Haptic
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]);
};

function saveData() {
    localStorage.setItem('quantum_data', JSON.stringify(state));
}

window.openPanel = (id) => document.getElementById(id).classList.add('open');
window.closePanel = (id) => document.getElementById(id).classList.remove('open');

function gameLoop() {
    const now = Date.now();

    if(state.isMining) {
        const elapsed = now - state.startTime;
        
        if(elapsed < CONFIG.sessionLength) {
            // Active
            ui.reactor.classList.add('active');
            
            const earned = (elapsed / 1000) * CONFIG.rate;
            ui.balance.innerText = (state.balance + earned).toFixed(3);
            
            const left = CONFIG.sessionLength - elapsed;
            const h = Math.floor(left / 3600000);
            const m = Math.floor((left % 3600000) / 60000);
            const s = Math.floor((left % 60000) / 1000);
            
            ui.timer.innerText = `SYNCING: ${h}h ${m}m ${s}s`;
            ui.timer.style.color = "#00f3ff";
            
        } else {
            // Done
            state.isMining = false;
            state.balance += (CONFIG.sessionLength / 1000) * CONFIG.rate;
            saveData();
            ui.reactor.classList.remove('active');
        }
    } else {
        // Idle
        ui.timer.innerText = "SYSTEM STANDBY";
        ui.timer.style.color = "#666";
        ui.balance.innerText = state.balance.toFixed(3);
    }
    
    requestAnimationFrame(gameLoop);
}
