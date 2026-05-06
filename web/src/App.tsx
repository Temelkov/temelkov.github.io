import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { PortfolioShell } from './PortfolioShell'
import { CustomCursor } from './components/CustomCursor'
import { GlobalParticles } from './components/GlobalParticles'

function App() {
  return (
    <ThemeProvider>
      <GlobalParticles />
      <LanguageProvider>
        <CustomCursor />
        <PortfolioShell />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
