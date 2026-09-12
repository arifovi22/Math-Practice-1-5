let score = 0;
let streak = 0;
let progress = 0;
let currentAnswer = 0;
let currentNum1 = 0;
let currentNum2 = 0;
let currentOp = '';

const gradeSelect = document.getElementById("gradeSelect");
const questionText = document.getElementById("questionText");
const userAnswer = document.getElementById("userAnswer");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const progressBar = document.getElementById("progressBar");
const explanationBox = document.getElementById("explanationBox");
const explanationText = document.getElementById("explanationText");
const nextBtn = document.getElementById("nextBtn");

function generateQuestion() {
    const grade = gradeSelect.value;
    userAnswer.value = "";
    feedback.innerText = "";
    explanationBox.classList.add("hidden");
    submitBtn.disabled = false;
    userAnswer.disabled = false;

    if (grade === "1") {
        currentNum1 = Math.floor(Math.random() * 10) + 1;
        currentNum2 = Math.floor(Math.random() * 10) + 1;
        currentOp = Math.random() > 0.5 ? '+' : '-';
        if (currentOp === '-' && currentNum1 < currentNum2) [currentNum1, currentNum2] = [currentNum2, currentNum1];
        currentAnswer = currentOp === '+' ? currentNum1 + currentNum2 : currentNum1 - currentNum2;
        questionText.innerText = `${currentNum1} ${currentOp} ${currentNum2} = ?`;

    } else if (grade === "2") {
        currentNum1 = Math.floor(Math.random() * 40) + 10;
        currentNum2 = Math.floor(Math.random() * 40) + 10;
        currentOp = Math.random() > 0.5 ? '+' : '-';
        if (currentOp === '-' && currentNum1 < currentNum2) [currentNum1, currentNum2] = [currentNum2, currentNum1];
        currentAnswer = currentOp === '+' ? currentNum1 + currentNum2 : currentNum1 - currentNum2;
        questionText.innerText = `${currentNum1} ${currentOp} ${currentNum2} = ?`;

    } else if (grade === "3") {
        currentNum1 = Math.floor(Math.random() * 10) + 1;
        currentNum2 = Math.floor(Math.random() * 10) + 1;
        currentOp = '×';
        currentAnswer = currentNum1 * currentNum2;
        questionText.innerText = `${currentNum1} × ${currentNum2} = ?`;

    } else if (grade === "4") {
        currentNum2 = Math.floor(Math.random() * 8) + 2; 
        currentAnswer = Math.floor(Math.random() * 9) + 1;
        currentNum1 = currentNum2 * currentAnswer; 
        currentOp = '÷';
        questionText.innerText = `${currentNum1} ÷ ${currentNum2} = ?`;

    } else if (grade === "5") {
        currentNum1 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentNum2 = (Math.floor(Math.random() * 40) + 10) / 10;
        currentOp = '+';
        currentAnswer = parseFloat((currentNum1 + currentNum2).toFixed(1));
        questionText.innerText = `${currentNum1} + ${currentNum2} = ?`;
    }
}

function getCoachExplanation() {
    if (currentOp === '+') {
        if (gradeSelect.value === "5") {
            return `Let's line up the decimals! Look at ${currentNum1} and ${currentNum2}. Add the numbers behind the decimal point first, then add the whole numbers together. That gives us exactly ${currentAnswer}!`;
        }
        return `Let's count up! Start with the big number **${currentNum1}**, and count up **${currentNum2}** more steps. You will land right on **${currentAnswer}**!`;
    } else if (currentOp === '-') {
        return `Let's take away! Imagine you have **${currentNum1}** apples and you give **${currentNum2}** away to a friend. You are left with exactly **${currentAnswer}** apples!`;
    } else if (currentOp === '×') {
        return `Multiplication means matching groups! **${currentNum1} × ${currentNum2}** means adding the number **${currentNum2}** together **${currentNum1}** times. Adding them up step-by-step gets us to **${currentAnswer}**!`;
    } else if (currentOp === '÷') {
        return `Division means sharing equally! Imagine sharing **${currentNum1}** toys fairly among **${currentNum2}** friends. Each single friend gets exactly **${currentAnswer}** toys!`;
    }
    return "Keep trying, you can do it!";
}

function checkAnswer() {
    const userIn = userAnswer.value;
    if (userIn === "") return;

    submitBtn.disabled = true;
    userAnswer.disabled = true;

    if (parseFloat(userIn) === currentAnswer) {
        feedback.innerText = "🎉 Way to go! Correct! 🌟";
        feedback.className = "correct-text";
        score += 10;
        streak += 1;
        
        // Progress bar fills on correct answers
        progress = Math.min(progress + 20, 100);
        if (progress >= 100) {
            feedback.innerText = "🏆 AMAZING! You filled the bar and leveled up! 🚀";
            progress = 0; // reset for next round level
        }
        progressBar.style.width = `${progress}%`;
        
        setTimeout(generateQuestion, 2000);
    } else {
        feedback.innerText = `❌ Not quite! The correct answer was ${currentAnswer}`;
        feedback.className = "wrong-text";
        streak = 0;
        
        // Progress bar shrinks a bit on wrong answer
        progress = Math.max(progress - 10, 0);
        progressBar.style.width = `${progress}%`;

        // Reveal the step-by-step child explanation box
        explanationText.innerHTML = getCoachExplanation();
        explanationBox.classList.remove("hidden");
    }

    scoreDisplay.innerText = score;
    streakDisplay.innerText = streak;
}

gradeSelect.addEventListener("change", generateQuestion);
submitBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", generateQuestion);
userAnswer.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !submitBtn.disabled) checkAnswer();
});

generateQuestion();
