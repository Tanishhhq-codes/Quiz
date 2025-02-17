document.addEventListener('DOMContentLoaded', () => {
    const dialogueElement = document.getElementById('dialogue');
    const quizOptionsElement = document.getElementById('quiz-options');
    const annie = document.getElementById('annie');
    const mrEarthquake = document.getElementById('mr-earthquake');

    // Quiz content with dialogues and correct answers
    const quizContent = [
        {
            initial: {
                annie: "Hi there! I'm Annie, your friendly neighborhood safety expert. We need to be prepared for anything!",
                mrEarthquake: "MUHAHAHA! I am the mighty Mr. Earthquake! Time to shake things up! Let's see if you can survive my seismic challenge!"
            },
            question: "What's the first thing you should do during an earthquake?",
            options: [
                "Drop, Cover, and Hold On",
                "Run outside immediately",
                "Stand in a doorway",
                "Use the elevator to evacuate"
            ],
            correctAnswer: "Drop, Cover, and Hold On",
            correctResponse: {
                annie: "Excellent! Drop, Cover, and Hold On is your best defense!",
                mrEarthquake: "CURSES! Another smart one! You're ruining all my plans for chaos!"
            },
            wrongResponse: {
                annie: "No! That's exactly what Mr. Earthquake wants you to do!",
                mrEarthquake: "HAHAHA! YES! Run around in panic! This is getting entertaining!"
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
                annie: "Perfect! That desk might just save your life!",
                mrEarthquake: "BAH! Hiding under furniture? Where's the drama in that?!"
            },
            wrongResponse: {
                annie: "That's a disaster waiting to happen! Think safer!",
                mrEarthquake: "OH YES! Stand by those lovely shattering hazards! evil laughter"
            }
        },
        {
            question: "What should you do after an earthquake stops?",
            options: [
                "Check for injuries and hazards",
                "Use matches to check for damage",
                "Immediately use the telephone",
                "Turn on all electrical appliances"
            ],
            correctAnswer: "Check for injuries and hazards",
            correctResponse: {
                annie: "Finally! Someone who doesn't think post-earthquake mood lighting is a good idea!",
                mrEarthquake: "Party pooper! The matches would've made such a lovely secondary disaster..."
            },
            wrongResponse: {
                annie: "Oh perfect, because what this situation really needs is a fire... facepalm",
                mrEarthquake: "YES! Let's add some sparks to the party! This is getting better by the minute!"
            }
        },
        {
            question: "What should you include in your earthquake emergency kit?",
            options: [
                "Water, food, and first-aid supplies",
                "Just a flashlight",
                "Only important documents",
                "Television and gaming console"
            ],
            correctAnswer: "Water, food, and first-aid supplies",
            correctResponse: {
                annie: "Oh look, someone who doesn't think they can survive on selfie sticks and good vibes!",
                mrEarthquake: "Aw man, I was hoping you'd pick the gaming console. Nothing like Minecraft during a real disaster!"
            },
            wrongResponse: {
                annie: "Right... Because Instagram will totally feed you during an emergency.",
                mrEarthquake: "Perfect! Nothing says 'I'm prepared' like having your high scores ready for the rescue team!"
            }
        },
        {
            question: "What should you do if you're trapped under debris?",
            options: [
                "Cover mouth and tap on pipes",
                "Light a match to see",
                "Shout continuously",
                "Try to move the debris"
            ],
            correctAnswer: "Cover mouth and tap on pipes",
            correctResponse: {
                annie: "Well, would you look at that - someone who doesn't think this is the time to start their fire-breathing career!",
                mrEarthquake: "ARGH! Such calculated calmness! Where's the screaming? The panic? You're taking all the fun out of this!"
            },
            wrongResponse: {
                annie: "Sure, because turning yourself into a human torch will DEFINITELY help the situation...",
                mrEarthquake: "PERFECT! Nothing says 'total disaster' like combining my earthquake with a nice fire! I love a good combo disaster! maniacal laughter"
            }
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 20;
    let timerInterval;

    // Add audio elements
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const bgMusic = document.getElementById('bgMusic');
    
    // Set up background music
    bgMusic.volume = 0.15;  // Changed from 0.3 to 0.15 (15% volume)
    bgMusic.loop = true;   
    
    // Function to start background music
    function startBackgroundMusic() {
        bgMusic.play()
            .catch(error => {
                console.log("Audio autoplay prevented:", error);
                document.addEventListener('click', () => {
                    bgMusic.play();
                }, { once: true });
            });
    }

    // Start background music
    startBackgroundMusic();

    // Ensure music continues playing after each sound effect
    correctSound.addEventListener('play', () => {
        bgMusic.volume = 0.05;  // Changed from 0.1 to 0.05 during effects
    });
    
    correctSound.addEventListener('ended', () => {
        bgMusic.volume = 0.15;  // Changed from 0.3 to 0.15
    });
    
    wrongSound.addEventListener('play', () => {
        bgMusic.volume = 0.05;  // Changed from 0.1 to 0.05 during effects
    });
    
    wrongSound.addEventListener('ended', () => {
        bgMusic.volume = 0.15;  // Changed from 0.3 to 0.15
    });

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
        
        // Remove old timer bar if exists
        const oldTimer = document.querySelector('.timer-bar');
        if (oldTimer) oldTimer.remove();
        
        // Create new timer bar
        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        document.getElementById('quiz-box').appendChild(timerBar);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                handleTimeUp();
            }
        }, 1000);
    }

    function handleTimeUp() {
        clearInterval(timerInterval);
        wrongSound.currentTime = 0;
        wrongSound.play();
        const randomTimeUpDialog = timeDialogues.timeUp[Math.floor(Math.random() * timeDialogues.timeUp.length)];
        showCharacterDialogue('mrEarthquake', randomTimeUpDialog);
        showCharacterDialogue('annie', "Stay focused! Quick thinking is essential during an earthquake!");
        handleAnswer('');
    }

    function displayQuestion(index) {
        const currentQuiz = quizContent[index];
        startTimer();
        
        // Show initial dialogue
        if (currentQuiz.initial) {
            showCharacterDialogue('annie', currentQuiz.initial.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.initial.mrEarthquake);
        }

        // Display question
        dialogueElement.textContent = currentQuiz.question;
        quizOptionsElement.innerHTML = '';

        // Randomize options
        const shuffledOptions = [...currentQuiz.options].sort(() => Math.random() - 0.5);

        // Create option buttons
        shuffledOptions.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(option));
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

        // Play appropriate sound
        if (isCorrect) {
            correctSound.currentTime = 0; // Reset sound to start
            correctSound.play();
            score++;
        } else {
            wrongSound.currentTime = 0; // Reset sound to start
            wrongSound.play();
        }

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
            button.disabled = true;
        });

        if (isCorrect) {
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
        }, 2500);
    }

    function endQuiz() {
        dialogueElement.textContent = `Quiz Complete! You scored ${score}/${quizContent.length}`;
        quizOptionsElement.innerHTML = '<button onclick="window.location.href=\'https://disaster-inky.vercel.app/\'">HOME</button>';
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