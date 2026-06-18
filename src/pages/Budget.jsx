import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addLineItem, getLineItems, getPaycheck, deleteLineItem, updateBudgetSplit } from "../firebase/firestore";

export default function Budget() {
  const { id } = useParams();
  const [paycheck, setPaycheck] = useState(null);
  const [lineItems, setLineItems] = useState([]);

  const needsSpent = lineItems
  .filter(item => item.bucket === "needs")
  .reduce((sum, item) => sum + parseFloat(item.amount), 0);

const wantsSpent = lineItems
  .filter(item => item.bucket === "wants")
  .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const [save, setSave] = useState(20);
  const [needs, setNeeds] = useState(50);

  const remaining = 100 - Number(save);
  const wants = remaining - Number(needs);

  const saveAmount = (paycheck?.net_amount * Number(save) / 100).toFixed(2);
  const needsAmount = (paycheck?.net_amount * Number(needs) / 100).toFixed(2);
  const wantsAmount = (paycheck?.net_amount * Number(wants) / 100).toFixed(2);

  const [needsName, setNeedsName] = useState('');
  const [needsItemAmount, setNeedsItemAmount] = useState('');
  const [wantsName, setWantsName] = useState('');
  const [wantsItemAmount, setWantsItemAmount] = useState('');

    async function fetchLineItems() {
        const data = await getLineItems(id);
        setLineItems(data);
    }

  useEffect(() => {
    async function fetchPaycheck() {
      const data = await getPaycheck(id);
      setPaycheck(data);
    }
    fetchPaycheck();
    fetchLineItems();
  }, []);

  useEffect(() => {
  if (paycheck) {
    setSave(paycheck.save_pct ?? 20);
    setNeeds(paycheck.needs_pct ?? 50);
  }
}, [paycheck]);

  async function handleAddItem(name, amount, bucket) {
    await addLineItem(id, name, amount, bucket);
    const data = await getLineItems(id);
    setLineItems(data);
    if (bucket == "needs") {
        setNeedsName("");
        setNeedsItemAmount("");
    };
    if (bucket == "wants") {
        setWantsName("");
        setWantsItemAmount("");
    };
    }

  async function handleDeleteItem(paycheckId, itemId) {
    await deleteLineItem(paycheckId, itemId);
    await fetchLineItems();
  }

  if (!paycheck) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <header>
          <p className="text-sm text-gray-500">{paycheck.pay_period_end}</p>
          <h1 className="text-2xl font-bold text-gray-900">${paycheck.net_amount.toFixed(2)}</h1>
        </header>

        {/* Save Row */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-gray-600">Save</p>
            <p className="text-sm font-bold text-green-600">{save}% · ${saveAmount}</p>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={save}
            onChange={(e) => {
                setSave(e.target.value);
                updateBudgetSplit(id, e.target.value, needs)
            }}
            className="w-full accent-green-500"
          />
        </div>

        {/* Needs / Wants Slider */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-blue-600">Needs {needs}% · ${needsAmount}</p>
            <p className="text-sm font-bold text-purple-600">Wants {wants}% · ${wantsAmount}</p>
          </div>
          <input
            type="range"
            min="0"
            max={remaining}
            value={needs}
            onChange={(e) => {
                setNeeds(e.target.value);
                updateBudgetSplit(id, save, e.target.value);
            }}
            className="w-full accent-blue-500"
          />
        </div>

        {/* Needs / Wants Lists */}
        <div className="grid grid-cols-2 gap-4">
            {/* Needs List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-600">Needs</p>
                <p className="text-xs text-gray-500">
                    ${needsSpent.toFixed(2)} spent of ${needsAmount}
                </p>
                <p className="text-xs text-gray-500">
                    ${(needsAmount-needsSpent).toFixed(2)}
                </p>
                <input
                    type="text"
                    placeholder="Item name"
                    value={needsName}
                    onChange={(e) => setNeedsName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={needsItemAmount}
                    onChange={(e) => setNeedsItemAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                    onClick={() => handleAddItem(needsName, parseFloat(needsItemAmount), "needs")}
                    className="w-full bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700"
                >
                    Add
                </button>
                {lineItems.filter(item => item.bucket === "needs").map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name}</span>
                        <span>${parseFloat(item.amount).toFixed(2)}</span>
                        <button
                            onClick={() => handleDeleteItem(id, item.id)}
                            className="text-red-400 hover:text-red-600 text-sm ml-4"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

          {/* Wants List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-600">Wants</p>
                <p className="text-xs text-gray-500">
                    ${wantsSpent.toFixed(2)} spent of ${wantsAmount}
                </p>
                <p className="text-xs text-gray-500">
                    ${(wantsAmount-wantsSpent).toFixed(2)}
                </p>
                <input
                    type="text"
                    placeholder="Item name"
                    value={wantsName}
                    onChange={(e) => setWantsName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={wantsItemAmount}
                    onChange={(e) => setWantsItemAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
                <button
                    onClick={() => handleAddItem(wantsName, parseFloat(wantsItemAmount), "wants")}
                    className="w-full bg-blue-600 text-white text-sm py-1.5 rounded-lg hover:bg-blue-700"
                >
                    Add
                </button>
                {lineItems.filter(item => item.bucket === "wants").map(item => (
                    <div key={item.id} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name}</span>
                        <span>${parseFloat(item.amount).toFixed(2)}</span>
                        <button
                            onClick={() => handleDeleteItem(id, item.id)}
                            className="text-red-400 hover:text-red-600 text-sm ml-4"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

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