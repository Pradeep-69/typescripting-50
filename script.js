// ✅ List of sample passages
const passages = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing tests are a great way to improve your speed and accuracy.",
    "Practice makes perfect, so keep typing every day!",
    "JavaScript powers interactive web applications everywhere.",
    "Learning to type faster can boost your productivity significantly."
];

// ✅ Variables to track state
let currentPassage = "";
let timer = 60;
let timerInterval = null;
let started = false;
let totalErrors = 0;
let correctChars = 0;
let totalTyped = 0;

// ✅ Get HTML elements
const textPassage = document.getElementById('text-passage');
const typingArea = document.getElementById('typing-area');
const timerDisplay = document.getElementById('timer');
const resultDisplay = document.getElementById('result');
const resetBtn = document.getElementById('reset-btn');

// ✅ Pick a random passage from the list
function pickRandomPassage() {
    return passages[Math.floor(Math.random() * passages.length)];
}

// ✅ Show the passage on the screen using <span> for each character
function displayPassage() {
    textPassage.innerHTML = '';
    for (let char of currentPassage) {
        const span = document.createElement('span');
        span.textContent = char;
        textPassage.appendChild(span);
    }
}

// ✅ Start the test only once
function startTest() {
    if (!started) {
        started = true;
        typingArea.focus();
        timerDisplay.textContent = timer;
        resultDisplay.classList.add('d-none');
        totalErrors = 0;
        correctChars = 0;
        totalTyped = 0;

        // Start countdown every second
        timerInterval = setInterval(updateTimer, 1000);
    }
}

// ✅ Update the countdown timer
function updateTimer() {
    timer--;
    timerDisplay.textContent = timer;

    if (timer <= 0) {
        endTest();
    }
}

// ✅ End the typing test
function endTest() {
    clearInterval(timerInterval);       // stop the timer
    typingArea.disabled = true;         // stop typing
    showResult();                       // show WPM & accuracy
}

// ✅ Show WPM, accuracy, and errors
function showResult() {
    const timeElapsed = 60 - timer;
    const minutes = timeElapsed / 60;

    // WPM: characters/5 divided by minutes
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? ((correctChars / totalTyped) * 100).toFixed(1) : 0;

    resultDisplay.innerHTML = `
        <strong>WPM:</strong> ${wpm} &nbsp; | 
        <strong>Accuracy:</strong> ${accuracy}% &nbsp; | 
        <strong>Total Errors:</strong> ${totalErrors}
    `;
    resultDisplay.classList.remove('d-none');
}

// ✅ Reset the test to start again
function resetTest() {
    clearInterval(timerInterval);
    timer = 60;
    started = false;

    typingArea.value = '';
    typingArea.disabled = false;
    timerDisplay.textContent = timer;
    resultDisplay.classList.add('d-none');

    // Load a new passage
    currentPassage = pickRandomPassage();
    displayPassage();

    // Remove all old highlights
    Array.from(textPassage.children).forEach(span => {
        span.className = '';
    });
}

// ✅ This runs every time user types something
function handleTyping() {
    if (!started) {
        startTest(); // start timer on first keypress
    }

    const input = typingArea.value;
    totalTyped = input.length;
    totalErrors = 0;
    correctChars = 0;

    // Clear all highlights
    Array.from(textPassage.children).forEach(span => {
        span.className = '';
    });

    // Highlight characters typed so far
    for (let i = 0; i < input.length && i < currentPassage.length; i++) {
        const span = textPassage.children[i];

        if (input[i] === currentPassage[i]) {
            span.className = 'highlight-correct';
            correctChars++;
        } else {
            span.className = 'highlight-error';
            totalErrors++;
        }
    }

    // Show live result (WPM and accuracy)
    const timeElapsed = 60 - timer;
    const minutes = timeElapsed / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalTyped > 0 ? ((correctChars / totalTyped) * 100).toFixed(1) : 0;

    resultDisplay.innerHTML = `
        <strong>WPM:</strong> ${wpm} &nbsp; | 
        <strong>Accuracy:</strong> ${accuracy}% &nbsp; | 
        <strong>Total Errors:</strong> ${totalErrors}
    `;
    resultDisplay.classList.remove('d-none');

    // Automatically end if user completes the passage
    if (input.length >= currentPassage.length) {
        endTest();
    }
}




// ✅ Event Listeners
typingArea.addEventListener('input', handleTyping);  // when typing
resetBtn.addEventListener('click', resetTest);       // when reset is clicked

// ✅ When page loads, setup first passage
window.addEventListener('load', () => {
    currentPassage = pickRandomPassage();
    displayPassage();
    timerDisplay.textContent = timer;
});
