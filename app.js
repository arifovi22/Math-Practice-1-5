var score = 0;
var streak = 0;
var progress = 0;
var currentAnswer = 0;
var coachExplanationString = "";

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
        var n1 = Math.floor(Math.random() * 10) + 1;
        var n2 = Math.floor(Math.random() * 10) + 1;
        var op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        currentAnswer = op === '+' ? n1 + n2 : n1 - n2;
        questionText.innerText = n1 + " " + op + " " + n2 + " = ?";
        coachExplanationString = "Let's count! Start at " + n1 + " and adjust by " + n2 + " steps to find " + currentAnswer + ".";

    } else if (grade === "2") {
        var n1 = Math.floor(Math.random() * 40) + 10;
        var n2 = Math.floor(Math.random() * 40) + 10;
        var op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        currentAnswer = op === '+' ? n1 + n2 : n1 - n2;
        questionText.innerText = n1 + " " + op + " " + n2 + " = ?";
        coachExplanationString = "Line up place values! Adding or subtracting columns gives you " + currentAnswer + ".";

    } else if (grade === "3") {
        var n1 = Math.floor(Math.random() * 10) + 1;
        var n2 = Math.floor(Math.random() * 10) + 1;
        currentAnswer = n1 * n2;
        questionText.innerText = n1 + " × " + n2 + " = ?";
        coachExplanationString = "Multiplication forms arrays! Adding groups of " + n2 + " exactly " + n1 + " times results in " + currentAnswer + ".";

    } else if (grade === "4") {
        // --- AUTHENTIC NYC PUBLIC SCHOOL 4TH GRADE SYLLABUS CHALLENGES ---
        var subType = Math.floor(Math.random() * 4);
        
        if (subType === 0) {
            // Benchmark: NY-4.OA.1 Multiplicative Comparison
            var multiplier = Math.floor(Math.random() * 6) + 4; // 4 to 9
            var baseNum = Math.floor(Math.random() * 5) + 3; // 3 to 7
            currentAnswer = multiplier * baseNum;
            questionText.innerText = "A red ball costs $" + baseNum + ". A game costs " + multiplier + " times as much. How much does the game cost?";
            coachExplanationString = "This is a <strong>multiplicative comparison</strong>! The problem tells us the object is " + multiplier + " times bigger than " + baseNum + ". Multiply " + baseNum + " × " + multiplier + " to get <strong>$" + currentAnswer + "</strong>.";
            
        } else if (subType === 1) {
            // Benchmark: NY-4.NBT.4 Large Multi-Digit standard arithmetic subtraction
            var big1 = Math.floor(Math.random() * 4000) + 5000; // 5000 - 9000
            var big2 = Math.floor(Math.random() * 3000) + 1000; // 1000 - 4000
            currentAnswer = big1 - big2;
            questionText.innerText = "Solve using columns: " + big1 + " − " + big2;
            coachExplanationString = "NYC standards require column precision. Subtract from right to left, borrowing fields where necessary: " + big1 + " − " + big2 + " = <strong>" + currentAnswer + "</strong>.";

        } else if (subType === 2) {
            // Benchmark: NY-4.OA.4 Factors & Multiples
            var options = [12, 16, 20, 24, 36];
            var chosenComposite = options[Math.floor(Math.random() * options.length)];
            // Find a valid factor bundle matching target bounds
            var factorsArr = [];
            for (var f = 1; f <= chosenComposite; f++) {
                if (chosenComposite % f === 0) factorsArr.push(f);
            }
            // Pull out a single target item
            var finalFactor = factorsArr[Math.floor(Math.random() * (factorsArr.length - 1)) + 1];
            currentAnswer = finalFactor;
            questionText.innerText = "Which number is a factor pair option for " + chosenComposite + "? (Try counting numbers that divide it evenly)";
            // For simplicity in automatic numerical text field validation, we accept any matching factor
            questionText.innerText = "Find any factor of " + chosenComposite + " greater than 1:";
            currentAnswer = finalFactor; // We will check if it divides cleanly in validation logic instead of hardcoding
            coachExplanationString = "Factors divide a host composite number completely evenly with no remainders! Numbers like 2, 3, 4, or 6 multiply up neatly to reach " + chosenComposite + ".";

        } else {
            // Benchmark: NY-4.NBT.6 Division with Remainders
            var divisor = Math.floor(Math.random() * 4) + 3; // 3 to 6
            var quotient = Math.floor(Math.random() * 15) + 10; // 10 to 24
            var dividend = (divisor * quotient) + 2; // guarantees remainder of 2
            currentAnswer = quotient;
            questionText.innerText = "What is the whole-number answer (quotient) for: " + dividend + " ÷ " + divisor + "? (Ignore the remainder left over)";
            coachExplanationString = "Divide step by step! " + divisor + " goes into " + dividend + " exactly <strong>" + quotient + "</strong> times, leaving a small leftover remainder of 2.";
        }

    } else if (grade === "5") {
        var n1 = (Math.floor(Math.random() * 40) + 10) / 10;
        var n2 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentAnswer = parseFloat((n1 + n2).toFixed(1));
        questionText.innerText = n1 + " + " + n2 + " = ?";
        coachExplanationString = "Align the decimal points perfectly! Adding columns gives you " + currentAnswer + ".";
    }
}

function checkAnswer() {
    var userIn = userAnswer.value;
    if (userIn === "") return;

    submitBtn.disabled = true;
    userAnswer.disabled = true;
    
    var isCorrect = false;
    var parsedUser = parseFloat(userIn);
    var grade = gradeSelect.value;

    // Custom check rule override for Grade 4 factors challenge tracking
    if (grade === "4" && questionText.innerText.indexOf("factor") !== -1) {
        var matchNumbers = questionText.innerText.match(/\d+/);
        if (matchNumbers) {
            var targetComposite = parseInt(matchNumbers[0]);
            if (parsedUser > 1 && targetComposite % parsedUser === 0) {
                isCorrect = true;
            }
        }
    } else {
        if (parsedUser === currentAnswer) {
            isCorrect = true;
        }
    }

    if (isCorrect) {
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
        // Grade 4 explicit check fallback values override safety mapping
        var displayAns = currentAnswer;
        if (grade === "4" && questionText.innerText.indexOf("factor") !== -1) {
            var matchNums = questionText.innerText.match(/\d+/);
            displayAns = "a valid number that divides it cleanly";
        }

        feedback.innerText = "❌ Oops! Let's check the rules.";
        feedback.className = "wrong-text";
        streak = 0;
        progress = Math.max(progress - 10, 0);
        progressBar.style.width = progress + "%";
        explanationText.innerHTML = coachExplanationString;
        explanationBox.classList.remove("hidden");
    }
    scoreDisplay.innerText = score;
    streakDisplay.innerText = streak;
}
// Attach events safely after complete load
document.addEventListener("DOMContentLoaded", function() {
    gradeSelect.addEventListener("change", generateQuestion);
    submitBtn.addEventListener("click", checkAnswer);
    understandBtn.addEventListener("click", generateQuestion);
    userAnswer.addEventListener("keydown", 
                                function(e) {
                                    if (e.key === "Enter" && !submitBtn.disabled) checkAnswer();
                                });
    generateQuestion();
});
// Fallback boot run just in case DOMContentLoaded already fired
if (document.readyState === "complete" || document.readyState === "interactive") {
    generateQuestion();
}
        
