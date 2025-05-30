import { html, render } from 'lit';
import { router } from './src/Router';
import { MainPage } from './src/view/pages/main/main';

const appContainer = document.getElementById('appContainer') as HTMLDivElement;

router.addRoute('/', () => {
  const mainPage = new MainPage();
  mainPage.setup();
  mainPage.load();
});

router.addRoute('/404', () => {
  const page = html`<h1>Not found</h1>`;
  render(page, appContainer);
});

async function init() {
  router.navigateTo('/');
}

init();
