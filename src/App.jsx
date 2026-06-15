// src/App.jsx

import { useState } from 'react';
import PaycheckForm from './components/PaycheckForm';
import { calculatePaycheck } from './utils/paycheckMath';
import ResultsSummary from './components/ResultsSummary';

export default function App() {
  const [paycheckResults, setPaycheckResults] = useState(null);

  function handleCalculate(formInputs) {
    const results = calculatePaycheck(formInputs);
    setPaycheckResults(results);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <header>
          <h1 className="text-2xl font-bold text-gray-900">Paycheck Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            California · Bi-weekly · Estimated tax liability based on 2024 brackets
          </p>
        </header>

        <PaycheckForm onCalculate={handleCalculate} />

        {paycheckResults && (
          <ResultsSummary paycheckResults={paycheckResults} />
        )}

      </div>
    </div>
  );
}