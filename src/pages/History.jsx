import { useState, useEffect } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, LabelList } from 'recharts';
import { useAuth } from "../context/AuthContext";
import { getPaychecks, logPaycheck, deletePaycheck } from "../firebase/firestore";
import { Link, useNavigate } from "react-router-dom";


export default function History() {
  const navigate = useNavigate();
  const [paychecks, setPaychecks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ netPay: '', payPeriodEnd: '' })
  const chartData = [...paychecks].reverse();
  const {user} = useAuth();

  async function fetchPaychecks() {
    const data = await getPaychecks(user.uid);
    setPaychecks(data);
  }

  useEffect(() => {
      fetchPaychecks();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit() {
    await logPaycheck(
      user.uid,
      { netPay: parseFloat(formData.netPay), grossPay: null },
      { payPeriodEnd: formData.payPeriodEnd, hoursWorked: null, hourlyWage: null }
    );
    await fetchPaychecks();
    setShowModal(false);
    setFormData({ netPay: '', payPeriodEnd: '' });
  }

  async function handleDeletePaycheck(e, paycheckId) {
    e.stopPropagation();
    await deletePaycheck(paycheckId);
    await fetchPaychecks();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Add Paycheck</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Pay Period End Date"
                name="payPeriodEnd"
                value={formData.payPeriodEnd}
                onChange={handleChange}
                placeholder="e.g. June 4, 2026"
                type="date" 
              />
              <FormField
                label="Net Pay"
                name="netPay"
                value={formData.netPay}
                onChange={handleChange}
                placeholder="e.g. 833.27"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
              onClick={handleSubmit}
            >
              Log Paycheck
            </button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Paycheck History</h1>
        </header>
        <LineChart width={500} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid stroke="#000000" strokeDasharray="5 5" />
          <XAxis dataKey="date" stroke="#000000" />
          <YAxis dataKey="net_amount" stroke="#000000" />
          <Line
            type="monotone"
            dataKey="net_amount"
            stroke="#6366f1"
            dot={{
              fill: '#000000',
            }}
            activeDot={{
              stroke: '#000000',
            }}
          >
            <LabelList dataKey="net_amount" position="top" />
          </Line>
        </LineChart>
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
        >
          + Add Paycheck
        </button>
        {paychecks.length === 0 ? (
          <p className="text-gray-500 text-sm">No paychecks logged yet.</p>
        ) : (
          <div className="space-y-4">
            {paychecks.map((p) => (
              <div 
                key={p.id} 
                onClick={() => navigate(`/budget/${p.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Pay Period End</p>
                    <p className="font-semibold text-gray-800">{p.pay_period_end}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Net paid</p>
                    <p className="font-semibold text-gray-800">
                      ${p.net_amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeletePaycheck(e, p.id)}
                    className="text-red-400 hover:text-red-600 text-sm ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Small reusable sub-component — lives here since nothing else uses it
function FormField({ label, name, value, onChange, placeholder, type = "number" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...(type === "number" && { min: "0", step: "0.01" })}
        required
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}