// Math Quest Academy — NYC Grade 4 Math + ELA practice
// Aligned to NYS Next Generation Learning Standards used by NYC public schools.
// The Grade 4 Math track covers OA, NBT, NF, MD and G.
// The Grade 4 ELA track covers Reading, Writing, Language and Speaking/Listening.

var score = 0;
var streak = 0;
var progress = 0;
var currentAnswer = null;
var currentQuestion = null;
var selectedOption = null;
var coachExplanationString = "";

var subjectSelect = document.getElementById("subjectSelect");
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
var optionsBox = document.getElementById("optionsBox");
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
    if (!ctx || !canvas) return;
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
    if (!ctx || !canvas) return;
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

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = copy[i];
        copy[i] = copy[j];
        copy[j] = t;
    }
    return copy;
}

function setQuestionUI(type) {
    selectedOption = null;
    feedback.innerText = "";
    feedback.className = "";
    explanationBox.classList.add("hidden");
    submitBtn.disabled = false;
    userAnswer.disabled = false;

    if (type === "mcq") {
        userAnswer.classList.add("hidden");
        optionsBox.classList.remove("hidden");
        submitBtn.classList.remove("hidden");
    } else {
        userAnswer.classList.remove("hidden");
        optionsBox.classList.add("hidden");
        submitBtn.classList.remove("hidden");
        userAnswer.value = "";
        userAnswer.focus();
    }
}

function makeMathQuestion(question, answer, explanation, standard) {
    currentQuestion = { type: "number", standard: standard };
    currentAnswer = answer;
    coachExplanationString = "<strong>" + standard + "</strong><br>" + explanation;
    questionText.innerHTML = question;
    setQuestionUI("number");
}

function makeELAQuestion(question, options, answer, explanation, standard) {
    currentQuestion = { type: "mcq", standard: standard };
    currentAnswer = answer;
    coachExplanationString = "<strong>" + standard + "</strong><br>" + explanation;
    questionText.innerHTML = question;
    optionsBox.innerHTML = "";

    shuffle(options).forEach(function(option) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "answer-option";
        btn.innerText = option;
        btn.dataset.answer = option;
        btn.addEventListener("click", function() {
            var buttons = optionsBox.querySelectorAll(".answer-option");
            buttons.forEach(function(b) { b.classList.remove("selected"); });
            btn.classList.add("selected");
            selectedOption = option;
        });
        optionsBox.appendChild(btn);
    });

    setQuestionUI("mcq");
}

function generateMathGrade4() {
    // Weighted coverage of the major Grade 4 NYS/NYC math domains.
    var type = randInt(1, 16);

    if (type === 1) {
        var base = randInt(3, 12), mult = randInt(2, 9);
        makeMathQuestion(
            "A book costs $" + base + ". A board game costs " + mult + " times as much. How much does the board game cost?",
            base * mult,
            "“Times as much” tells us to multiply: " + base + " × " + mult + " = <strong>$" + (base * mult) + "</strong>.",
            "NY-4.OA.1"
        );
    } else if (type === 2) {
        var a = randInt(1000, 9000), b = randInt(100, 900), c = randInt(20, 300);
        var ans2 = a - b + c;
        makeMathQuestion(
            "A library has " + a + " books. It lends " + b + " books and receives " + c + " new books. How many books are there now?",
            ans2,
            "Solve in steps: " + a + " − " + b + " = " + (a - b) + "; then " + (a - b) + " + " + c + " = <strong>" + ans2 + "</strong>.",
            "NY-4.OA.3"
        );
    } else if (type === 3) {
        var n = [12, 18, 20, 24, 28, 30, 36, 40, 42, 48][randInt(0, 9)];
        var factors = [];
        for (var f = 2; f <= n; f++) if (n % f === 0) factors.push(f);
        var factor = factors[randInt(0, factors.length - 1)];
        makeMathQuestion(
            "Which number is a factor of " + n + "?",
            factor,
            factor + " divides " + n + " evenly: " + n + " ÷ " + factor + " = " + (n / factor) + ".",
            "NY-4.OA.4"
        );
    } else if (type === 4) {
        var composite = [9, 15, 21, 25, 27, 35, 39, 49][randInt(0, 7)];
        makeMathQuestion(
            "Is " + composite + " prime or composite? Enter 1 for prime or 0 for composite.",
            0,
            composite + " has factors other than 1 and itself, so it is <strong>composite</strong>.",
            "NY-4.OA.4"
        );
    } else if (type === 5) {
        var start = randInt(2, 20), step = randInt(2, 9), term = start + step * 4;
        makeMathQuestion(
            "A pattern starts " + start + ", " + (start + step) + ", " + (start + step * 2) + ", " + (start + step * 3) + ". What is the next number?",
            term,
            "The rule is “add " + step + ".” So the next term is " + (term - step) + " + " + step + " = <strong>" + term + "</strong>.",
            "NY-4.OA.5"
        );
    } else if (type === 6) {
        var num = randInt(10000, 999999), place = [1000, 10000, 100000][randInt(0, 2)];
        var rounded = Math.round(num / place) * place;
        makeMathQuestion(
            "Round " + num.toLocaleString() + " to the nearest " + place.toLocaleString() + ".",
            rounded,
            "Look at the digit immediately to the right of the " + place.toLocaleString() + "s place. Round up if it is 5 or more.",
            "NY-4.NBT.3"
        );
    } else if (type === 7) {
        var x = randInt(200, 999), y = randInt(200, 999);
        makeMathQuestion(
            "Solve: " + x.toLocaleString() + " + " + y.toLocaleString(),
            x + y,
            "Add by place value from right to left. The sum is <strong>" + (x + y).toLocaleString() + "</strong>.",
            "NY-4.NBT.4"
        );
    } else if (type === 8) {
        var m = randInt(20, 99), k = randInt(2, 9);
        makeMathQuestion(
            "Solve: " + m + " × " + k,
            m * k,
            "You can use an area model, partial products, or another efficient strategy. " + m + " × " + k + " = <strong>" + (m * k) + "</strong>.",
            "NY-4.NBT.5"
        );
    } else if (type === 9) {
        var divisor = randInt(2, 9), quotient = randInt(10, 50), rem = randInt(0, divisor - 1);
        var dividend = divisor * quotient + rem;
        makeMathQuestion(
            "What is the quotient when " + dividend + " ÷ " + divisor + "? Enter the whole-number quotient only.",
            quotient,
            divisor + " × " + quotient + " = " + (divisor * quotient) + ", leaving a remainder of " + rem + ".",
            "NY-4.NBT.6"
        );
    } else if (type === 10) {
        var denom = [2, 3, 4, 5, 6, 8, 10, 12][randInt(0, 7)];
        var whole = randInt(1, 5);
        var num = randInt(1, denom - 1);
        var eqNum = num * 2, eqDen = denom * 2;
        makeMathQuestion(
            "What numerator makes an equivalent fraction? " + num + "/" + denom + " = ?/" + eqDen,
            eqNum,
            "Multiply the numerator and denominator by 2: " + num + "/" + denom + " = <strong>" + eqNum + "/" + eqDen + "</strong>.",
            "NY-4.NF.1"
        );
    } else if (type === 11) {
        var d = [2, 3, 4, 5, 6, 8, 10, 12][randInt(0, 7)];
        var p = randInt(1, d - 1), q = randInt(1, d - 1);
        makeMathQuestion(
            "Add: " + p + "/" + d + " + " + q + "/" + d + ". Enter the numerator of the answer.",
            p + q,
            "The denominators are already the same, so add the numerators: " + p + " + " + q + " = <strong>" + (p + q) + "</strong>.",
            "NY-4.NF.3"
        );
    } else if (type === 12) {
        var fd = [2, 3, 4, 5, 6, 8, 10, 12][randInt(0, 7)];
        var fn = randInt(1, fd - 1), wholeNum = randInt(2, 6);
        makeMathQuestion(
            "Find " + wholeNum + " × " + fn + "/" + fd + ". Enter the numerator of the fraction before simplifying.",
            wholeNum * fn,
            "Multiply the whole number by the numerator: " + wholeNum + " × " + fn + " = <strong>" + (wholeNum * fn) + "</strong>, keeping the denominator " + fd + ".",
            "NY-4.NF.4"
        );
    } else if (type === 13) {
        var feet = randInt(2, 8);
        makeMathQuestion(
            "How many inches are in " + feet + " feet?",
            feet * 12,
            "There are 12 inches in 1 foot, so " + feet + " × 12 = <strong>" + (feet * 12) + " inches</strong>.",
            "NY-4.MD.1"
        );
    } else if (type === 14) {
        var length = randInt(4, 20), width = randInt(3, 12);
        makeMathQuestion(
            "A rectangle is " + length + " units long and " + width + " units wide. What is its area?",
            length * width,
            "Area of a rectangle = length × width. " + length + " × " + width + " = <strong>" + (length * width) + " square units</strong>.",
            "NY-4.MD.3"
        );
    } else if (type === 15) {
        var angleType = randInt(1, 3);
        var angle = angleType === 1 ? randInt(10, 89) : angleType === 2 ? 90 : randInt(91, 170);
        var label = angle < 90 ? "acute" : angle === 90 ? "right" : "obtuse";
        makeMathQuestion(
            "An angle measures " + angle + "°. Enter 1 for acute, 2 for right, or 3 for obtuse.",
            angleType,
            "An angle less than 90° is acute, exactly 90° is right, and greater than 90° but less than 180° is obtuse. This one is <strong>" + label + "</strong>.",
            "NY-4.G.1"
        );
    } else {
        var quad = randInt(1, 4);
        var names = {1:"rectangle", 2:"square", 3:"parallelogram", 4:"rhombus"};
        makeMathQuestion(
            "A quadrilateral has two pairs of parallel sides. Which family member is it? Enter 1 for rectangle, 2 for square, 3 for parallelogram, or 4 for rhombus.",
            quad === 2 ? 2 : 3,
            "A parallelogram is a quadrilateral with two pairs of parallel sides. Rectangles, squares, and rhombi are special types of parallelograms.",
            "NY-4.G.2"
        );
    }
}

var elaQuestions = [
    {
        q: 'Read: "Maya packed an umbrella before leaving for school because dark clouds covered the sky." What can the reader infer?',
        o: ["It might rain.", "It will definitely snow.", "Maya forgot her backpack.", "The sky is clear."],
        a: "It might rain.",
        e: "The dark clouds and the umbrella are clues. The text does not say it will definitely rain, so the best inference is that rain may be coming.",
        s: "NY-4R1"
    },
    {
        q: 'Read: "The city park was busy. Families spread blankets on the grass, children played soccer, and musicians performed near the fountain." What is the main idea?',
        o: ["The fountain is broken.", "The park is busy with different activities.", "Only musicians visit the park.", "Families never use the park."],
        a: "The park is busy with different activities.",
        e: "The details about families, soccer, and musicians all support the main idea that the park is active and busy.",
        s: "NY-4R2"
    },
    {
        q: 'In the sentence "The enormous whale surfaced beside the boat," what does "enormous" mean?',
        o: ["very large", "very quiet", "very fast", "very young"],
        a: "very large",
        e: "Enormous means extremely large. The sentence uses the word to describe the whale's size.",
        s: "NY-4R4"
    },
    {
        q: 'Which detail best supports the idea that a character is determined?',
        o: ["She practiced the piano every day after making mistakes.", "She owned a blue backpack.", "She ate an apple at lunch.", "She sat beside a window."],
        a: "She practiced the piano every day after making mistakes.",
        e: "Continuing to practice after mistakes is evidence of determination.",
        s: "NY-4R1"
    },
    {
        q: 'A passage explains how recycling paper reduces waste and describes the steps for recycling. What text structure is most likely being used?',
        o: ["sequence / process", "fictional dialogue", "rhyming poem", "character description only"],
        a: "sequence / process",
        e: "When a text explains steps in an order, it often uses a sequence or process structure.",
        s: "NY-4R5"
    },
    {
        q: 'Which sentence correctly uses a comma after an introductory word?',
        o: ["However, we finished the project on time.", "However we, finished the project on time.", "However we finished, the project on time.", "However we finished the project, on time."],
        a: "However, we finished the project on time.",
        e: "A comma can follow an introductory word such as “However.”",
        s: "NY-4L2"
    },
    {
        q: 'Which sentence uses a complete sentence and correct capitalization?',
        o: ["The students visited the museum.", "the students visited the museum.", "The students visited the museum", "the Students visited the Museum."],
        a: "The students visited the museum.",
        e: "A complete sentence begins with a capital letter and ends with appropriate punctuation.",
        s: "NY-4L1"
    },
    {
        q: 'Which word is a synonym for "ancient"?',
        o: ["old", "new", "tiny", "noisy"],
        a: "old",
        e: "Ancient means very old or from a long time ago.",
        s: "NY-4L5"
    },
    {
        q: 'Which revision adds a sensory detail? Original: "The soup was good."',
        o: ["The warm soup smelled like garlic and tasted savory.", "The soup was soup.", "The soup was in a bowl.", "The soup existed."],
        a: "The warm soup smelled like garlic and tasted savory.",
        e: "Sensory details tell what something looks, sounds, smells, tastes, or feels like.",
        s: "NY-4W3"
    },
    {
        q: 'Which sentence is the strongest topic sentence for a paragraph about why bees are important?',
        o: ["Bees play an important role in helping plants grow.", "I saw a bee yesterday.", "Bees are insects.", "My favorite color is yellow."],
        a: "Bees play an important role in helping plants grow.",
        e: "A strong topic sentence introduces the main idea the paragraph will explain.",
        s: "NY-4W2"
    },
    {
        q: 'Which sentence correctly uses quotation marks for dialogue?',
        o: ['"Please bring your book," said Luis.', 'Please "bring your book, said Luis.', '"Please bring your book, said Luis.', 'Please bring "your book," said Luis.'],
        a: '"Please bring your book," said Luis.',
        e: "Quotation marks surround the speaker’s exact words.",
        s: "NY-4L2"
    },
    {
        q: 'A student reads two sources about the same animal and takes notes from both. Which skill is the student practicing?',
        o: ["gathering and organizing information from sources", "solving a multiplication problem", "measuring an angle", "identifying a factor"],
        a: "gathering and organizing information from sources",
        e: "Using multiple sources and taking notes supports Grade 4 research skills.",
        s: "NY-4W6 / NY-4W7"
    },
    {
        q: 'Which response best supports an idea with evidence from a text?',
        o: ['The character is brave because she enters the dark room even though she is scared.', 'The character is brave because I like her.', 'The character is brave because the story is long.', 'The character is brave because the cover is blue.'],
        a: 'The character is brave because she enters the dark room even though she is scared.',
        e: "Strong text-based responses state an idea and support it with a relevant detail from the text.",
        s: "NY-4R1 / NY-4W5"
    },
    {
        q: 'Which transition best shows that one event happened after another?',
        o: ["Next", "Because", "Although", "Instead"],
        a: "Next",
        e: "“Next” clearly signals the following step or event in a sequence.",
        s: "NY-4W3c"
    },
    {
        q: 'Which statement is appropriate for a classroom discussion?',
        o: ["I agree with your idea, and my evidence is...", "You are wrong. Stop talking.", "I do not need evidence.", "Only my answer matters."],
        a: "I agree with your idea, and my evidence is...",
        e: "Grade 4 speaking and listening includes responding to others and supporting ideas with evidence.",
        s: "NY-4SL1"
    }
];

function generateELA() {
    var item = elaQuestions[randInt(0, elaQuestions.length - 1)];
    makeELAQuestion(item.q, item.o, item.a, item.e, item.s);
}

function generateQuestion() {
    var subject = subjectSelect.value;
    var grade = gradeSelect.value;

    if (subject === "ela" && grade !== "4") {
        grade = "4";
        gradeSelect.value = "4";
    }

    if (subject === "math") {
        if (grade === "4") generateMathGrade4();
        else {
            // Keep the existing broad practice tracks for Grades 1–3 and 5.
            generateLegacyMath(grade);
        }
    } else {
        generateELA();
    }
}

function generateLegacyMath(grade) {
    var n1, n2, op;
    if (grade === "1") {
        n1 = randInt(1, 10); n2 = randInt(1, 10); op = Math.random() > 0.5 ? "+" : "-";
        if (op === "-" && n1 < n2) { var t = n1; n1 = n2; n2 = t; }
        makeMathQuestion(n1 + " " + op + " " + n2 + " = ?", op === "+" ? n1+n2 : n1-n2,
            "Start with " + n1 + " and count " + (op === "+" ? "forward" : "back") + " " + n2 + " steps.",
            "Grade 1 practice");
    } else if (grade === "2") {
        n1 = randInt(10, 49); n2 = randInt(10, 49); op = Math.random() > 0.5 ? "+" : "-";
        if (op === "-" && n1 < n2) { var t2 = n1; n1 = n2; n2 = t2; }
        makeMathQuestion(n1 + " " + op + " " + n2 + " = ?", op === "+" ? n1+n2 : n1-n2,
            "Line up the ones and tens places, then calculate.",
            "Grade 2 practice");
    } else if (grade === "3") {
        n1 = randInt(2, 10); n2 = randInt(2, 10);
        makeMathQuestion(n1 + " × " + n2 + " = ?", n1*n2,
            "Think of equal groups or an array: " + n1 + " groups of " + n2 + ".",
            "Grade 3 practice");
    } else {
        n1 = randInt(10, 49) / 10; n2 = randInt(10, 49) / 10;
        var ans = parseFloat((n1+n2).toFixed(1));
        makeMathQuestion(n1.toFixed(1) + " + " + n2.toFixed(1) + " = ?", ans,
            "Align the decimal points before adding.",
            "Grade 5 practice");
    }
}

function checkAnswer() {
    if (!currentQuestion) return;

    var isCorrect = false;
    var raw = userAnswer.value.trim();

    if (currentQuestion.type === "mcq") {
        // ELA answers are buttons, so validate the selected option directly.
        if (selectedOption === null) {
            feedback.innerText = "👆 Choose an answer first!";
            feedback.className = "wrong-text";
            return;
        }
        isCorrect = selectedOption === currentAnswer;
    } else {
        if (raw === "") return;
        var parsedUser = parseFloat(raw);
        isCorrect = parsedUser === currentAnswer;
    }

    submitBtn.disabled = true;
    userAnswer.disabled = true;
    var buttons = optionsBox.querySelectorAll(".answer-option");
    buttons.forEach(function(b) { b.disabled = true; });

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

        scoreDisplay.innerText = score;
        streakDisplay.innerText = streak;
        setTimeout(generateQuestion, 1500);
    } else {
        feedback.innerText = "❌ Not quite. Let's use the Math Coach.";
        feedback.className = "wrong-text";
        streak = 0;
        progress = Math.max(progress - 10, 0);
        progressBar.style.width = progress + "%";
        explanationText.innerHTML = coachExplanationString;
        explanationBox.classList.remove("hidden");
        scoreDisplay.innerText = score;
        streakDisplay.innerText = streak;

        // Show the correct ELA option after an incorrect attempt.
        buttons.forEach(function(b) {
            if (b.dataset.answer === currentAnswer) b.classList.add("correct-option");
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    subjectSelect.addEventListener("change", function() {
        if (subjectSelect.value === "ela") {
            gradeSelect.value = "4";
            gradeSelect.disabled = true;
        } else {
            gradeSelect.disabled = false;
        }
        generateQuestion();
    });

    gradeSelect.addEventListener("change", generateQuestion);
    submitBtn.addEventListener("click", checkAnswer);
    understandBtn.addEventListener("click", generateQuestion);

    userAnswer.addEventListener("keydown", function(e) {
        if (e.key === "Enter" && !submitBtn.disabled) checkAnswer();
    });

    generateQuestion();
});
