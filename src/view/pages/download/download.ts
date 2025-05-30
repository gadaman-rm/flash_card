import './download.scss';
import { html, render } from 'lit';
import '@material/web/all';
import resourceManager from '../../../manager/lifecycle/ResourceManager';
import downloadApi from '../../../api/local/DownloadApi';

export class DownloadPage {
  private async downloadCSV(fileUrl: string, filename: string): Promise<void> {
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

  setup() {}

  addEventListener() {
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;

    if (downloadBtn!.dataset.eventListenerAdded !== 'true') {
      downloadBtn.dataset.eventListenerAdded = 'true';
      resourceManager.registerEventListener(downloadBtn, 'click', () => {
        // Replace this URL with your actual CSV file URL
        this.downloadCSV(
          'https://www.gadapanel.ir/public/vocabulary/vocabulary.csv',
          'vocabulary.csv'
        );
      });
    }
  }

  firstLoad() {}

  load() {
    const page = html`
      <div class="container">
        <div class="function-container">
          <h1>Download Vocabulary</h1>
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
