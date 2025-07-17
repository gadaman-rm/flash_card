import { html, render } from 'lit';
import { router } from './src/Router';
import { FlashCardPage } from './src/view/pages/flash_card/flash_card';
import { DownloadPage } from './src/view/pages/download/download';
import { MainPage } from './src/view/pages/main/main';
const appContainer = document.getElementById('appContainer') as HTMLDivElement;

router.addRoute('/', () => {
  const mainPage = new MainPage();
  mainPage.setup();
  mainPage.load();
});

router.addRoute('/flash-card', () => {
  const flashCardPage = new FlashCardPage();
  flashCardPage.setup();
  flashCardPage.load();
});

router.addRoute('/download', () => {
  const downloadPage = new DownloadPage();
  downloadPage.setup();
  downloadPage.load();
});

router.addRoute('/404', () => {
  const page = html`<h1>Not found</h1>`;
  render(page, appContainer);
});

async function init() {
  router.navigateTo('/flash-card');
}

init();
