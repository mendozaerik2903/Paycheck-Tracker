import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PaycheckForm from './components/PaycheckForm';
import { calculatePaycheck } from './utils/paycheckMath';
import ResultsSummary from './components/ResultsSummary';
import Signup from './pages/Signup';
import Login from './pages/Login';
import History from './pages/History';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const [paycheckResults, setPaycheckResults] = useState(null);
  const [meta, setMeta] = useState(null);

  function handleCalculate(formInputs) {
    const results = calculatePaycheck(formInputs);
    setPaycheckResults(results);
    setMeta({
      hoursWorked: formInputs.hoursWorked,
      hourlyWage: formInputs.hourlyWage,
      payPeriodEnd: formInputs.payPeriodEnd,
    })
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>} />
        <Route path="/" element={
          <ProtectedRoute>
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
                  <ResultsSummary paycheckResults={paycheckResults} meta={meta} />
                )}
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}