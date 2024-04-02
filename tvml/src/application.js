import { showTest } from './components/Test.vue'
import Alert from './components/Alert.vue'

import { createApp } from './lib/VueRender'
function showAlert() {
  const { app, doc } = createApp(Alert);
  app.mountDoc();
  navigationDocument.pushDocument(doc)
}

App.onLaunch = function(_) {
  // showTest()
  showAlert()
}
