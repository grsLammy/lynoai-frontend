import { RainbowKitWrapper } from './providers/RainbowKitProvider'
import { ConnectWallet } from './components/ConnectWallet'
import './App.css'

function App() {
  return (
    <RainbowKitWrapper>
      <div className="app">
        <header>
          <h1>Lyno AI</h1>
          <ConnectWallet />
        </header>
        <main>
          {/* Your app content goes here */}
          <div className="content">
            <h2>Welcome to Lyno AI</h2>
            <p>Connect your wallet to get started</p>
          </div>
        </main>
      </div>
    </RainbowKitWrapper>
  )
}

export default App
