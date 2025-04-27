import { RainbowKitWrapper } from './providers/RainbowKitProvider'
import TokenWidget from './components/TokenWidget'
import './App.css'

function App() {
  return (
    <RainbowKitWrapper>
      <div className="app">
        <main>
          <TokenWidget />
        </main>
      </div>
    </RainbowKitWrapper>
  )
}

export default App
