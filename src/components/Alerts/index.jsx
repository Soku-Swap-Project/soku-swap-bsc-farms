import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

function AlertDismissible(props) {
  const [show, setShow] = useState(true)

  if (show) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert
          style={{ background: '#FFF', marginTop: '-10px', maxWidth: '500px' }}
          onClose={() => setShow(false)}
          dismissible
        >
          <Alert.Heading style={{ fontSize: '16px', fontWeight: 'bold' }}>Attention!</Alert.Heading>
          <p>{props.children}</p>
        </Alert>
      </div>
    )
  }
  return null
}

export default AlertDismissible
