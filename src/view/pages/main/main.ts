import './main.scss';
import { html, render } from 'lit';
import "@material/web/all";
import { router } from '../../../Router';
import resourceManager from '../../../manager/lifecycle/ResourceManager';

export class MainPage {
    setup() {

    }

    addEventListener() {
        const flashCardButton = document.querySelector('.button-container button:first-child') as HTMLButtonElement;
        const downloadButton = document.querySelector('.button-container button:last-child') as HTMLButtonElement;

        if (flashCardButton!.dataset.eventListenerAdded !== 'true') {
            flashCardButton.dataset.eventListenerAdded = 'true';
            resourceManager.registerEventListener(flashCardButton, 'click', () => {
                router.navigateTo('/flash-card');
            });
        }

        if (downloadButton!.dataset.eventListenerAdded !== 'true') {
            downloadButton.dataset.eventListenerAdded = 'true';
            resourceManager.registerEventListener(downloadButton, 'click', () => {
                router.navigateTo('/download');
            });
        }
    }

    firstLoad() {
        // Any first load operations
    }


    load() {
        const page = html`
            <div class="main-container">
                <h1>Welcome to Flash Card App</h1>
                <div class="button-container">
                    <button>Go to Flash Cards</button>
                    <button>Go to Downloads</button>
                </div>
            </div>
        `;
        const appContainer: HTMLDivElement = document.getElementById("appContainer") as HTMLDivElement;
        render(page, appContainer);
        this.addEventListener();
        this.firstLoad();
    }
} 