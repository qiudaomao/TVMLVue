import { createRenderer } from '@vue/runtime-core'

function createDocument() {
  const doc = DOMImplementationRegistry.getDOMImplementation().createDocument('', 'document', null);
  return doc
}

function createApp(options) {
    const doc = createDocument();
    const renderer = createRenderer({
        insert: (child, parent, anchor) => {
          if (parent.nodeType == 1) {
            console.log(`insert to ${parent.tagName}`)
          }
          if (child.nodeType == 1) {
            console.log(`insert ${child.tagName}`)
          } else if (child.nodeType == 3) {
            console.log(`insert ${child.nodeName} - ${child.nodeValue}`)
          }
            parent.insertBefore(child, anchor || null)
        },
        parentNode: node => {
            return node.parentNode
        },
        remove: child => {
            const parent = child.parentNode
            if (parent) {
                child.parentNode.removeChild(child)
            }
        },
        createElement: (tagName, options) => {
            return doc.createElement(tagName, options)
        },
        createText: text => doc.createTextNode(text),
        setText: (node, text) => {
            node.nodeValue = text
        },
        setElementText: (el, text) => {
            el.textContent = text
        },
        nextSibling: node => node.nextSibling,
        querySelector: selector => doc.querySelector(selector),
        cloneNode: el => el.cloneNode(true),
        patchProp(el, key, prevValue, nextValue) {
            //el[key] = nextValue;
            // console.log(`set ${key} => ${nextValue}`)
            if (key.match(/^on/)) {
                const event = key[2] === ':' ? key.slice(3) : key.slice(2).toLowerCase();
                if (prevValue) {
                    el.removeEventListener(event, prevValue)
                }
                el.addEventListener(event, nextValue)
            } else {
              el.setAttribute(key, nextValue)
            }
        },
        createComment: (text) => {
            return doc.createComment(text)
        },
        setScopeId(el, id) {
          el.setAttribute(id, '')
        }
    })
    const { createApp } = renderer;
    const app = createApp(options)
    app.config.compilerOptions.isCustomElement =  tag => {
        console.log(`check isCustomElement ${tag}`)
        return true
    }

    //fill style to doc
    app.mountDoc = () => {
      if (app._component && app._component && app._component.styles && app._component.styles.length > 0) {
        const style = app._component.styles.reduce((acc, style) => {
          return `${acc}${style}`
        })
        const document = doc.getElementsByTagName("document").item(0)
        const head = doc.createElement("head")
        document.appendChild(head)
        const styleElement = doc.createElement("style")
        styleElement.textContent = style
        head.appendChild(styleElement)
      }
      app.mount(doc.documentElement)
    }
    return {app, doc}
}

export { createApp }
export * from '@vue/runtime-core'
