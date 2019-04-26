import { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'

const Portal: FunctionComponent = ({ children }) => {
  const body = window && window.document && window.document.body

  if (!body) {
    return null
  }

  return ReactDOM.createPortal(children, body)
}

export default Portal
