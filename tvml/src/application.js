import { showTest } from './components/Test.vue'
import Alert from './components/Alert.vue'
import stackTemplate from './components/stackTemplate.vue'

import { createVueApp } from './lib/VueRender'
function showAlert() {
  const { app, doc } = createVueApp(Alert);
  app.provide('onSelect', () => {
    showStackTemplate()
  })
  app.mountDoc();
  navigationDocument.pushDocument(doc)
}

function showStackTemplate() {
  const { app, doc } = createVueApp(stackTemplate);
  app.mountDoc();
  navigationDocument.pushDocument(doc)
}

App.onLaunch = function(_) {
  // showTest()
  showAlert()
}
