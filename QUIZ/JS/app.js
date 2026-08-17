document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const welcomeCard = document.getElementById("welcome-card");
    const quizCard = document.getElementById("quiz-card");
    const resultsCard = document.getElementById("results-card");

    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const submitBtn = document.getElementById("submit-btn");
    const restartBtn = document.getElementById("restart-btn");

    const questionTracker = document.getElementById("question-tracker");
    const scoreTracker = document.getElementById("score-tracker");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const feedback = document.getElementById("feedback");
    const finalScore = document.getElementById("final-score");
    const summaryContainer = document.getElementById("summary-container");

    // Quiz State Variables
    let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers = [];

    // Event Listeners
    startBtn.addEventListener("click", startQuiz);
    nextBtn.addEventListener("click", goToNextQuestion);
    submitBtn.addEventListener("click", showResults);
    restartBtn.addEventListener("click", resetQuiz);

    function startQuiz() {
        welcomeCard.classList.add("hidden");
        quizCard.classList.remove("hidden");
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        loadQuestion();
    }

    function loadQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];

        // Update trackers
        questionTracker.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        scoreTracker.textContent = `Score: ${score}`;

        // Set question text
        questionText.textContent = currentQuestion.question;

        // Render option buttons
        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-btn");
            button.addEventListener("click", () => selectOption(index, button));
            optionsContainer.appendChild(button);
        });
    }

    function resetState() {
        feedback.classList.add("hidden");
        feedback.textContent = "";
        nextBtn.classList.add("hidden");
        submitBtn.classList.add("hidden");
        optionsContainer.innerHTML = "";
    }

    function selectOption(selectedIndex, selectedButton) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctIndex;

        // Record user response
        userAnswers.push({
            question: currentQuestion.question,
            selected: currentQuestion.options[selectedIndex],
            correct: currentQuestion.options[currentQuestion.correctIndex],
            isCorrect: isCorrect
        });

        // Disable all option buttons after selection
        const optionButtons = optionsContainer.querySelectorAll(".option-btn");
        optionButtons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === currentQuestion.correctIndex) {
                btn.classList.add("correct");
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add("incorrect");
            }
        });

        // Update score and display feedback
        if (isCorrect) {
            score++;
            scoreTracker.textContent = `Score: ${score}`;
            feedback.textContent = "Correct! Well done.";
            feedback.className = "feedback-correct";
        } else {
            feedback.textContent = `Incorrect! The correct answer was: ${currentQuestion.options[currentQuestion.correctIndex]}`;
            feedback.className = "feedback-incorrect";
        }
        feedback.classList.remove("hidden");

        // Toggle navigation controls
        if (currentQuestionIndex < questions.length - 1) {
            nextBtn.classList.remove("hidden");
        } else {
            submitBtn.classList.remove("hidden");
        }
    }

    function goToNextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function showResults() {
        quizCard.classList.add("hidden");
        resultsCard.classList.remove("hidden");

        finalScore.textContent = `You scored ${score} out of ${questions.length} (${Math.round((score / questions.length) * 100)}%)`;

        // Generate summary breakdown
        summaryContainer.innerHTML = userAnswers.map((ans, idx) => `
            <div class="summary-item ${ans.isCorrect ? 'correct-border' : 'incorrect-border'}">
                <p><strong>Q${idx + 1}: ${ans.question}</strong></p>
                <p>Your Answer: <span class="${ans.isCorrect ? 'text-correct' : 'text-incorrect'}">${ans.selected}</span></p>
                ${!ans.isCorrect ? `<p>Correct Answer: <span class="text-correct">${ans.correct}</span></p>` : ''}
            </div>
        `).join("");
    }

    function resetQuiz() {
        resultsCard.classList.add("hidden");
        startQuiz();
    }
});