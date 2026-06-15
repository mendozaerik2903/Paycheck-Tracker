import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getPaychecks } from "../firebase/firestore";


export default function History() {
    const [paychecks, setPaychecks] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        async function fetchPaychecks() {
            const data = await getPaychecks(user.uid);
            setPaychecks(data);
        }
        fetchPaychecks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <header>
              <h1 className="text-2xl font-bold text-gray-900">Paycheck History</h1>
              <p className="text-sm text-gray-500 mt-1">Your logged paychecks, newest first</p>
            </header>
      
            {paychecks.length === 0 ? (
              <p className="text-gray-500 text-sm">No paychecks logged yet.</p>
            ) : (
              <div className="space-y-4">
                {paychecks.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Pay Period End</p>
                        <p className="font-semibold text-gray-800">{p.pay_period_end}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Gross / Net</p>
                        <p className="font-semibold text-gray-800">
                          ${p.gross_amount.toFixed(2)} / ${p.net_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
}