import { useState, useEffect } from 'react';
import NRRCalculator from './components/NRRCalculator';
import PointsTable from './components/PointsTable';
import { getPointsTable } from './services/api';
import './styles/App.css';

const App = () => {
  const [pointsTable, setPointsTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPointsTable();
  }, []);

  const fetchPointsTable = async () => {
    try {
      setLoading(true);
      const response = await getPointsTable();
      if (response.success) {
        setPointsTable(response.data);
      } else {
        setError('Failed to load points table');
      }
    } catch (err) {
      setError('Error connecting to server. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>NRR Calculator</h1>
        <p className="subtitle">Calculate what you need to reach your desired position</p>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading">Loading points table...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <PointsTable data={pointsTable} />
            <NRRCalculator teams={pointsTable} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          <span className="footer-main">Cricket Analytics & NRR Calculator</span>
          <span className="footer-separator">•</span>
          <span className="footer-sub">Built with passion for the game</span>
        </p>
        <p className="footer-author">Developed by Urvish</p>
      </footer>
    </div>
  );
};

export default App;

