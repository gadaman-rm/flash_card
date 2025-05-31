import './download.scss';
import { html, render } from 'lit';
import '@material/web/all';
import resourceManager from '../../../manager/lifecycle/ResourceManager';
import downloadApi from '../../../api/local/DownloadApi';

export class DownloadPage {
  private async downloadCSV(fileUrl: string): Promise<void> {
    try {
      const response = await downloadApi.download(fileUrl);
      if (!response) {
        throw new Error('Failed to get download URL');
      }
      console.log(response);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  setup() { }

  addEventListener() {
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement;

    if (homeBtn!.dataset.eventListenerAdded !== 'true') {
      homeBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(homeBtn, 'click', () => {
        window.location.href = '/';
      });
    }

    if (downloadBtn!.dataset.eventListenerAdded !== 'true') {
      downloadBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(downloadBtn, 'click', () => {
        // Replace this URL with your actual CSV file URL
        this.downloadCSV(
          'https://www.gadapanel.ir/public/vocabulary/vocabulary.csv'
        );
      });
    }
  }

  firstLoad() { }

  load() {
    const page = html`
      <div class="container">
        <div class="function-container">
          <div class="header">
            <button id="homeBtn" class="home-button" title="Go to Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
            <h1>Download Vocabulary</h1>
          </div>
          <div class="download-section">
            <p>Click the button below to download your vocabulary list as a CSV file.</p>
            <button id="downloadBtn" class="download-button">Download Vocabulary CSV</button>
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
