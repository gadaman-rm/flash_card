import './style.scss'
interface Vocabulary {
  word: string;
  definition: string;
  example: string;
  status: 'unknown' | 'learning' | 'known';
}

const vocabulary: Vocabulary[] = [
  { word: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'The beauty of the sunset was ephemeral.', status: 'unknown' },
  { word: 'Serendipity', definition: 'The occurrence of finding something valuable when least expected.', example: 'Meeting her was pure serendipity.', status: 'unknown' },
  { word: 'Quixotic', definition: 'Unrealistically optimistic or impractical.', example: 'His quixotic dreams led to many adventures.', status: 'unknown' },
  { word: 'Luminous', definition: 'Bright or radiant, especially in a subtle way.', example: 'The luminous stars lit up the night sky.', status: 'unknown' },
  { word: 'Ebullient', definition: 'Cheerful and full of energy.', example: 'Her ebullient personality was contagious.', status: 'unknown' },
];

let currentIndex = 0;
let isFlipped = false;

const flashcard = document.getElementById('flashcard') as HTMLElement;
const wordElement = document.getElementById('word') as HTMLElement;
const definitionElement = document.getElementById('definition') as HTMLElement;
const exampleElement = document.getElementById('example') as HTMLElement;
const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
const flipBtn = document.getElementById('flipBtn') as HTMLButtonElement;
const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
const markKnownBtn = document.getElementById('markKnown') as HTMLButtonElement;
const markLearningBtn = document.getElementById('markLearning') as HTMLButtonElement;
const currentCardElement = document.getElementById('currentCard') as HTMLElement;
const totalCardsElement = document.getElementById('totalCards') as HTMLElement;

function updateCard() {
  const vocab = vocabulary[currentIndex];
  wordElement.textContent = vocab.word;
  definitionElement.textContent = vocab.definition;
  exampleElement.textContent = vocab.example;
  currentCardElement.textContent = (currentIndex + 1).toString();
  totalCardsElement.textContent = vocabulary.length.toString();
  isFlipped = false;
  flashcard.classList.remove('flipped');
  updateReviewButtons();
}

function updateReviewButtons() {
  const vocab = vocabulary[currentIndex];
  markKnownBtn.classList.toggle('marked', vocab.status === 'known');
  markLearningBtn.classList.toggle('marked', vocab.status === 'learning');
}

flipBtn.addEventListener('click', () => {
  isFlipped = !isFlipped;
  flashcard.classList.toggle('flipped');
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCard();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < vocabulary.length - 1) {
    currentIndex++;
    updateCard();
  }
});

markKnownBtn.addEventListener('click', () => {
  vocabulary[currentIndex].status = 'known';
  markKnownBtn.classList.add('marked', 'marked-animation');
  markLearningBtn.classList.remove('marked', 'marked-animation');
  setTimeout(() => markKnownBtn.classList.remove('marked-animation'), 300);
});

markLearningBtn.addEventListener('click', () => {
  vocabulary[currentIndex].status = 'learning';
  markLearningBtn.classList.add('marked', 'marked-animation');
  markKnownBtn.classList.remove('marked', 'marked-animation');
  setTimeout(() => markLearningBtn.classList.remove('marked-animation'), 300);
});

// Initialize
updateCard();