import { useState } from 'react'
import './App.css'

// Simplified version - will add backend integration later

function App() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [progress, setProgress] = useState('')
  
  const URL = 'https://policies.ncdhhs.gov/divisional-n-z/social-services/child-welfare-services/cws-policies-manuals/'

  const handleDownload = async () => {
    try {
      setStatus('processing')
      setMessage('🚧 Backend integration coming soon! This is the frontend-only version.')
      setResults(null)
      setProgress('')
      
      // Simulate processing for demo
      setTimeout(() => {
        setStatus('success')
        setMessage('✅ Frontend deployed successfully! Backend integration will be added next.')
        setResults({
          summary: {
            total: 0,
            successful: 0,
            failed: 0
          },
          results: [],
          errors: []
        })
      }, 2000)
      
    } catch (error) {
      setStatus('error')
      setMessage(`❌ Error: ${error.message}`)
      setResults(null)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#4CAF50'
      case 'error': return '#f44336'
      case 'processing': return '#ff9800'
      default: return '#666'
    }
  }

  return (
    <div className="App">
      <header>
        <h1>📄 NCDHHS PDF Downloader</h1>
        <p>Downloads PDF files from NCDHHS Child Welfare Services policies and uploads them to AWS S3</p>
      </header>

      <main>
        <div className="controls">
          <button 
            onClick={handleDownload}
            disabled={status === 'processing'}
            className="main-button"
          >
            {status === 'processing' ? '⏳ Processing...' : '🚀 Start Download and Upload'}
          </button>
        </div>

        {message && (
          <div className="status-message" style={{ color: getStatusColor() }}>
            <p>{message}</p>
          </div>
        )}

        {progress && status === 'processing' && (
          <div className="progress-message">
            <p>📊 {progress}</p>
          </div>
        )}

        {results && (
          <div className="results">
            <h3>📊 Results Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{results.summary.total}</span>
                <span className="stat-label">Total PDFs Found</span>
              </div>
              <div className="stat success">
                <span className="stat-number">{results.summary.successful}</span>
                <span className="stat-label">Successfully Uploaded</span>
              </div>
              {results.summary.failed > 0 && (
                <div className="stat error">
                  <span className="stat-number">{results.summary.failed}</span>
                  <span className="stat-label">Failed</span>
                </div>
              )}
            </div>

            {results.results && results.results.length > 0 && (
              <div className="uploaded-files">
                <h4>✅ Successfully Uploaded Files:</h4>
                <ul>
                  {results.results.map((result, index) => (
                    <li key={index}>
                      <strong>{result.filename}</strong>
                      <br />
                      <small>Size: {(result.size / 1024).toFixed(1)} KB</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.errors && results.errors.length > 0 && (
              <div className="error-files">
                <h4>❌ Failed Files:</h4>
                <ul>
                  {results.errors.map((error, index) => (
                    <li key={index}>
                      <strong>{error.url}</strong>
                      <br />
                      <small>Error: {error.error}</small>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <p>Target URL: <a href={URL} target="_blank" rel="noopener noreferrer">{URL}</a></p>
        <p>Powered by AWS Amplify (Frontend deployed, backend integration coming next)</p>
      </footer>
    </div>
  )
}

export default App
