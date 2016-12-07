import FontFaceObserver from 'fontfaceobserver';

// Font Observer
const sourceSerifObserver = new FontFaceObserver('Source Serif Pro', {});
sourceSerifObserver.load().then(() => {
  document.documentElement.classList.add('source-serif-pro');
}, () => {
  document.documentElement.classList.remove('source-serif-pro');
});