import './main.scss';
import { html, render } from 'lit';
import '@material/web/all';
import resourceManager from '../../../manager/lifecycle/ResourceManager';
import fileApi from '../../../api/local/FileApi';

interface Vocabulary {
  word: string;
  definition: string;
  example: string;
  status: 'unknown' | 'learning' | 'known';
}

let vocabulary: Vocabulary[] = [];
let currentIndex = 0;
let isFlipped = false;

export class MainPage {
  private async loadVocabularyFromCSV(): Promise<void> {
    try {
      const csvContent = await fileApi.readFile('vocabulary.csv');
      if (!csvContent) {
        console.error('Failed to read vocabulary.csv');
        return;
      }

      // Parse CSV content
      const lines = csvContent.split('\n');
      vocabulary = lines
        .filter(line => line.trim()) // Skip empty lines
        .map(line => {
          const [word, definition, example] = line.split(',').map(field => field.trim());
          return {
            word,
            definition,
            example,
            status: 'unknown' as const
          };
        });

      // Update the UI with the loaded vocabulary
      this.updateCard();
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    }
  }

  private updateCard(): void {
    if (vocabulary.length === 0) return;
    
    const wordElement = document.getElementById('word') as HTMLElement;
    const definitionElement = document.getElementById('definition') as HTMLElement;
    const exampleElement = document.getElementById('example') as HTMLElement;
    const flashcard = document.getElementById('flashcard') as HTMLElement;
    const currentCardElement = document.getElementById('currentCard') as HTMLElement;
    const totalCardsElement = document.getElementById('totalCards') as HTMLElement;
    
    const vocab = vocabulary[currentIndex];
    wordElement.textContent = vocab.word;
    definitionElement.textContent = vocab.definition;
    exampleElement.textContent = vocab.example;
    currentCardElement.textContent = (currentIndex + 1).toString();
    totalCardsElement.textContent = vocabulary.length.toString();
    isFlipped = false;
    flashcard.classList.remove('flipped');
    this.updateReviewButtons();
  }

  private updateReviewButtons(): void {
    if (vocabulary.length === 0) return;
    
    const markKnownBtn = document.getElementById('markKnown') as HTMLElement;
    const markLearningBtn = document.getElementById('markLearning') as HTMLElement;
    const vocab = vocabulary[currentIndex];
    markKnownBtn.classList.toggle('marked', vocab.status === 'known');
    markLearningBtn.classList.toggle('marked', vocab.status === 'learning');
  }

  setup() {}

  addEventListener() {
    const flashcard = document.getElementById('flashcard') as HTMLElement;
    const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
    const flipBtn = document.getElementById('flipBtn') as HTMLButtonElement;
    const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
    const markKnownBtn = document.getElementById('markKnown') as HTMLButtonElement;
    const markLearningBtn = document.getElementById('markLearning') as HTMLButtonElement;

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
          this.updateCard();
        }
      });
    }

    if (nextBtn!.dataset.eventListenerAdded !== 'true') {
      nextBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(nextBtn, 'click', () => {
        if (currentIndex < vocabulary.length - 1) {
          currentIndex++;
          this.updateCard();
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
          markLearningBtn.classList.remove('marked', 'marked-animation');
          setTimeout(() => markLearningBtn.classList.remove('marked-animation'), 300);
        });
      }
    }
  }

  firstLoad() {
    this.loadVocabularyFromCSV();
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
