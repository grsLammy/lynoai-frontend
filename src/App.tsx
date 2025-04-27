import { RainbowKitWrapper } from './providers/RainbowKitProvider'
import TokenWidget from './components/TokenWidget'
import './App.css'

function App() {
  return (
    <RainbowKitWrapper>
      <div className="app">
        <header>
          <h1>Lyno AI Token Sale</h1>
        </header>
        <main>
          <TokenWidget />
        </main>
      </div>
    </RainbowKitWrapper>
  )
}

export default App
