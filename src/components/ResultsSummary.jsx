import { useAuth } from "../context/AuthContext";
import { logPaycheck } from "../firebase/firestore";
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

export default function ResultsSummary({ paycheckResults, meta }) {
  const { user } = useAuth();

  const pieData = [
    { name: "Federal Tax", value: paycheckResults.federalTax },
    { name: "State Tax", value: paycheckResults.stateTax },
    { name: "Social Security", value: paycheckResults.socialSecurity },
    { name: "Medicare", value: paycheckResults.medicare },
    { name: "SDI", value: paycheckResults.sdi },
    { name: "Pre-Tax Deductions", value: paycheckResults.preTaxDeductions },
    { name: "Post-Tax Deductions", value: paycheckResults.postTaxDeductions },
    { name: "Take Home", value: paycheckResults.netPay },
  ].filter(entry => entry.value !== null && entry.value > 0);;
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316", "#eab308", "#22c55e", "#14b8a6"];

  const handleLog = async () => {
    await logPaycheck(user.uid, paycheckResults, meta);
  }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-semibold text-gray-800">Results</h2>
            {paycheckResults.grossPay !== null && (
              <ResultRow label="Gross Pay" value={paycheckResults.grossPay} highlight />
            )}
            {paycheckResults.federalTax !== null && (
              <ResultRow label="Federal Tax" value={paycheckResults.federalTax} />
            )}
            {paycheckResults.stateTax !== null && (
              <ResultRow label="California State Tax" value={paycheckResults.stateTax} />
            )}
            {paycheckResults.socialSecurity !== null && (
              <ResultRow label="Social Security" value={paycheckResults.socialSecurity} />
            )}
            {paycheckResults.medicare !== null && (
              <ResultRow label="Medicare" value={paycheckResults.medicare} />
            )}
            {paycheckResults.sdi !== null && (
              <ResultRow label="CA State Disability (SDI)" value={paycheckResults.sdi} />
            )}
            {paycheckResults.preTaxDeductions > 0 && paycheckResults.preTaxDeductions !== null && (
              <ResultRow label="Pre-Tax Deductions" value={paycheckResults.preTaxDeductions} />
            )}
            {paycheckResults.postTaxDeductions > 0 && paycheckResults.postTaxDeductions !== null && (
              <ResultRow label="Post-Tax Deductions" value={paycheckResults.postTaxDeductions} />
            )}
            <div className="border-t border-gray-100 pt-3">
            <ResultRow label="Net Pay (Take Home)" value={paycheckResults.netPay} highlight />
            </div>
            {paycheckResults.federalTax !== null && (
              <>
              <PieChart height={500} width={500}>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
              <button
                onClick={handleLog}
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
              >
                Log Paycheck
              </button>
            </>
            )}
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