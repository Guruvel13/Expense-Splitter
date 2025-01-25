import React, { useState } from "react";
import "./App.css";

function App() {
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newParticipant, setNewParticipant] = useState("");
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    payer: "",
  });

  // Add Participant
  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant("");
    }
  };

  // Add Expense
  const addExpense = () => {
    const { description, amount, payer } = newExpense;
    if (
      description.trim() &&
      amount > 0 &&
      participants.includes(payer)
    ) {
      setExpenses([
        ...expenses,
        { description, amount: parseFloat(amount), payer },
      ]);
      setNewExpense({ description: "", amount: "", payer: "" });
    }
  };

  // Calculate Balances
  const calculateBalances = () => {
    const balances = Object.fromEntries(
      participants.map((participant) => [participant, 0])
    );

    expenses.forEach(({ amount, payer }) => {
      const splitAmount = amount / participants.length;
      balances[payer] += amount;
      participants.forEach((participant) => {
        if (participant !== payer) {
          balances[participant] -= splitAmount;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  return (
    <div className="app">
      <h1 className="title">Expense Splitter</h1>

      {/* Add Participants */}
      <div className="section">
        <h2>Add Participants</h2>
        <input
          type="text"
          value={newParticipant}
          onChange={(e) => setNewParticipant(e.target.value)}
          placeholder="Enter participant name"
        />
        <button onClick={addParticipant}>Add Participant</button>
      </div>

      {/* Add Expense */}
      <div className="section">
        <h2>Add Expense</h2>
        <input
          type="text"
          value={newExpense.description}
          onChange={(e) =>
            setNewExpense({ ...newExpense, description: e.target.value })
          }
          placeholder="Enter expense description"
        />
        <input
          type="number"
          value={newExpense.amount}
          onChange={(e) =>
            setNewExpense({ ...newExpense, amount: e.target.value })
          }
          placeholder="Enter amount"
        />
        <select
          value={newExpense.payer}
          onChange={(e) =>
            setNewExpense({ ...newExpense, payer: e.target.value })
          }
        >
          <option value="">Select payer</option>
          {participants.map((participant) => (
            <option key={participant} value={participant}>
              {participant}
            </option>
          ))}
        </select>
        <button onClick={addExpense}>Add Expense</button>
      </div>

      {/* Expense List */}
      <div className="section">
        <h2>Expense List</h2>
        {expenses.length === 0 ? (
          <p>No expenses added yet.</p>
        ) : (
          <ul>
            {expenses.map((expense, index) => (
              <li key={index}>
                {expense.description}: ${expense.amount.toFixed(2)} (Paid by{" "}
                {expense.payer})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Split Summary */}
      <div className="section">
        <h2>Split Summary</h2>
        {participants.length === 0 ? (
          <p>No participants added yet.</p>
        ) : (
          <ul>
            {participants.map((participant) => (
              <li key={participant}>
                {balances[participant] > 0
                  ? `${participant} receives $${balances[participant].toFixed(
                      2
                    )}`
                  : balances[participant] < 0
                  ? `${participant} owes $${Math.abs(
                      balances[participant]
                    ).toFixed(2)}`
                  : `${participant} is even`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
