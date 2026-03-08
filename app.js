const baseGoal = 8;
const today = new Date().toISOString().slice(0,10);

let glasses = parseInt(localStorage.getItem(today)) || 0;
let history = JSON.parse(localStorage.getItem("history")) || {};

updateUI();
updateHistory();

// ---------------- Water Functions ----------------
function drinkWater() {
    glasses++;
    if(glasses > baseGoal) glasses = baseGoal;
    localStorage.setItem(today, glasses);
    updateUI();
    updateHistory();
    createWaterDrop();
}

function resetDay() {
    glasses = 0;
    localStorage.setItem(today, glasses);
    updateUI();
    updateHistory();
}

function updateUI() {
    const progress = glasses / baseGoal * 100;
    const progressBar = document.getElementById("progressBar");
    progressBar.style.width = progress + "%";

    if(progress < 50) progressBar.style.backgroundColor = "#00aaff";
    else if(progress < 100) progressBar.style.backgroundColor = "#ff9800";
    else progressBar.style.backgroundColor = "#4caf50";

    document.getElementById("count").innerText = `${glasses} / ${baseGoal}`;

    let msgDiv = document.getElementById("goalMessage");
    if(!msgDiv){
        msgDiv = document.createElement("div");
        msgDiv.id = "goalMessage";
        document.querySelector(".container").appendChild(msgDiv);
    }

    if(glasses >= baseGoal){
        msgDiv.innerHTML = "🎉 Goal achieved! Great job! 💧";
    } else {
        msgDiv.innerHTML = "Keep going ma girl! You can do it! 🤫";
    }
}

// ---------------- Water Drop Animation ----------------
function createWaterDrop(){
    const drop = document.createElement("div");
    drop.className = "drop";
    drop.style.left = Math.random() * 80 + "%";
    document.getElementById("waterDrops").appendChild(drop);
    setTimeout(() => drop.remove(), 1000);
}

// ---------------- Weekly History ----------------
function updateHistory() {
    history[today] = glasses;
    localStorage.setItem("history", JSON.stringify(history));

    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";
    let days = Object.keys(history).sort().slice(-7);
    days.forEach(day => {
        let status = history[day] >= baseGoal ? "✔" : "⚠";
        historyDiv.innerHTML += `${day}: ${history[day]}/${baseGoal} ${status}<br>`;
    });
}

function notify(message = "Arshii drink water now! 🤫🤫🤫🤫") {
    if(Notification.permission === "granted"){
        new Notification("💧 SmartHydrate Reminder", { body: message });
    }
}
if(Notification.permission !== "granted") Notification.requestPermission();

// ---------------- Hourly Reminders ----------------
setInterval(() => {
    const now = new Date();
    const minutes = now.getMinutes();

    // Only trigger at the start of each hour
    if(minutes === 0 && glasses < baseGoal){
        notify(`You drank ${glasses}/${baseGoal} glasses. Arshii Time to drink more water! 💧`);
    }
}, 60000); // check every minute

// ---------------- Temperature Alert ----------------
fetch("https://api.open-meteo.com/v1/forecast?latitude=24.45&longitude=54.37&current_weather=true")
.then(res=>res.json())
.then(data=>{
    let temp = data.current_weather.temperature;
    document.getElementById("weather").innerText = `🌡 Temperature: ${temp}°C`;
    if(temp>30) alert("🔥 Very hot today! Drink extra water Arshiii.");
});