import { createRenderer } from '@vue/runtime-core'

function createDocument() {
  const doc = DOMImplementationRegistry.getDOMImplementation().createDocument('', 'document', null);
  return doc
}

function debugDoc(action, doc) {
  // print doc via XMLSerializer
  const serializer = new XMLSerializer();
  const xml = serializer.serializeToString(doc);
  console.log(`${action} doc ${xml}`)
}

function createVueApp(options) {
    const doc = createDocument();
    const preservedNodes = new Map();
    let nodeID = 0
    const isTextNode = (node) => {
        return node.nodeType === 3
    }
    const getNodeID = (node) => {
        if (node) {
            if (node._uid == null) {
                nodeID += 1;
                node._uid = nodeID;
            }
            return node._uid;
        }
        return null
    }
    const updateNodeValue = node => {
        if (node._handledTextNodes) {
            node.nodeValue = node._handledTextNodes.reduce((acc, textNode) => `${acc}${textNode.nodeValue ?? ""}`, '')
        }
    }
    
    const renderer = createRenderer({
        insert: (child, parent, anchor) => {
            if (!anchor && isTextNode(child)) {
                const target = parent.lastChild
                if (target && isTextNode(target)) {
                    // merge child to target
                    if (!target._handledTextNodes) {
                        target._handledTextNodes = [
                            {
                                id: getNodeID(target),
                                value: target.nodeValue
                            }
                        ]
                    }
                    
                    target._handledTextNodes.push({
                        id: getNodeID(child),
                        value: child.nodeValue
                    })
                    
                    child._targetTextNode = target
                    updateNodeValue(target)
                    
                    preservedNodes.set(child)
                    return
                }
            } else if (anchor && isTextNode(anchor) && isTextNode(child)) {
                if (!anchor._handledTextNodes) {
                    anchor._handledTextNodes = [
                        {
                            id: getNodeID(anchor),
                            value: anchor.nodeValue
                        }
                    ]
                }
                anchor._handledTextNodes.unshift({
                    id: getNodeID(child),
                    value: child.nodeValue
                })
                
                child._targetTextNode = anchor
                updateNodeValue(anchor)
                
                preservedNodes.set(child)
                return
            } else if (anchor && isTextNode(anchor)) {
                // add to _targetTextNode
                anchor = anchor._targetTextNode
            }
            parent.insertBefore(child, anchor || null)
        },
        parentNode: node => {
            return node.parentNode
        },
        remove: child => {
            let parent = child.parentNode
            if (isTextNode(child)) {
                if (!parent && child._targetTextNode) {
                    parent = child._targetTextNode.parentNode
                }
                const childNodesCount = parent.childNodes.length
                for (let index = 0; index < childNodesCount; index++) {
                    const node = parent.childNodes[index]
                    if (isTextNode(node)) {
                        const nodeHasControlledNodes = node._handledTextNodes && node._handledTextNodes.length > 1
                        if (node === child) {
                            if (nodeHasControlledNodes) {
                                const nodes = node._handledTextNodes
                                const nodeID = getNodeID(child)
                                const reference = nodes.find(({ id }) => id === nodeID)
                                reference.value = '';
                                updateNodeValue(node)
                            } else {
                                parent.removeChild(node)
                            }
                            break;
                        } else if (nodeHasControlledNodes) {
                            const nodes = node._handledTextNodes
                            const nodeID = getNodeID(child)
                            const referenceIndex = nodes.findIndex(({ id }) => id === nodeID)
                            if (referenceIndex >= 0) {
                                nodes.splice(referenceIndex, 1)
                                updateNodeValue(node)
                                break
                            }
                        }
                    }
                }
            } else {
                parent.removeChild(child)
            }
            preservedNodes.delete(child)
        },
        createElement: (tagName, options) => {
            return doc.createElement(tagName, options)
        },
        createText: text => {
            const textNode = doc.createTextNode(text)
            return textNode
        },
        setText: (node, text) => {
            let target
            if (node._targetTextNode) {
                target = node._targetTextNode
            } else if (node._handledTextNodes) {
                target = node
            }
            if (target) {
                const nodes = target._handledTextNodes
                const nodeID = getNodeID(node)
                const reference = nodes.find(({ id }) => id === nodeID)
                reference.nodeValue = text
                updateNodeValue(target)
            } else {
                node.nodeValue = text
            }
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
                if (nextValue) {
                    el.addEventListener(event, nextValue)
                }
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
    app.config.compilerOptions.isCustomElement =  _ => {
        // console.log(`check isCustomElement ${tag}`)
        return true
    }

    //fill style to doc
    app.mountDoc = (props) => {
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
      app.mount(doc.documentElement, props)
      doc.addEventListener("unload", () => {
          app.unmount()
          preservedNodes.clear()
      })
    }
    return {app, doc}
}

export { createVueApp }
export * from '@vue/runtime-core'
