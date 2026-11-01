import { useCounterStore } from './store/counterStore.ts'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const count = useCounterStore((state) => state.totalClicks)
  const increment = useCounterStore((state) => state.increment)

  const name = useCounterStore((state) => state.name)
  const setName = useCounterStore((state) => state.setName)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
        </div>
        <button
          type="button"
          className="counter"
          onClick={increment}
        >
          Count is {count}
        </button>

        <input className="counter" value={name} onChange={(e) => setName(e.target.value)}/>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button"
            className="helper"
            onClick={() => useCounterStore.setState({ totalClicks: 100 })}
          >
            {`setState({ totalClicks: 100 })`}
          </button>
          <button
            type="button"
            className="helper"
            onClick={() => void useCounterStore.persist.rehydrate()}
          >
            Rehydrate
          </button>
          <button
            type="button"
            className="helper"
            onClick={() => useCounterStore.persist.clearStorage()}
          >
            Clear Storage
          </button>
        </div>
      </section>
    </>
  )
}

export default App
