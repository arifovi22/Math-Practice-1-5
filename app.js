var score = 0;
var streak = 0;
var progress = 0;
var currentAnswer = 0;
var currentNum1 = 0;
var currentNum2 = 0;
var currentOp = '';

var gradeSelect = document.getElementById("gradeSelect");
var questionText = document.getElementById("questionText");
var userAnswer = document.getElementById("userAnswer");
var submitBtn = document.getElementById("submitBtn");
var feedback = document.getElementById("feedback");
var scoreDisplay = document.getElementById("score");
var streakDisplay = document.getElementById("streak");
var progressBar = document.getElementById("progressBar");
var explanationBox = document.getElementById("explanationBox");
var explanationText = document.getElementById("explanationText");
var understandBtn = document.getElementById("understandBtn");

var canvas = document.getElementById("confetti-canvas");
var ctx = canvas.getContext("2d");
var particles = [];
var colors = ["#facc15", "#f43f5e", "#3b82f6", "#10b981", "#a855f7", "#f97316"];

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function spawnConfetti() {
    for (var i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    animateConfetti();
}

var animationFrameId;
function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var active = false;

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        if (p.y <= canvas.height) {
            active = true;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
    }

    if (active) {
        animationFrameId = requestAnimationFrame(animateConfetti);
    } else {
        particles = [];
    }
}

function generateQuestion() {
    var grade = gradeSelect.value;
    userAnswer.value = "";
    feedback.innerText = "";
    feedback.className = "";
    explanationBox.classList.add("hidden");
    
    submitBtn.disabled = false;
    userAnswer.disabled = false;

    if (grade === "1") {
        currentNum1 = Math.floor(Math.random() * 10) + 1;
        currentNum2 = Math.floor(Math.random() * 10) + 1;
        currentOp = Math.random() > 0.5 ? '+' : '-';
        if (currentOp === '-' && currentNum1 < currentNum2) {
            var temp1 = currentNum1;
            currentNum1 = currentNum2;
            currentNum2 = temp1;
        }
        currentAnswer = currentOp === '+' ? currentNum1 + currentNum2 : currentNum1 - currentNum2;
        questionText.innerText = currentNum1 + " " + currentOp + " " + currentNum2 + " = ?";

    } else if (grade === "2") {
        currentNum1 = Math.floor(Math.random() * 40) + 10;
        currentNum2 = Math.floor(Math.random() * 40) + 10;
        currentOp = Math.random() > 0.5 ? '+' : '-';
        if (currentOp === '-' && currentNum1 < currentNum2) {
            var temp2 = currentNum1;
            currentNum1 = currentNum2;
            currentNum2 = temp2;
        }
        currentAnswer = currentOp === '+' ? currentNum1 + currentNum2 : currentNum1 - currentNum2;
        questionText.innerText = currentNum1 + " " + currentOp + " " + currentNum2 + " = ?";

    } else if (grade === "3") {
        currentNum1 = Math.floor(Math.random() * 10) + 1;
        currentNum2 = Math.floor(Math.random() * 10) + 1;
        currentOp = '×';
        currentAnswer = currentNum1 * currentNum2;
        questionText.innerText = currentNum1 + " × " + currentNum2 + " = ?";

    } else if (grade === "4") {
        currentNum2 = Math.floor(Math.random() * 8) + 2; 
        currentAnswer = Math.floor(Math.random() * 9) + 1;
        currentNum1 = currentNum2 * currentAnswer; 
        currentOp = '÷';
        questionText.innerText = currentNum1 + " ÷ " + currentNum2 + " = ?";

    } else if (grade === "5") {
        currentNum1 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentNum2 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentOp = '+';
        currentAnswer = parseFloat((currentNum1 + currentNum2).toFixed(1));
        questionText.innerText = currentNum1 + " + " + currentNum2 + " = ?";
    }
}

function getCoachExplanation() {
    if (currentOp === '+') {
        if (gradeSelect.value === "5") {
            return "Let's line up the decimals! Look at <strong>" + currentNum1 + "</strong> and <strong>" + currentNum2 + "</strong>. Add the numbers behind the decimal point first, then add the whole numbers together. That gives us exactly <strong>" + currentAnswer + "</strong>!";
        }
        return "Let's count up! Start with the bigger number <strong>" + currentNum1 + "</strong>, and count forward <strong>" + currentNum2 + "</strong> more numbers. You will land right on <strong>" + currentAnswer + "</strong>!";
    } else if (currentOp === '-') {
        return "Let's take away! Imagine you have <strong>" + currentNum1 + "</strong> stars and you lose <strong>" + currentNum2 + "</strong> of them. You are left with exactly <strong>" + currentAnswer + "</strong> stars!";
    } else if (currentOp === '×') {
        return "Multiplication means adding equal groups! <strong>" + currentNum1 + " × " + currentNum2 + "</strong> means counting the number <strong>" + currentNum2 + "</strong> a total of <strong>" + currentNum1 + "</strong> times. That equals <strong>" + currentAnswer + "</strong>!";
    } else if (currentOp === '÷') {
        return "Division means sharing equally! Imagine sharing <strong>" + currentNum1 + "</strong> candies fairly among <strong>" + currentNum2 + "</strong> friends. Each friend gets exactly <strong>" + currentAnswer + "</strong> candies!";
    }
    return "Take your time, let's try the next one together!";
}

function checkAnswer() {
    var userIn = userAnswer.value;
    if (userIn === "") return;

    submitBtn.disabled = true;
    userAnswer.disabled = true;

    if (parseFloat(userIn) === currentAnswer) {
        feedback.innerText = "🎉 Way to go! Correct! 🌟";
        feedback.className = "correct-text";
        score += 10;
        streak += 1;
        
        progress = Math.min(progress + 20, 100);
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
            feedback.innerText = "🏆 AMAZING! LEVEL UP! 🚀";
            spawnConfetti(); 
            progress = 0;
            setTimeout(function() { progressBar.style.width = "0%"; }, 1200);
        }
        
        setTimeout(generateQuestion, 2000);
    } else {
        feedback.innerText = "❌ Oops! The correct answer was " + currentAnswer;
        feedback.className = "wrong-text";
        streak = 0;
        
        progress = Math.max(progress - 10, 0);
        progressBar.style.width = progress + "%";

        explanationText.innerHTML = getCoachExplanation();
        explanationBox.classList.remove("hidden");
    }

    scoreDisplay.innerText = score;
    streakDisplay.innerText = streak;
}

gradeSelect.addEventListener("change", generateQuestion);
submitBtn.addEventListener("click", checkAnswer);
understandBtn.addEventListener("click", generateQuestion); 

userAnswer.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !submitBtn.disabled) checkAnswer();
});

generateQuestion();
