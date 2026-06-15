// src/utils/paycheckMath.js

/**
 * Calculates gross pay based on hours and wage.
 * Overtime kicks in for any hours beyond 40 (California law).
 */
export function calculateGrossPay(hourlyWage, hoursWorked, overtimeMultiplier = 1.5) {
    const regularHours = Math.min(hoursWorked, 40);
    const overtimeHours = Math.max(hoursWorked - 40, 0);
  
    const regularPay = regularHours * hourlyWage;
    const overtimePay = overtimeHours * hourlyWage * overtimeMultiplier;
  
    return regularPay + overtimePay;
  }
  
  /**
   * Approximates federal income tax using 2024 single-filer brackets.
   * This is a simplified marginal rate calculation — not a tax advisor!
   */
  export function calculateFederalTax(annualGross) {
    const brackets = [
      { limit: 11600,  rate: 0.10 },
      { limit: 47150,  rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ];
  
    let tax = 0;
    let previousLimit = 0;
  
    for (const bracket of brackets) {
      if (annualGross <= previousLimit) break;
      const taxableInThisBracket = Math.min(annualGross, bracket.limit) - previousLimit;
      tax += taxableInThisBracket * bracket.rate;
      previousLimit = bracket.limit;
    }
  
    // Return the per-paycheck amount (assuming 26 pay periods/year)
    return tax / 26;
  }
  
  /**
   * California state income tax — single filer, 2024 brackets.
   * CA is one of the highest state tax states, so this matters a lot locally.
   */
  export function calculateCaliforniaStateTax(annualGross) {
    const brackets = [
      { limit: 10412,   rate: 0.01 },
      { limit: 24684,   rate: 0.02 },
      { limit: 38959,   rate: 0.04 },
      { limit: 54081,   rate: 0.06 },
      { limit: 68350,   rate: 0.08 },
      { limit: 349137,  rate: 0.093 },
      { limit: 418961,  rate: 0.103 },
      { limit: 698274,  rate: 0.113 },
      { limit: Infinity, rate: 0.123 },
    ];
  
    let tax = 0;
    let previousLimit = 0;
  
    for (const bracket of brackets) {
      if (annualGross <= previousLimit) break;
      const taxableInThisBracket = Math.min(annualGross, bracket.limit) - previousLimit;
      tax += taxableInThisBracket * bracket.rate;
      previousLimit = bracket.limit;
    }
  
    return tax / 26;
  }
  
  /**
   * FICA taxes — flat rates, no bracket logic needed.
   * Social Security caps at $168,600 annual income (2024).
   */
  export function calculateFICATaxes(annualGross) {
    const SS_WAGE_CAP = 168600;
    const socialSecurityRate = 0.062;
    const medicareRate = 0.0145;
  
    const socialSecurity = (Math.min(annualGross, SS_WAGE_CAP) * socialSecurityRate) / 26;
    const medicare = (annualGross * medicareRate) / 26;
  
    return { socialSecurity, medicare };
  }

  /**
   * SDI taxes — 
   */
  export function calculateSDI(grossPay) {
    return grossPay * 0.009;
  }
  
  /**
   * Master function — runs all calculations and returns a clean summary object.
   * Every component in the app will call THIS, not the individual functions above.
   */
  export function calculatePaycheck({
    hourlyWage,
    hoursWorked,
    overtimeMultiplier = 1.5,
    preTaxDeductions = 0,
    postTaxDeductions = 0,
  }) {
    const grossPay = calculateGrossPay(hourlyWage, hoursWorked, overtimeMultiplier);
    const annualGross = grossPay * 26;
  
    const federalTax = calculateFederalTax(annualGross);
    const stateTax = calculateCaliforniaStateTax(annualGross);
    const { socialSecurity, medicare } = calculateFICATaxes(annualGross);
    const sdi = calculateSDI(grossPay);

    const totalDeductions =
      federalTax + stateTax + socialSecurity + medicare + sdi + preTaxDeductions + postTaxDeductions;
  
    const netPay = grossPay - totalDeductions;
  
    return {
      grossPay,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      sdi,
      preTaxDeductions,
      postTaxDeductions,
      totalDeductions,
      netPay,
    };
  }