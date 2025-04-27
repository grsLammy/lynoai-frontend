import { RainbowKitWrapper } from './providers/RainbowKitProvider'
import TokenWidget from './components/TokenWidget'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  return (
    <RainbowKitWrapper>
      <div className="app">
        <main>
          <TokenWidget />
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            // Default toast styling
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '8px',
            },
            // Different styles for different toast types
            success: {
              style: {
                background: '#1a1a1a',
                border: '1px solid #5252cd',
              },
              iconTheme: {
                primary: '#5252cd',
                secondary: '#FFFAEE',
              },
            },
            error: {
              style: {
                background: '#1a1a1a',
                border: '1px solid #e87c7c',
              },
              iconTheme: {
                primary: '#e87c7c',
                secondary: '#FFFAEE',
              },
            },
          }}
        />
      </div>
    </RainbowKitWrapper>
  )
}

export default App
