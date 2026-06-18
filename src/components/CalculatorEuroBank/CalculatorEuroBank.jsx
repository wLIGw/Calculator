import React, { useState, useEffect } from "react";
import "./style.scss";

const CalculatorATM = () => {
  const [balance, setBalance] = useState(250);
  const [withdraw, setWithdraw] = useState(0);
  const [fee, setFee] = useState(0);

  const FIXED = 1.8;
  const PERCENT = 0.02;
  const STEP = 5; // шаг банкомата

  useEffect(() => {
    if (!balance || balance <= FIXED) {
      setWithdraw(0);
      setFee(0);
      return;
    }

    // 1️⃣ максимум
    const raw = (balance - FIXED) / (1 + PERCENT);

    // 2️⃣ округление вниз (ВАЖНО)
    const rounded = Math.floor(raw / STEP) * STEP;

    // 3️⃣ реальная комиссия
    const realFee = FIXED + rounded * PERCENT;

    setWithdraw(rounded.toFixed(2));
    setFee(realFee.toFixed(2));
  }, [balance]);

  return (
    <div className="calculator">
      <h2>ATM</h2>

      <div className="amount-block">
        <div className="amount-label">
          Баланс (EUR)
        </div>

        <input
          className="amount-input"
          type="number"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
        />
      </div>

      <div className="result">
        Можно снять
        <div className="result-value">{withdraw} €</div>
      </div>

      <div className="result">
        Комиссия
        <div className="result-value">{fee} €</div>
      </div>
    </div>
  );
};

export default CalculatorATM;