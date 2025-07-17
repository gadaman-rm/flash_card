import './flash_card.scss';
import { html, render } from 'lit';
import '@material/web/all';
import resourceManager from '../../../manager/lifecycle/ResourceManager';
import fileApi from '../../../api/local/FileApi';
import { router } from '../../../Router';

interface Vocabulary {
  word: string;
  definition: string;
  example: string;
  status: 'unknown' | 'learning' | 'known';
  stars: number; // 1-5, difficulty rating
}

let vocabulary: Vocabulary[] = [];
let currentIndex = 0;
let isFlipped = false;

export class FlashCardPage {
  private async loadVocabularyFromCSV(): Promise<void> {
    try {
      const csvContent = await fileApi.readFile('vocabulary.csv', './');
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
            status: 'unknown' as const,
            stars: 0, // default to 0 stars
          };
        });

      // Load status data
      await this.loadStatusData();

      // Update the UI with the loaded vocabulary
      this.updateCard();
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    }
  }

  private async loadStatusData(): Promise<void> {
    try {
      const statusContent = await fileApi.readFile('vocabulary_status.csv', './');
      if (!statusContent) {
        return; // No status file exists yet, which is fine
      }

      // Parse status CSV content
      // Now expects: word,status,stars
      const statusMap = new Map<
        string,
        { status: 'unknown' | 'learning' | 'known'; stars: number }
      >();
      const lines = statusContent.split('\n');
      lines
        .filter(line => line.trim())
        .forEach(line => {
          const [word, status, stars] = line.split(',').map(field => field.trim());
          if (word && status) {
            statusMap.set(word, {
              status: status as 'unknown' | 'learning' | 'known',
              stars: Number(stars) || 0,
            });
          }
        });

      // Update vocabulary status and stars
      vocabulary.forEach(vocab => {
        const saved = statusMap.get(vocab.word);
        if (saved) {
          vocab.status = saved.status;
          vocab.stars = saved.stars;
        }
      });
    } catch (error) {
      console.error('Error loading status data:', error);
    }
  }

  private async saveStatusToCSV(): Promise<void> {
    try {
      // Save as: word,status,stars
      const statusContent = vocabulary
        .map(vocab => `${vocab.word},${vocab.status},${vocab.stars}`)
        .join('\n');
      await fileApi.writeFile('vocabulary_status.csv', statusContent, './');
    } catch (error) {
      console.error('Error saving status data:', error);
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
    const starsContainer = document.getElementById('starsContainer') as HTMLElement;

    // Add fade-out animation
    wordElement.classList.add('fade-out');
    definitionElement.classList.add('fade-out');
    exampleElement.classList.add('fade-out');

    // Wait for fade-out to complete before updating content
    setTimeout(() => {
      const vocab = vocabulary[currentIndex];
      wordElement.textContent = vocab.word;
      definitionElement.textContent = vocab.definition;
      exampleElement.textContent = vocab.example;

      // Hide example element if it's empty
      if (!vocab.example || vocab.example.trim() === '') {
        exampleElement.style.display = 'none';
      } else {
        exampleElement.style.display = 'block';
      }

      currentCardElement.textContent = (currentIndex + 1).toString();
      totalCardsElement.textContent = vocabulary.length.toString();
      isFlipped = false;
      flashcard.classList.remove('flipped');

      // Update stars UI
      if (starsContainer) {
        starsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement('span');
          star.className = 'star' + (i <= vocab.stars ? ' filled pop' : '');
          star.textContent = '★';
          star.setAttribute('data-star', i.toString());
          starsContainer.appendChild(star);
        }
      }

      // Remove fade-out and add fade-in animation
      wordElement.classList.remove('fade-out');
      definitionElement.classList.remove('fade-out');
      exampleElement.classList.remove('fade-out');
      wordElement.classList.add('fade-in');
      definitionElement.classList.add('fade-in');
      exampleElement.classList.add('fade-in');

      // Remove fade-in class after animation completes
      setTimeout(() => {
        wordElement.classList.remove('fade-in');
        definitionElement.classList.remove('fade-in');
        exampleElement.classList.remove('fade-in');
      }, 300);

      this.updateReviewButtons();
    }, 300);
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
    const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement;

    if (homeBtn!.dataset.eventListenerAdded !== 'true') {
      homeBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(homeBtn, 'click', () => {
        router.navigateTo('/');
      });
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
        if (isFlipped) {
          isFlipped = false;
          flashcard.classList.remove('flipped');
          setTimeout(() => {
            if (currentIndex > 0) {
              currentIndex--;
              this.updateCard();
            }
          }, 500);
        } else {
          if (currentIndex > 0) {
            currentIndex--;
            this.updateCard();
          }
        }
      });
    }

    if (nextBtn!.dataset.eventListenerAdded !== 'true') {
      nextBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(nextBtn, 'click', () => {
        if (currentIndex < vocabulary.length - 1) {
          // Unflip the card if it's flipped
          if (isFlipped) {
            isFlipped = false;
            flashcard.classList.remove('flipped');
            // Wait for the flip animation to complete (300ms) before moving to next card
            setTimeout(() => {
              if (currentIndex < vocabulary.length - 1) {
                currentIndex++;
                this.updateCard();
              }
            }, 500);
          } else {
            if (currentIndex < vocabulary.length - 1) {
              currentIndex++;
              this.updateCard();
            }
          }
        }
      });

      const goToCardBtn = document.getElementById('goToCardBtn') as HTMLButtonElement;
      const cardNumberInput = document.getElementById('cardNumberInput') as HTMLInputElement;

      if (goToCardBtn!.dataset.eventListenerAdded !== 'true') {
        goToCardBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(goToCardBtn, 'click', () => {
          const targetCard = parseInt(cardNumberInput.value);
          if (!isNaN(targetCard) && targetCard >= 1 && targetCard <= vocabulary.length) {
            if (isFlipped) {
              isFlipped = false;
              flashcard.classList.remove('flipped');
              setTimeout(() => {
                currentIndex = targetCard - 1;
                this.updateCard();
              }, 500);
            } else {
              currentIndex = targetCard - 1;
              this.updateCard();
            }
          }
          cardNumberInput.value = '';
        });
      }

      const prevLearningBtn = document.getElementById('prevLearningBtn') as HTMLButtonElement;
      const nextLearningBtn = document.getElementById('nextLearningBtn') as HTMLButtonElement;
      const starFilterSelect = document.getElementById('starFilterSelect') as HTMLSelectElement;

      let getStarFilter = () => {
        if (!starFilterSelect) return undefined;
        const val = starFilterSelect.value;
        return val ? Number(val) : undefined;
      };

      if (prevLearningBtn!.dataset.eventListenerAdded !== 'true') {
        prevLearningBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(prevLearningBtn, 'click', () => {
          let newIndex = currentIndex;
          const starFilter = getStarFilter();
          while (newIndex > 0) {
            newIndex--;
            if (
              vocabulary[newIndex].status === 'learning' &&
              (starFilter === undefined || vocabulary[newIndex].stars === starFilter)
            ) {
              currentIndex = newIndex;
              this.updateCard();
              break;
            }
          }
        });
      }

      if (nextLearningBtn!.dataset.eventListenerAdded !== 'true') {
        nextLearningBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(nextLearningBtn, 'click', () => {
          let newIndex = currentIndex;
          const starFilter = getStarFilter();
          while (newIndex < vocabulary.length - 1) {
            newIndex++;
            if (
              vocabulary[newIndex].status === 'learning' &&
              (starFilter === undefined || vocabulary[newIndex].stars === starFilter)
            ) {
              currentIndex = newIndex;
              this.updateCard();
              break;
            }
          }
        });
      }

      if (markKnownBtn!.dataset.eventListenerAdded !== 'true') {
        markKnownBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(markKnownBtn, 'click', async () => {
          vocabulary[currentIndex].status = 'known';
          markKnownBtn.classList.add('marked', 'marked-animation');
          markLearningBtn.classList.remove('marked', 'marked-animation');
          setTimeout(() => markKnownBtn.classList.remove('marked-animation'), 300);
          await this.saveStatusToCSV();
        });
      }

      if (markLearningBtn!.dataset.eventListenerAdded !== 'true') {
        markLearningBtn.dataset.eventListenerAdded = 'true';
        resourceManager.registerEventListener(markLearningBtn, 'click', async () => {
          vocabulary[currentIndex].status = 'learning';
          markLearningBtn.classList.add('marked', 'marked-animation');
          markKnownBtn.classList.remove('marked', 'marked-animation');
          setTimeout(() => markLearningBtn.classList.remove('marked-animation'), 300);
          await this.saveStatusToCSV();
        });
      }
    }

    const starsContainer = document.getElementById('starsContainer');

    // Add event listeners for stars
    if (starsContainer && starsContainer.dataset.eventListenerAdded !== 'true') {
      starsContainer.dataset.eventListenerAdded = 'true';
      starsContainer.addEventListener('click', async e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('star')) {
          const starValue = Number(target.getAttribute('data-star'));
          if (!isNaN(starValue)) {
            vocabulary[currentIndex].stars = starValue;
            this.updateCard();
            //await this.saveStatusToCSV();
          }
        }
      });
    }
  }

  firstLoad() {
    this.loadVocabularyFromCSV();
  }

  load() {
    const page = html`
      <div class="flash-card-container">
        <div class="function-container">
          <div class="header">
            <button id="homeBtn" class="home-button" title="Go to Home">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
            <h1>Flash Card</h1>
          </div>
          <div class="card-container">
            <div class="card" id="flashcard">
              <div class="card-front">
                <h2 id="word">Word</h2>
                <div id="starsContainer" class="stars-container"></div>
              </div>
              <div class="card-back">
                <h2 id="definition" class="definition">Definition</h2>
                <p id="example" class="example">Example Sentence</p>
              </div>
            </div>
          </div>
          <div class="controls">
            <button id="prevBtn" class="control-button">Previous</button>
            <button id="flipBtn" class="control-button">Flip</button>
            <button id="nextBtn" class="control-button">Next</button>
          </div>
          <div class="learning-navigation">
            <button id="prevLearningBtn" class="learning-nav-button stylish-nav">
              <span class="arrow">&#x25C0;&#x25C0;</span> <span>Learning</span>
            </button>
            <select id="starFilterSelect" class="star-filter-select" title="Filter by stars">
              <option value="">All Stars</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
            <button id="nextLearningBtn" class="learning-nav-button stylish-nav">
              <span>Learning</span> <span class="arrow">&#x25B6;&#x25B6;</span>
            </button>
          </div>
          <div class="review-controls">
            <button id="markKnown" class="review-button">Known</button>
            <button id="markLearning" class="review-button">Learning</button>
          </div>
          <div class="go-to-card">
            <input type="number" id="cardNumberInput" min="1" placeholder="Card #" />
            <button id="goToCardBtn" class="control-button">Go to Card</button>
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
