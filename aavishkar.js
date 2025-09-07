document.addEventListener('DOMContentLoaded', () => {
        // All JavaScript logic remains the same. No changes are needed in the script.
        // --- Mobile Menu ---
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        menuBtn.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); });

        // --- Quiz Logic ---
        const quizData = [ { question: "What is the tendency to search for information that confirms one's beliefs?", options: ["Confirmation Bias", "Anchoring Bias", "Hindsight Bias"], answer: "Confirmation Bias" }, { question: "In classical conditioning, what is a naturally occurring reaction?", options: ["Conditioned Response", "Unconditioned Response", "Neutral Stimulus"], answer: "Unconditioned Response" }, { question: "Which psychologist is famous for the 'Bobo doll' experiment on social learning?", options: ["B.F. Skinner", "Albert Bandura", "Jean Piaget"], answer: "Albert Bandura" } ];
        let currentQuizQuestion = 0, score = 0;
        const questionEl = document.getElementById('quiz-question'), optionsEl = document.getElementById('quiz-options'), submitBtn = document.getElementById('quiz-submit'), feedbackEl = document.getElementById('quiz-feedback');
        function loadQuiz() {
            feedbackEl.textContent = '';
            const currentData = quizData[currentQuizQuestion];
            questionEl.textContent = currentData.question;
            optionsEl.innerHTML = '';
            currentData.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'w-full p-3 border rounded-lg text-left hover:bg-blue-100 transition btn-focus';
                button.onclick = () => { Array.from(optionsEl.children).forEach(child => child.classList.remove('bg-blue-200')); button.classList.add('bg-blue-200'); button.dataset.selected = 'true'; };
                optionsEl.appendChild(button);
            });
        }
        submitBtn.addEventListener('click', () => {
            const selectedOption = optionsEl.querySelector('button[data-selected="true"]');
            if (selectedOption) {
                if (selectedOption.textContent === quizData[currentQuizQuestion].answer) { score++; feedbackEl.textContent = "Correct!"; feedbackEl.style.color = 'green'; }
                else { feedbackEl.textContent = `Wrong! Correct: ${quizData[currentQuizQuestion].answer}.`; feedbackEl.style.color = 'red'; }
                currentQuizQuestion++;
                if (currentQuizQuestion < quizData.length) { setTimeout(loadQuiz, 1500); }
                else {
                    setTimeout(() => {
                        questionEl.textContent = `You finished the quiz!`;
                        optionsEl.innerHTML = `<p class="text-2xl text-center">Your Score: ${score}/${quizData.length}</p>`;
                        submitBtn.textContent = 'Restart Quiz';
                        submitBtn.onclick = () => { currentQuizQuestion = 0; score = 0; submitBtn.textContent = 'Submit Answer'; loadQuiz(); };
                    }, 1500);
                }
            } else { feedbackEl.textContent = "Please select an answer."; feedbackEl.style.color = 'orange'; }
        });
        loadQuiz();

        // --- Mindfulness Modal ---
        const mindfulnessBtn = document.getElementById('mindfulness-btn'), mindfulnessModal = document.getElementById('mindfulness-modal'), closeMindfulnessBtn = document.getElementById('close-mindfulness-modal');
        let breathInterval, breathTimerInterval;
        mindfulnessBtn.addEventListener('click', () => { mindfulnessModal.classList.add('show'); startBreathingExercise(); });
        closeMindfulnessBtn.addEventListener('click', () => { mindfulnessModal.classList.remove('show'); clearInterval(breathInterval); clearInterval(breathTimerInterval); });
        function startBreathingExercise() {
            const circle = document.getElementById('breathing-circle'), text = document.getElementById('breathing-text'), timerEl = document.getElementById('breathing-timer');
            let timeLeft = 60; timerEl.textContent = timeLeft;
            function breathCycle() {
                text.textContent = 'Breathe In... (4s)'; circle.classList.add('inhale');
                setTimeout(() => { text.textContent = 'Hold... (7s)'; setTimeout(() => { text.textContent = 'Breathe Out... (8s)'; circle.classList.remove('inhale'); }, 7000); }, 4000);
            }
            breathCycle();
            breathInterval = setInterval(breathCycle, 19000);
            breathTimerInterval = setInterval(() => { timeLeft--; timerEl.textContent = timeLeft; if (timeLeft <= 0) { clearInterval(breathTimerInterval); clearInterval(breathInterval); text.textContent = 'Session Complete!'; } }, 1000);
        }

        // --- Memory Game ---
        const memoryGameBtn = document.getElementById('memory-game-btn'), memoryGameModal = document.getElementById('memory-game-modal'), closeGameBtn = document.getElementById('close-game-modal'), resetGameBtn = document.getElementById('reset-game'), grid = document.getElementById('memory-grid'), movesEl = document.getElementById('moves-count');
        memoryGameBtn.addEventListener('click', () => { memoryGameModal.classList.add('show'); createBoard(); });
        closeGameBtn.addEventListener('click', () => memoryGameModal.classList.remove('show'));
        resetGameBtn.addEventListener('click', createBoard);
        const cardArray = [ { name: 'Ego', id: 1 }, { name: 'Ego', id: 1 }, { name: 'Id', id: 2 }, { name: 'Id', id: 2 }, { name: 'Schema', id: 3 }, { name: 'Schema', id: 3 }, { name: 'Phobia', id: 4 }, { name: 'Phobia', id: 4 }, { name: 'Neuron', id: 5 }, { name: 'Neuron', id: 5 }, { name: 'Dopamine', id: 6 }, { name: 'Dopamine', id: 6 }, { name: 'Bias', id: 7 }, { name: 'Bias', id: 7 }, { name: 'Mantra', id: 8 }, { name: 'Mantra', id: 8 } ];
        let cardsChosen = [], cardsChosenIds = [], cardsWon = [], moves = 0;
        function createBoard() {
            grid.innerHTML = ''; moves = 0; movesEl.textContent = moves; cardsWon = [];
            cardArray.sort(() => 0.5 - Math.random());
            for (let i = 0; i < cardArray.length; i++) {
                const card = document.createElement('div'); card.setAttribute('data-id', i); card.className = 'memory-card rounded-lg relative';
                const cardFront = document.createElement('div'); cardFront.className = 'card-face'; cardFront.innerHTML = `<i class="fas fa-brain text-white"></i>`;
                const cardBack = document.createElement('div'); cardBack.className = 'card-face card-back'; cardBack.textContent = cardArray[i].name;
                card.appendChild(cardFront); card.appendChild(cardBack); grid.appendChild(card); card.addEventListener('click', flipCard);
            }
        }
        function flipCard() {
            if (cardsChosen.length === 2 || this.classList.contains('is-flipped')) return;
            let cardId = this.getAttribute('data-id');
            cardsChosen.push(cardArray[cardId]); cardsChosenIds.push(cardId); this.classList.add('is-flipped');
            if (cardsChosen.length === 2) { moves++; movesEl.textContent = moves; setTimeout(checkForMatch, 500); }
        }
        function checkForMatch() {
            const cards = document.querySelectorAll('.memory-card'); const [optionOneId, optionTwoId] = cardsChosenIds;
            if (cardsChosen[0].id === cardsChosen[1].id && optionOneId !== optionTwoId) { cards[optionOneId].style.visibility = 'hidden'; cards[optionTwoId].style.visibility = 'hidden'; cardsWon.push(cardsChosen); }
            else { cards[optionOneId].classList.remove('is-flipped'); cards[optionTwoId].classList.remove('is-flipped'); }
            cardsChosen = []; cardsChosenIds = [];
            if (cardsWon.length === cardArray.length / 2) { grid.innerHTML = `<p class="col-span-4 text-center text-xl">Congratulations! You won in ${moves} moves!</p>`; }
        }
        
        // --- Contact Form ---
        const contactForm = document.getElementById('contact-form'), formFeedback = document.getElementById('form-feedback');
        contactForm.addEventListener('submit', (e) => { e.preventDefault(); formFeedback.textContent = 'Thank you for your message!'; formFeedback.style.color = 'green'; contactForm.reset(); setTimeout(() => formFeedback.textContent = '', 5000); });

    });