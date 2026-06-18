import React, { useState, useEffect } from "react";
import "./style.scss";

const CalculatorRub = ({ rates: ratesProp }) => {
  const [rates, setRates] = useState({
    EUR: { sell: 0 },
  });
  const [targetEUR, setTargetEUR] = useState(100);
  const [rubToUzs, setRubToUzs] = useState(140);
  const [clientRUB, setClientRUB] = useState(0);

  // загрузка при старте
  useEffect(() => {
    fetch("/rates.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((data) => setRates(data.rates))
      .catch((err) => console.error("Ошибка загрузки курсов:", err));
  }, []);

  // обновление от кнопки
  useEffect(() => {
    if (ratesProp) setRates(ratesProp);
  }, [ratesProp]);

  useEffect(() => {
    const EUR_to_UZS = Number(rates.EUR.sell);
    if (!EUR_to_UZS || !rubToUzs || !targetEUR) {
      setClientRUB(0);
      return;
    }
    const uzs = targetEUR * EUR_to_UZS;
    const rub = uzs / rubToUzs;
    setClientRUB(Math.ceil(rub));
  }, [targetEUR, rubToUzs, rates]);

  return (
    <div className="calculator">
      <h2>T Bank</h2>
      <div className="amount-block">
        <div className="amount-label">Сколько евро вы хотите получить</div>
        <input
          className="amount-input"
          type="number"
          value={targetEUR}
          onChange={(e) => setTargetEUR(Number(e.target.value))}
        />
      </div>
      <div className="amount-block">
        <div className="amount-label">Курс RUB → UZS</div>
        <input
          className="amount-input"
          type="number"
          value={rubToUzs}
          onChange={(e) => setRubToUzs(Number(e.target.value))}
        />
      </div>
      <div className="result">
        Клиент должен заплатить (RUB)
        <div className="result-value">{clientRUB}</div>
      </div>
      <div className="rates-info">
        <div className="rates-title">Используемые курсы</div>
        <p>RUB → UZS (вручную): {rubToUzs}</p>
        <p>UZS → EUR (sell): {rates.EUR.sell}</p>
      </div>
    </div>
  );
};

export default CalculatorRub;