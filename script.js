const LEVELS_DATA = {
    T0: { price: 0, taskPay: 0, name: "Free Level" },
    T1: { price: 65000, taskPay: 330, name: "Level 1" },
    T2: { price: 150000, taskPay: 950, name: "Level 2" },
    T3: { price: 280000, taskPay: 1600, name: "Level 3" },
    T4: { price: 570000, taskPay: 3200, name: "Level 4" },
    T5: { price: 980000, taskPay: 5600, name: "Level 5" },
    T6: { price: 1750000, taskPay: 9500, name: "Level 6" },
    T7: { price: 2500000, taskPay: 13500, name: "Level 7" },
    T8: { price: 5000000, taskPay: 31000, name: "Level 8" },
    T9: { price: 8000000, taskPay: 48000, name: "Level 9" },
    T10: { price: 16000000, taskPay: 80000, name: "Level 10" },
    T11: { price: 35000000, taskPay: 220000, name: "Level 11" },
    T12: { price: 50000000, taskPay: 290000, name: "Level 12" }
};

let currentUser = JSON.parse(localStorage.getItem('wzg_current_user')) || null;
const MASTER_ADMIN = "0795140634";

let currentSlide = 0;
function initSlider() {
    const slides = document.querySelectorAll('.banner-slider img');
    if (slides.length === 0) return;
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3500);
}

window.onload = function() {
    initSlider();
    if (currentUser) {
        loadDashboard();
    }
};

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (tab === 'register') {
        document.getElementById('register-form').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (tab === 'forgot') {
        document.getElementById('forgot-form').classList.add('active');
        event.currentTarget.classList.add('active');
    }
}

function handleRegister() {
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();
    const invite = document.getElementById('reg-invite').value.trim();

    if (!phone || !pass || !invite) {
        alert("Please fill all fields and provide an invitation code.");
        return;
    }

    let users = JSON.parse(localStorage.getItem('wzg_users')) || {};
    if (users[phone]) { alert("User already registered."); return; }

    users[phone] = {
        phone: phone,
        password: pass,
        inviteCode: invite,
        currentLevel: 'T0',
        earnWallet: 0,
        mainWallet: 0
    };

    localStorage.setItem('wzg_users', JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    switchAuthTab('login');
}

function handleLogin() {
    const phone = document.getElementById('login-phone').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    let users = JSON.parse(localStorage.getItem('wzg_users')) || {};

    if (phone === MASTER_ADMIN && pass === "admin123") {
        currentUser = { phone: MASTER_ADMIN, currentLevel: 'T12', earnWallet: 9999999, mainWallet: 9999999 };
    } else if (users[phone] && users[phone].password === pass) {
        currentUser = users[phone];
    } else {
        alert("Invalid login credentials. Use 0795140634 and admin123 for master admin.");
        return;
    }

    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    loadDashboard();
}

function handleLogout() {
    localStorage.removeItem('wzg_current_user');
    currentUser = null;
    document.getElementById('dashboard-view').classList.remove('active');
    document.getElementById('auth-view').classList.add('active');
}

function loadDashboard() {
    document.getElementById('auth-view').classList.remove('active');
    document.getElementById('dashboard-view').classList.add('active');

    document.getElementById('earn-wallet-balance').innerText = `UGX ${currentUser.earnWallet.toLocaleString()}`;
    document.getElementById('main-wallet-balance').innerText = `UGX ${currentUser.mainWallet.toLocaleString()}`;

    if (currentUser.phone === MASTER_ADMIN) {
        document.getElementById('admin-tab-btn').style.display = 'block';
    }
    switchTab('tasks');
}

function switchTab(tabName) {
    const area = document.getElementById('tab-content');
    if (tabName === 'tasks') renderTasksView(area);
    else if (tabName === 'levels') renderLevelsView(area);
    else if (tabName === 'wallet-actions') renderWalletView(area);
    else if (tabName === 'team') renderTeamView(area);
    else if (tabName === 'turntable') renderTurntable(area);
    else if (tabName === 'salaries') renderSalariesView(area);
    else if (tabName === 'marketplace') renderMarketplace(area);
    else if (tabName === 'admin' && currentUser.phone === MASTER_ADMIN) renderAdminView(area);
}

function renderTasksView(container) {
    const lvl = LEVELS_DATA[currentUser.currentLevel];
    container.innerHTML = `
        <div class="gold-border">
            <h3><i class="fas fa-video"></i> TikTok Skit Tasks (${currentUser.currentLevel})</h3>
            <p>Task Payout: <strong>UGX ${lvl.taskPay}</strong></p>
            <div style="background:#000; height:150px; display:flex; align-items:center; justify-content:center; margin:10px 0;">
                <video width="100%" height="100%" controls muted>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                </video>
            </div>
            <p>Select the best comment:</p>
            <button class="gold-btn" style="margin-top:8px;" type="button" onclick="submitTask(true)">A) Outstanding skit across Uganda districts!</button>
            <button class="gold-btn" style="margin-top:5px; background:#222; color:#fff;" type="button" onclick="submitTask(false)">B) Average comment</button>
        </div>
    `;
}

function submitTask(isCorrect) {
    if (!isCorrect) { alert("Incorrect comment selection. Try again."); return; }
    const pay = LEVELS_DATA[currentUser.currentLevel].taskPay;
    currentUser.earnWallet += pay;
    localStorage.setItem('wzg_current_user', JSON.stringify(currentUser));
    alert(`Task completed! UGX ${pay} credited.`);
    loadDashboard();
}

function renderLevelsView(container) {
    container.innerHTML = `<div class="gold-border"><h3>Levels & Gold Coins Rain</h3><button class="gold-btn" type="button" onclick="alert('Rain collected!')">Claim Rain</button></div>`;
}

function renderWalletView(container) {
    container.innerHTML = `<div class="gold-border"><h3>Wallets & ObPay / Marz</h3><p>Gateway Connected for 0795140634</p></div>`;
}

function renderTeamView(container) {
    container.innerHTML = `<div class="gold-border"><h3>Team & Commissions</h3><p>Ref: https://wzg.ug/ref?code=${currentUser.phone}</p></div>`;
}

function renderTurntable(container) {
    container.innerHTML = `<div class="gold-border" style="text-align:center;"><h3>Lucky Wheel</h3><button class="gold-btn" type="button" onclick="alert('Won UGX 10,000!')">Spin</button></div>`;
}

function renderSalariesView(container) {
    container.innerHTML = `<div class="gold-border"><h3>Team Salaries</h3><p>Assigned Salary Active</p></div>`;
}

function renderMarketplace(container) {
    container.innerHTML = `<div class="gold-border"><h3>Marketplace</h3><p>Post Ads Here</p></div>`;
}

function renderAdminView(container) {
    container.innerHTML = `<div class="gold-border" style="border:2px solid red;"><h3>Master Admin (0795140634)</h3><p>Full control panel active.</p></div>`;
         }
         
