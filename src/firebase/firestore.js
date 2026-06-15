import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./config";

export async function logPaycheck(userId, paycheckResults, meta) {
  const docRef = await addDoc(collection(db, "paychecks"), {
    user_id: userId,
    pay_period_end: meta.payPeriodEnd,
    hours_worked: meta.hoursWorked,
    hourly_wage: meta.hourlyWage,
    gross_amount: paycheckResults.grossPay,
    net_amount: paycheckResults.netPay,
    created_at: serverTimestamp(),
  });

  return docRef.id;
}

export async function getPaychecks(userId) {
    const q = query(
      collection(db, "paychecks"),
      where("user_id", "==", userId),
      orderBy("created_at", "desc")
    );
  
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }