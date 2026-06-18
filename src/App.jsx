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
import { logPaycheck } from './firebase/firestore';
import { useAuth } from './context/AuthContext';
import Budget from './pages/Budget';

export default function App() {
  const [paycheckResults, setPaycheckResults] = useState(null);
  const [meta, setMeta] = useState(null);
  const [isManual, setIsManual] = useState(false);
  const { user } = useAuth();

  function handleCalculate(formInputs) {
    let results;
    if (isManual) {
      results = {
        netPay: formInputs.netPay,
        grossPay: null,
        federalTax: null,
        stateTax: null,
        socialSecurity: null,
        medicare: null,
        sdi: null,
        preTaxDeductions: null,
        postTaxDeductions: null,
        totalDeductions: null,
      };
      const newMeta = {
        hoursWorked: null,
        hourlyWage: null,
        payPeriodEnd: formInputs.payPeriodEnd,
      };
      setMeta(newMeta);
      logPaycheck(user.uid, results, newMeta);
    } else {
      results = calculatePaycheck(formInputs);
      setMeta({
        hoursWorked: formInputs.hoursWorked,
        hourlyWage: formInputs.hourlyWage,
        payPeriodEnd: formInputs.payPeriodEnd,
      });
    }
    setPaycheckResults(results);
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/budget/:id" element={
          <ProtectedRoute>
            <Budget />
          </ProtectedRoute>
        } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } />
        <Route path="/calculator" element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <header>
                  <h1 className="text-2xl font-bold text-gray-900">Paycheck Calculator</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    California · Bi-weekly · Estimated tax liability based on 2024 brackets
                  </p>
                </header>
                <PaycheckForm onCalculate={handleCalculate} isManual={isManual} setIsManual={setIsManual} />
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