import './main.scss';
import { html, render } from 'lit';
import '@material/web/all';
import resourceManager from '../../../manager/lifecycle/ResourceManager';

interface Vocabulary {
  word: string;
  definition: string;
  example: string;
  status: 'unknown' | 'learning' | 'known';
}

const vocabulary: Vocabulary[] = [
  {
    word: 'Ephemeral',
    definition: 'Lasting for a very short time.',
    example: 'The beauty of the sunset was ephemeral.',
    status: 'unknown',
  },
  {
    word: 'Serendipity',
    definition: 'The occurrence of finding something valuable when least expected.',
    example: 'Meeting her was pure serendipity.',
    status: 'unknown',
  },
  {
    word: 'Quixotic',
    definition: 'Unrealistically optimistic or impractical.',
    example: 'His quixotic dreams led to many adventures.',
    status: 'unknown',
  },
  {
    word: 'Luminous',
    definition: 'Bright or radiant, especially in a subtle way.',
    example: 'The luminous stars lit up the night sky.',
    status: 'unknown',
  },
  {
    word: 'Ebullient',
    definition: 'Cheerful and full of energy.',
    example: 'Her ebullient personality was contagious.',
    status: 'unknown',
  },
];

let currentIndex = 0;
let isFlipped = false;

export class MainPage {
  setup() {}

  addEventListener() {
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

    if (flipBtn!.dataset.eventListenerAdded !== 'true') {
      flipBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(flipBtn, 'click', () => {
        isFlipped = !isFlipped;
        flashcard.classList.toggle('flipped');
      });
    }

    if (prevBtn!.dataset.eventListenerAdded !== 'true') {
      prevBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(prevBtn, 'click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCard();
        }
      });
    }

    if (nextBtn!.dataset.eventListenerAdded !== 'true') {
      nextBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(nextBtn, 'click', () => {
        if (currentIndex < vocabulary.length - 1) {
          currentIndex++;
          updateCard();
        }
      });

      if (markKnownBtn!.dataset.eventListenerAdded !== 'true') {
        markKnownBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(markKnownBtn, 'click', () => {
          vocabulary[currentIndex].status = 'known';
          markKnownBtn.classList.add('marked', 'marked-animation');
          markLearningBtn.classList.remove('marked', 'marked-animation');
          setTimeout(() => markKnownBtn.classList.remove('marked-animation'), 300);
        });
      }

      if (markLearningBtn!.dataset.eventListenerAdded !== 'true') {
        markLearningBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(markLearningBtn, 'click', () => {
          vocabulary[currentIndex].status = 'learning';
          markLearningBtn.classList.add('marked', 'marked-animation');
          markKnownBtn.classList.remove('marked', 'marked-animation');
          setTimeout(() => markLearningBtn.classList.remove('marked-animation'), 300);
        });
      }
    }
  }

  firstLoad() {
    // Any first load operations
  }

  load() {
    const page = html`
      <div class="container">
        <div class="function-container">
          <h1>Flash Card</h1>
          <div class="card-container">
            <div class="card" id="flashcard">
              <div class="card-front">
                <h2 id="word">Word</h2>
              </div>
              <div class="card-back">
                <p id="definition">Definition</p>
                <p id="example">Example Sentence</p>
              </div>
            </div>
          </div>
          <div class="controls">
            <button id="prevBtn">Previous</button>
            <button id="flipBtn">Flip</button>
            <button id="nextBtn">Next</button>
          </div>
          <div class="review-controls">
            <button id="markKnown">Mark as Known</button>
            <button id="markLearning">Mark as Learning</button>
          </div>
          <div class="progress">
            <span id="currentCard">1</span> / <span id="totalCards">5</span>
          </div>
        </div>
      </div>
    `;
    const appContainer: HTMLDivElement = document.getElementById('appContainer') as HTMLDivElement;
    render(page, appContainer);
    this.addEventListener();
    this.firstLoad();
  }
}
