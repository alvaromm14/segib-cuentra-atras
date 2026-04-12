function sendHeightToParent() {
  const sendHeight = () => {
    const height = document.body.scrollHeight;
    window.parent.postMessage({ type: 'iframeHeight', height }, '*');
  };

  window.addEventListener('load', sendHeight);
  new ResizeObserver(sendHeight).observe(document.body);
  window.addEventListener('resize', sendHeight);
}

sendHeightToParent();

import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')
})

export default app
