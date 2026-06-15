import { useAuth } from "../context/AuthContext";
import { logPaycheck } from "../firebase/firestore";

export default function ResultsSummary({ paycheckResults, meta }) {
  const { user } = useAuth();

  const handleLog = async () => {
    await logPaycheck(user.uid, paycheckResults, meta);
  }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">Results</h2>
            <ResultRow label="Gross Pay" value={paycheckResults.grossPay} highlight />
            <ResultRow label="Federal Tax" value={paycheckResults.federalTax} />
            <ResultRow label="California State Tax" value={paycheckResults.stateTax} />
            <ResultRow label="Social Security" value={paycheckResults.socialSecurity} />
            <ResultRow label="Medicare" value={paycheckResults.medicare} />
            <ResultRow label="CA State Disability (SDI)" value={paycheckResults.sdi} />
            {paycheckResults.preTaxDeductions > 0 && (
            <ResultRow label="Pre-Tax Deductions" value={paycheckResults.preTaxDeductions} />
            )}
            {paycheckResults.postTaxDeductions > 0 && (
            <ResultRow label="Post-Tax Deductions" value={paycheckResults.postTaxDeductions} />
            )}
            <div className="border-t border-gray-100 pt-3">
            <ResultRow label="Net Pay (Take Home)" value={paycheckResults.netPay} highlight />
            </div>
            <button
              onClick={handleLog}
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
            >
              Log Paycheck
            </button>
        </div>
    )
}

function ResultRow({ label, value, highlight = false }) {
    return (
      <div className="flex justify-between items-center">
        <span className={`text-sm mr-4 ${highlight ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
        {label}
        </span>
        <span className={`text-sm ${highlight ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
          ${value.toFixed(2)}
        </span>
      </div>
    );
  }