// Game variables
let score = 0;
let streak = 0;
let currentAnswer = 0;

// Configuration settings you can modify anytime
const difficultyLimits = {
    grade1Max: 10,
    grade2Max: 50,
    grade3Max: 12
};

// UI Elements
const gradeSelect = document.getElementById("gradeSelect");
const questionText = document.getElementById("questionText");
const userAnswer = document.getElementById("userAnswer");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");

function generateQuestion() {
    const grade = gradeSelect.value;
    userAnswer.value = "";
    feedback.innerText = "";
    let num1, num2, operation;

    if (grade === "1") {
        num1 = Math.floor(Math.random() * difficultyLimits.grade1Max) + 1;
        num2 = Math.floor(Math.random() * difficultyLimits.grade1Max) + 1;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        currentAnswer = operation === '+' ? num1 + num2 : num1 - num2;
        questionText.innerText = `${num1} ${operation} ${num2} = ?`;

    } else if (grade === "2") {
        num1 = Math.floor(Math.random() * difficultyLimits.grade2Max) + 10;
        num2 = Math.floor(Math.random() * difficultyLimits.grade2Max) + 10;
        operation = Math.random() > 0.5 ? '+' : '-';
        if (operation === '-' && num1 < num2) [num1, num2] = [num2, num1];
        currentAnswer = operation === '+' ? num1 + num2 : num1 - num2;
        questionText.innerText = `${num1} ${operation} ${num2} = ?`;

    } else if (grade === "3") {
        num1 = Math.floor(Math.random() * difficultyLimits.grade3Max) + 1;
        num2 = Math.floor(Math.random() * difficultyLimits.grade3Max) + 1;
        currentAnswer = num1 * num2;
        questionText.innerText = `${num1} × ${num2} = ?`;

    } else if (grade === "4") {
        num2 = Math.floor(Math.random() * 10) + 2; 
        currentAnswer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * currentAnswer; 
        questionText.innerText = `${num1} ÷ ${num2} = ?`;

    } else if (grade === "5") {
        num1 = (Math.floor(Math.random() * 90) + 10) / 10;
        num2 = (Math.floor(Math.random() * 90) + 10) / 10;
        currentAnswer = parseFloat((num1 + num2).toFixed(1));
        questionText.innerText = `${num1} + ${num2} = ?`;
    }
}

function checkAnswer() {
    const userIn = userAnswer.value;
    if (userIn === "") return;

    if (parseFloat(userIn) === currentAnswer) {
        feedback.innerText = "🎉 Awesome Job! Correct! 🌟";
        feedback.className = "text-lg font-bold text-green-600";
        score += 10;
        streak += 1;
    } else {
        feedback.innerText = `❌ Oops! The correct answer was ${currentAnswer}`;
        feedback.className = "text-lg font-bold text-red-500";
        streak = 0;
    }

    scoreDisplay.innerText = score;
    streakDisplay.innerText = streak;

    setTimeout(generateQuestion, 2000);
}

// Event Listeners
gradeSelect.addEventListener("change", generateQuestion);
submitBtn.addEventListener("click", checkAnswer);
userAnswer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkAnswer();
});

// Run app on start
generateQuestion();
