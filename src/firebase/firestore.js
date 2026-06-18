import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        date: new Date(data.pay_period_end.replace(/-/g, "/")).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        ...data,
      };
    });
  }

export async function getPaycheck(id) {
  const docRef = doc(db, "paychecks", id);
  const snapshot = await getDoc(docRef);
  const data = snapshot.data();
  return { id: snapshot.id, ...data };
}

export async function deletePaycheck(paycheckId) {
  const items = await getLineItems(paycheckId);
  for (const item of items) {
    await deleteLineItem(paycheckId, item.id);
  }
  await deleteDoc(doc(db, "paychecks", paycheckId));
}

export async function addLineItem(paycheckId, name, amount, bucket) {
  const docRef = await addDoc(collection(db, "paychecks", paycheckId, "lineItems"), {
    paycheck_id: paycheckId,
    name: name,
    amount: amount,
    bucket: bucket,
    created_at: serverTimestamp(),
  });

  return docRef.id;
}

export async function getLineItems(paycheckId) {
  const q = query(
    collection(db, "paychecks", paycheckId, "lineItems"),
    orderBy("created_at", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    };
  });
}

export async function deleteLineItem(paycheckId, itemId) {
  await deleteDoc(doc(db, "paychecks", paycheckId, "lineItems", itemId));
}

export async function updateBudgetSplit(paycheckId, savePct, needsPct) {
  const userRef = doc(db, "paychecks", paycheckId);

  try {
    await updateDoc(userRef, {
      save_pct: savePct,
      needs_pct: needsPct
    });
  } catch (error) {
    console.error("Error updating document: ", error)
  }
}