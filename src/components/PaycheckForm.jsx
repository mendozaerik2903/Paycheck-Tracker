// src/components/PaycheckForm.jsx

import { useState } from 'react';

const INITIAL_FORM_STATE = {
  hourlyWage: '',
  hoursWorked: '',
  overtimeMultiplier: '1.5',
  preTaxDeductions: '0',
  postTaxDeductions: '0',
  payPeriodEnd: '',
};

export default function PaycheckForm({ onCalculate }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    onCalculate({
      hourlyWage: parseFloat(formData.hourlyWage),
      hoursWorked: parseFloat(formData.hoursWorked),
      overtimeMultiplier: parseFloat(formData.overtimeMultiplier),
      preTaxDeductions: parseFloat(formData.preTaxDeductions),
      postTaxDeductions: parseFloat(formData.postTaxDeductions),
      payPeriodEnd: formData.payPeriodEnd,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Enter Paycheck Details</h2>

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
          label="Hourly Wage ($)"
          name="hourlyWage"
          value={formData.hourlyWage}
          onChange={handleChange}
          placeholder="e.g. 25.00"
        />
        <FormField
          label="Hours Worked"
          name="hoursWorked"
          value={formData.hoursWorked}
          onChange={handleChange}
          placeholder="e.g. 40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Overtime Rate</label>
          <select
            name="overtimeMultiplier"
            value={formData.overtimeMultiplier}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1.5">1.5× (Standard)</option>
            <option value="2">2× (Double Time)</option>
          </select>
        </div>
        <FormField
          label="Pre-Tax Deductions ($)"
          name="preTaxDeductions"
          value={formData.preTaxDeductions}
          onChange={handleChange}
          placeholder="e.g. 200"
        />
        <FormField
          label="Post-Tax Deductions ($)"
          name="postTaxDeductions"
          value={formData.postTaxDeductions}
          onChange={handleChange}
          placeholder="e.g. 50"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200"
      >
        Calculate Paycheck
      </button>
    </form>
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