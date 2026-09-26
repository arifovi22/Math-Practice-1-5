var score = 0;
var streak = 0;
var progress = 0;
var currentAnswer = "";
var coachExplanationString = "";
var isMultipleChoice = false;

var subjectSelect = document.getElementById("subjectSelect");
var gradeSelect = document.getElementById("gradeSelect");
var questionText = document.getElementById("questionText");
var userAnswer = document.getElementById("userAnswer");
var submitBtn = document.getElementById("submitBtn");
var choicesContainer = document.getElementById("choicesContainer");
var inputContainer = document.getElementById("inputContainer");
var feedback = document.getElementById("feedback");
var scoreDisplay = document.getElementById("score");
var streakDisplay = document.getElementById("streak");
var progressBar = document.getElementById("progressBar");
var explanationBox = document.getElementById("explanationBox");
var explanationText = document.getElementById("explanationText");
var understandBtn = document.getElementById("understandBtn");

var canvas = document.getElementById("confetti-canvas");
var ctx = canvas ? canvas.getContext("2d") : null;
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
    if (!ctx) return;
    particles = [];
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

function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var active = false;

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

        if (p.y <= canvas.height) active = true;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
    }

    if (active) {
        requestAnimationFrame(animateConfetti);
    } else {
        particles = [];
    }
}

function resetUI() {
    userAnswer.value = "";
    feedback.innerText = "";
    feedback.className = "";
    explanationBox.classList.add("hidden");
    submitBtn.disabled = false;
    userAnswer.disabled = false;
    choicesContainer.innerHTML = "";
    isMultipleChoice = false;
    inputContainer.classList.remove("hidden");
    choicesContainer.classList.add("hidden");
}

function generateQuestion() {
    resetUI();
    var subject = subjectSelect.value;
    var grade = gradeSelect.value;

    if (subject === "math") {
        generateMathQuestion(grade);
    } else {
        generateELAQuestion(grade);
    }
}

function generateMathQuestion(grade) {
    if (grade === "1") {
        var n1 = Math.floor(Math.random() * 10) + 1;
        var n2 = Math.floor(Math.random() * 10) + 1;
        var op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        currentAnswer = (op === '+' ? n1 + n2 : n1 - n2).toString();
        questionText.innerText = n1 + " " + op + " " + n2 + " = ?";
        coachExplanationString = "Count starting at " + n1 + " and adjust by " + n2 + " steps to get " + currentAnswer + ".";

    } else if (grade === "2") {
        var n1 = Math.floor(Math.random() * 40) + 10;
        var n2 = Math.floor(Math.random() * 40) + 10;
        var op = Math.random() > 0.5 ? '+' : '-';
        if (op === '-' && n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        currentAnswer = (op === '+' ? n1 + n2 : n1 - n2).toString();
        questionText.innerText = n1 + " " + op + " " + n2 + " = ?";
        coachExplanationString = "Line up place values! Adding or subtracting columns gives " + currentAnswer + ".";

    } else if (grade === "3") {
        var n1 = Math.floor(Math.random() * 10) + 1;
        var n2 = Math.floor(Math.random() * 10) + 1;
        currentAnswer = (n1 * n2).toString();
        questionText.innerText = n1 + " × " + n2 + " = ?";
        coachExplanationString = "Adding groups of " + n2 + " exactly " + n1 + " times gives " + currentAnswer + ".";

    } else if (grade === "4") {
        var subType = Math.floor(Math.random() * 8);

        if (subType === 0) {
            var multiplier = Math.floor(Math.random() * 6) + 4;
            var baseNum = Math.floor(Math.random() * 5) + 3;
            currentAnswer = (multiplier * baseNum).toString();
            questionText.innerText = "A metro card ride costs $" + baseNum + ". A monthly pass costs " + multiplier + " times as much. How much does the pass cost?";
            coachExplanationString = "Multiplicative comparison! Multiply $" + baseNum + " × " + multiplier + " = **$" + currentAnswer + "**.";

        } else if (subType === 1) {
            var big1 = Math.floor(Math.random() * 4000) + 5000;
            var big2 = Math.floor(Math.random() * 3000) + 1000;
            currentAnswer = (big1 - big2).toString();
            questionText.innerText = "Subtract using columns: " + big1 + " − " + big2;
            coachExplanationString = "Subtract from right to left with borrowing: " + big1 + " − " + big2 + " = **" + currentAnswer + "**.";

        } else if (subType === 2) {
            var options = [12, 16, 20, 24, 36];
            var chosenComposite = options[Math.floor(Math.random() * options.length)];
            questionText.innerText = "Find any factor of " + chosenComposite + " greater than 1:";
            currentAnswer = "FACTOR_CHECK_" + chosenComposite;
            coachExplanationString = "Factors divide a number evenly with no remainder! Factors for " + chosenComposite + " include numbers like 2, 3, 4, or 6.";

        } else if (subType === 3) {
            var divisor = Math.floor(Math.random() * 4) + 3;
            var quotient = Math.floor(Math.random() * 15) + 10;
            var dividend = (divisor * quotient) + 2;
            currentAnswer = quotient.toString();
            questionText.innerText = "What is the whole-number quotient for: " + dividend + " ÷ " + divisor + "? (Ignore remainder)";
            coachExplanationString = divisor + " goes into " + dividend + " exactly **" + quotient + "** times (leaving a remainder of 2).";

        } else if (subType === 4) {
            var numer = Math.floor(Math.random() * 3) + 1;
            var denom = numer + Math.floor(Math.random() * 3) + 1;
            var scale = Math.floor(Math.random() * 3) + 2;
            
            var correctFrac = (numer * scale) + "/" + (denom * scale);
            var wrong1 = (numer + 1) + "/" + (denom * scale);
            var wrong2 = (numer * scale) + "/" + (denom + 2);
            var wrong3 = (numer + 2) + "/" + (denom + 1);

            questionText.innerText = "Which fraction is equivalent to " + numer + "/" + denom + "?";
            setupMultipleChoice(correctFrac, [correctFrac, wrong1, wrong2, wrong3]);
            coachExplanationString = "Multiply both top and bottom by " + scale + ": (" + numer + "×" + scale + ")/(" + denom + "×" + scale + ") = **" + correctFrac + "**.";

        } else if (subType === 5) {
            var d1 = (Math.floor(Math.random() * 80) + 10) / 100;
            var d2 = (Math.floor(Math.random() * 80) + 10) / 100;
            while (d1 === d2) { d2 = (Math.floor(Math.random() * 80) + 10) / 100; }
            
            var sym = d1 > d2 ? ">" : "<";
            currentAnswer = sym;
            questionText.innerText = "Which symbol makes this true? " + d1.toFixed(2) + "  [ ? ]  " + d2.toFixed(2) + "\n(Type > or <)";
            coachExplanationString = "Compare tenths first, then hundredths! " + d1.toFixed(2) + " is " + (d1 > d2 ? "greater than" : "less than") + " " + d2.toFixed(2) + ".";

        } else if (subType === 6) {
            var length = Math.floor(Math.random() * 6) + 4;
            var width = Math.floor(Math.random() * 4) + 2;
            var askArea = Math.random() > 0.5;

            if (askArea) {
                currentAnswer = (length * width).toString();
                questionText.innerText = "A playground in Brooklyn is " + length + " meters long and " + width + " meters wide. What is its AREA in sq meters?";
                coachExplanationString = "Area = length × width: " + length + " × " + width + " = **" + currentAnswer + " sq meters**.";
            } else {
                currentAnswer = (2 * (length + width)).toString();
                questionText.innerText = "A garden is " + length + " ft long and " + width + " ft wide. What is its PERIMETER in feet?";
                coachExplanationString = "Perimeter = 2 × (length + width): 2 × (" + length + " + " + width + ") = **" + currentAnswer + " ft**.";
            }

        } else {
            var angleTypes = [
                { type: "Acute", desc: "less than 90 degrees (e.g. 45°)" },
                { type: "Right", desc: "exactly 90 degrees" },
                { type: "Obtuse", desc: "greater than 90 degrees but less than 180 degrees (e.g. 120°)" }
            ];
            var chosen = angleTypes[Math.floor(Math.random() * angleTypes.length)];
            
            questionText.innerText = "What type of angle measures " + chosen.desc + "?";
            setupMultipleChoice(chosen.type, ["Acute", "Right", "Obtuse", "Straight"]);
            coachExplanationString = chosen.type + " angles are " + chosen.desc + ".";
        }

    } else if (grade === "5") {
        var n1 = (Math.floor(Math.random() * 40) + 10) / 10;
        var n2 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentAnswer = (parseFloat((n1 + n2).toFixed(1))).toString();
        questionText.innerText = n1 + " + " + n2 + " = ?";
        coachExplanationString = "Align the decimal points! Sum = " + currentAnswer + ".";
    }
}

function generateELAQuestion(grade) {
    if (grade === "4") {
        var subType = Math.floor(Math.random() * 4);

        if (subType === 0) {
            var items = [
                { text: "The subway train was as fast as a bullet.", type: "Simile", exp: "Uses 'as' to compare train and bullet." },
                { text: "The classroom was a zoo during recess.", type: "Metaphor", exp: "Directly states classroom WAS a zoo without using 'like' or 'as'." },
                { text: "Her smile was bright like the sunshine over Brooklyn.", type: "Simile", exp: "Uses 'like' to make a comparison." },
                { text: "Time is a thief that steals our afternoon.", type: "Metaphor", exp: "Directly compares time to a thief without using 'like' or 'as'." }
            ];
            var target = items[Math.floor(Math.random() * items.length)];
            questionText.innerText = "Is this sentence a Simile or a Metaphor?\n\"" + target.text + "\"";
            setupMultipleChoice(target.type, ["Simile", "Metaphor"]);
            coachExplanationString = "**" + target.type + "**: " + target.exp;

        } else if (subType === 1) {
            var items = [
                { q: "I wanted to ride my bike in Prospect Park, ___ it started to rain.", ans: "but", opts: ["but", "so", "or", "for"] },
                { q: "We can visit the museum, ___ we can go to the zoo.", ans: "or", opts: ["or", "because", "nor", "so"] },
                { q: "Maya studied hard for her NYC test, ___ she scored 100%.", ans: "so", opts: ["so", "but", "or", "yet"] }
            ];
            var target = items[Math.floor(Math.random() * items.length)];
            questionText.innerText = "Choose the best conjunction to complete the sentence:\n\"" + target.q + "\"";
            setupMultipleChoice(target.ans, target.opts);
            coachExplanationString = "Coordinating conjunctions join thoughts. **'" + target.ans + "'** fits the sentence meaning.";

        } else if (subType === 2) {
            var vocab = [
                { word: "gigantic", sentence: "The Empire State Building is a gigantic skyscraper that looms over the city.", answer: "Very large", choices: ["Very large", "Tiny", "Hidden", "Old"] },
                { word: "cautious", sentence: "Leo was cautious when crossing the busy street, looking both ways twice.", answer: "Careful", choices: ["Careful", "Fast", "Noisy", "Afraid"] },
                { word: "persist", sentence: "Even when the problem was tough, Sarah decided to persist until she found the answer.", answer: "Keep trying", choices: ["Keep trying", "Give up", "Sleep", "Forget"] }
            ];
            var target = vocab[Math.floor(Math.random() * vocab.length)];
            questionText.innerText = "What does '" + target.word + "' mean in this context?\n\"" + target.sentence + "\"";
            setupMultipleChoice(target.answer, target.choices);
            coachExplanationString = "Context clues show that **" + target.word + "** means '**" + target.answer + "**'.";

        } else {
            var target = {
                q: "Which sentence uses correct dialogue punctuation?",
                correct: "\"We are taking the subway to Queens,\" said Mom.",
                wrongs: [
                    "\"We are taking the subway to Queens\" said Mom.",
                    "We are taking the subway to Queens, said Mom.",
                    "\"We are taking the subway to Queens, said Mom.\""
                ]
            };
            questionText.innerText = target.q;
            setupMultipleChoice(target.correct, [target.correct, ...target.wrongs]);
            coachExplanationString = "Dialogue needs quotation marks around spoken words and a comma inside the closing quotes before the speech tag.";
        }
    } else {
        questionText.innerText = "Identify the noun in: 'The yellow taxi drove fast.'";
        setupMultipleChoice("taxi", ["drove", "taxi", "yellow", "fast"]);
        coachExplanationString = "'Taxi' is a thing (noun).";
    }
}

function setupMultipleChoice(correctAnswerVal, choicesArray) {
    isMultipleChoice = true;
    currentAnswer = correctAnswerVal;
    inputContainer.classList.add("hidden");
    choicesContainer.classList.remove("hidden");
    
    var shuffled = choicesArray.slice().sort(function() { return 0.5 - Math.random(); });
    
    shuffled.forEach(function(choice) {
        var btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.innerText = choice;
        btn.onclick = function() {
            checkAnswer(choice);
        };
        choicesContainer.appendChild(btn);
    });
}

function checkAnswer(selectedChoice) {
    var userIn = isMultipleChoice ? selectedChoice : userAnswer.value.trim();
    if (!userIn) return;

    submitBtn.disabled = true;
    userAnswer.disabled = true;

    var choiceBtns = choicesContainer.querySelectorAll("button");
    choiceBtns.forEach(function(btn) { btn.disabled = true; });

    var isCorrect = false;

    if (currentAnswer.indexOf("FACTOR_CHECK_") === 0) {
        var targetComposite = parseInt(currentAnswer.replace("FACTOR_CHECK_", ""));
        var parsedUser = parseInt(userIn);
        if (parsedUser > 1 && targetComposite % parsedUser === 0) {
            isCorrect = true;
        }
    } else {
        if (userIn.toLowerCase() === currentAnswer.toLowerCase()) {
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

        setTimeout(generateQuestion, 1800);
    } else {
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

document.addEventListener("DOMContentLoaded", function() {
    subjectSelect.addEventListener("change", generateQuestion);
    gradeSelect.addEventListener("change", generateQuestion);
    submitBtn.addEventListener("click", function() { checkAnswer(); });
    understandBtn.addEventListener("click", generateQuestion);
    userAnswer.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !submitBtn.disabled) checkAnswer();
    });
    generateQuestion();
});

if (document.readyState === "complete" || document.readyState === "interactive") {
    generateQuestion();
}
