document.addEventListener('DOMContentLoaded', () => {
    const dialogueElement = document.getElementById('dialogue');
    const quizOptionsElement = document.getElementById('quiz-options');
    const annie = document.getElementById('annie');
    const mrEarthquake = document.getElementById('mr-earthquake');

    // Quiz content with dialogues and correct answers
    const quizContent = [
        {
            initial: {
                annie: "Hello everyone! I am Jessica, your safety instructor and saviour. Natural disasters don't warn you, but we can prepare ourselves!",
                mrEarthquake: "MUHAHAHA! That's right! I strike without warning, turning your safe world upside down!"
            },
            question: "You're in a classroom when the ground starts shaking. What should you do?",
            options: [
                "Drop, Cover, and Hold On",
                "Run outside immediately",
                "Stand near windows",
                "Ignore teacher's instructions"
            ],
            correctAnswer: "Drop, Cover, and Hold On",
            correctResponse: {
                annie: "Excellent! Stay calm and take cover under a sturdy desk. It's your best protection!",
                mrEarthquake: "BAH! Another smart student! I was hoping for some panic and chaos!"
            },
            wrongResponse: {
                annie: "No! Running or standing near windows puts you at greater risk!",
                mrEarthquake: "YES! Run around! Make my job of causing chaos easier! HAHAHA!"
            }
        },
        {
            question: "You're driving when an earthquake hits. What's the safest action?",
            options: [
                "Pull over safely away from buildings",
                "Park in the middle of the road",
                "Stop under a bridge or tunnel",
                "Speed up to escape quickly"
            ],
            correctAnswer: "Pull over safely away from buildings",
            correctResponse: {
                annie: "Perfect! Stay in the car, turn on hazard lights, and stay away from hazards!",
                mrEarthquake: "Ugh! Why can't you just panic and crash like everyone else?!"
            },
            wrongResponse: {
                annie: "That's dangerous! Bridges and tunnels are especially hazardous during earthquakes!",
                mrEarthquake: "EXCELLENT CHOICE! Nothing like a bridge collapse to add to the excitement!"
            }
        },
        {
            question: "Where is the safest place to take cover during an earthquake?",
            options: [
                "Under a sturdy desk or table",
                "Next to a tall bookshelf",
                "Near windows",
                "In front of a mirror"
            ],
            correctAnswer: "Under a sturdy desk or table",
            correctResponse: {
                annie: "That's right! A sturdy desk can protect you from falling debris!",
                mrEarthquake: "BAH! Hiding under furniture? Where's the drama in that?!"
            },
            wrongResponse: {
                annie: "Think about it - heavy objects falling, glass breaking... is that where you want to be?",
                mrEarthquake: "OH YES! Stand by those lovely shattering hazards! *evil laughter*"
            }
        },
        {
            question: "After the main shock, what should you do?",
            options: [
                "Check for injuries and hazards",
                "Use matches to check damage",
                "Run outside immediately",
                "Use elevators to evacuate"
            ],
            correctAnswer: "Check for injuries and hazards",
            correctResponse: {
                annie: "Correct! Stay calm and assess the situation carefully!",
                mrEarthquake: "Careful planning? BORING! Where's the blind panic I ordered?"
            },
            wrongResponse: {
                annie: "That could lead to even more dangerous situations! Think safety first!",
                mrEarthquake: "YES! Add more chaos to the situation! I love it when they make it worse!"
            }
        },
        {
            question: "What should you do if trapped under debris?",
            options: [
                "Cover mouth and tap on pipes",
                "Light a match to see",
                "Shout continuously",
                "Try to move heavy debris"
            ],
            correctAnswer: "Cover mouth and tap on pipes",
            correctResponse: {
                annie: "Excellent! Save your energy and make rhythmic noise to signal rescuers!",
                mrEarthquake: "Methodical tapping? How dull! I prefer screaming and panic!"
            },
            wrongResponse: {
                annie: "That could make your situation much worse! Stay calm and conserve energy!",
                mrEarthquake: "Perfect! Nothing says 'total disaster' like making everything worse! *maniacal laughter*"
            }
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 20;
    let timerInterval;

    function showCharacterDialogue(character, text) {
        // Remove existing bubble if any
        const existingBubble = document.querySelector(`.${character}-bubble`);
        if (existingBubble) {
            existingBubble.remove();
        }

        const bubble = document.createElement('div');
        bubble.className = `dialogue-bubble ${character}-bubble`;
        bubble.textContent = text;
        document.body.appendChild(bubble);
        
        // Enhanced animation
        gsap.from(bubble, {
            duration: 0.8,
            scale: 0,
            opacity: 0,
            y: 50,
            ease: "elastic.out(1, 0.7)",
            onComplete: () => {
                gsap.to(bubble, {
                    duration: 0.5,
                    y: "+=10",
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });
            }
        });
    }

    function animateCharacterReaction(character, isCorrect) {
        // Remove all animations - character stays static
        return; // Early return to prevent any animations
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 20;
        updateTimer();
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                handleTimeUp();
            } else if (timeLeft <= 5) {
                document.querySelector('.timer').classList.add('warning');
            }
        }, 1000);
    }

    function updateTimer() {
        document.getElementById('timer').textContent = timeLeft;
    }

    function handleTimeUp() {
        clearInterval(timerInterval);
        const randomTimeUpDialog = timeDialogues.timeUp[Math.floor(Math.random() * timeDialogues.timeUp.length)];
        showCharacterDialogue('mrEarthquake', randomTimeUpDialog);
        showCharacterDialogue('annie', "Stay focused! Quick thinking is essential during an earthquake!");
        handleAnswer('');
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayQuestion(index) {
        const currentQuiz = quizContent[index];
        startTimer();
        document.querySelector('.timer').classList.remove('warning');
        
        // Show initial dialogue
        if (currentQuiz.initial) {
            showCharacterDialogue('annie', currentQuiz.initial.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.initial.mrEarthquake);
        }

        // Display question
        dialogueElement.textContent = currentQuiz.question;
        quizOptionsElement.innerHTML = '';

        // Create shuffled options array with their correct/incorrect status
        const optionsWithStatus = currentQuiz.options.map(option => ({
            text: option,
            isCorrect: option === currentQuiz.correctAnswer
        }));
        
        // Shuffle the options
        const shuffledOptions = shuffleArray([...optionsWithStatus]);

        // Create option buttons with shuffled order
        shuffledOptions.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.addEventListener('click', () => handleAnswer(option.text));
            quizOptionsElement.appendChild(button);

            gsap.from(button, {
                duration: 0.5,
                opacity: 0,
                y: 30,
                scale: 0.8,
                delay: i * 0.2,
                ease: "back.out(1.7)",
                clearProps: "all"
            });
        });
    }

    function changeCharacterExpression(character, emotion) {
        const element = document.getElementById(character);
        element.style.backgroundImage = `url('./images/${character}-${emotion}.png')`;
    }

    function updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progress = (currentQuestionIndex / quizContent.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function updateScore() {
        document.getElementById('current-score').textContent = score;
        document.getElementById('total-questions').textContent = quizContent.length;
    }

    function handleAnswer(selectedAnswer) {
        clearInterval(timerInterval);
        const currentQuiz = quizContent[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

        // Find the selected button and the correct button
        const buttons = quizOptionsElement.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === selectedAnswer) {
                button.style.background = isCorrect ? 
                    'linear-gradient(45deg, #4CAF50, #45a049)' : 
                    'linear-gradient(45deg, #ff4757, #ff6b6b)';
            }
            if (button.textContent === currentQuiz.correctAnswer && !isCorrect) {
                setTimeout(() => {
                    button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                }, 1000);
            }
            button.disabled = true; // Disable all buttons after answer
        });

        if (isCorrect) {
            score++;
            showCharacterDialogue('annie', currentQuiz.correctResponse.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.correctResponse.mrEarthquake);
        } else {
            showCharacterDialogue('annie', currentQuiz.wrongResponse.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.wrongResponse.mrEarthquake);
        }

        updateScore();
        updateProgress();

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < quizContent.length) {
                displayQuestion(currentQuestionIndex);
            } else {
                endQuiz();
            }
        }, 2500); // Increased delay to show colors
    }

    function endQuiz() {
        dialogueElement.textContent = `Quiz Complete! You scored ${score}/${quizContent.length}`;
        
        // Create container for end buttons
        quizOptionsElement.innerHTML = `
            <div class="end-buttons">
                <button onclick="location.reload()" class="replay-btn">Play Again</button>
                <button onclick="window.location.href='https://disaster-inky.vercel.app/'" class="home-btn">Home</button>
            </div>
        `;
    }

    // Add new character animations
    function addCharacterIdleAnimations() {
        // Remove idle animations
        return; // Early return to prevent any animations
    }

    // Start character animations immediately
    addCharacterIdleAnimations();
    
    // Start the quiz
    displayQuestion(0);
    updateScore();
    updateProgress();
}); 

// Add time-up dialogues
const timeDialogues = {
    timeUp: [
        "TIME'S UP! Just like those foundation supports! CRASH!",
        "Too slow! The ground waits for no one! RUMBLE RUMBLE!",
        "BOOM! Time's up! Watch everything crumble!",
        "Should've been quicker! Now feel the earth's fury!"
    ]
}; 