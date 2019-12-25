import React from 'react'

import Diagram from '../Diagram'
import DebugPanel from '../DebugPanel'
import Providers from '../Providers'

const Layout = () => (
  <Providers>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: 200,
          borderRight: '1px solid black',
          padding: '10px',
          boxSizing: 'border-box',
        }}
      >
        <DebugPanel />
      </div>
      <div
        style={{
          flex: 1,
        }}
      >
        <Diagram />
      </div>
    </div>
  </Providers>
)

export default Layout
