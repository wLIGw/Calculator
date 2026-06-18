import React, { useState, useEffect } from "react";
import "./style.scss";

const Calculator = ({ rates: ratesProp }) => {
  const [rates, setRates] = useState({
    USD: { buy: 0 },
    EUR: { sell: 0 },
    USD_RUB: { raw: 0, rounded: 0 },
  });
  const [targetEUR, setTargetEUR] = useState(100);
  const [clientRUB, setClientRUB] = useState(0);

  const KWORK_FEE = 0.2;
  const VISA_PERCENT = 0.03;
  const VISA_FIXED = 1.4;

  const roundUp = (value) => {
    const step = value < 5000 ? 50 : 100;
    return Math.ceil(value / step) * step;
  };

  // загрузка при старте
  useEffect(() => {
    fetch("/rates.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((data) => setRates(data.rates))
      .catch((e) => console.error("Ошибка загрузки курсов", e));
  }, []);

  // обновление от кнопки
  useEffect(() => {
    if (ratesProp) setRates(ratesProp);
  }, [ratesProp]);

  useEffect(() => {
    const usdBuy = Number(rates.USD.buy);
    const eurSell = Number(rates.EUR.sell);
    const rubPerUsd = Number(rates.USD_RUB.rounded);

    if (!usdBuy || !eurSell || !rubPerUsd || !targetEUR) {
      setClientRUB(0);
      return;
    }

    const uzsNeeded = targetEUR * eurSell;
    const usdAfterVisa = uzsNeeded / usdBuy;
    const usdBeforeVisa = (usdAfterVisa + VISA_FIXED) / (1 - VISA_PERCENT);
    const rubBeforeKwork = usdBeforeVisa * rubPerUsd;
    const rubFinal = rubBeforeKwork / (1 - KWORK_FEE);
    setClientRUB(roundUp(rubFinal));
  }, [targetEUR, rates]);

  return (
    <div className="calculator">
      <h2>Kwork</h2>
      <div className="amount-block">
        <div className="amount-label">Сколько евро вы хотите получить</div>
        <input
          className="amount-input"
          type="number"
          min="1"
          value={targetEUR}
          onChange={(e) => setTargetEUR(Number(e.target.value))}
        />
      </div>
      <div className="result">
        Клиент должен заплатить (RUB)
        <div className="result-value">{clientRUB}</div>
      </div>
      <div className="rates-info">
        <div className="rates-title">Используемые курсы</div>
        <p>USD → UZS (buy): {rates.USD.buy}</p>
        <p>UZS → EUR (sell): {rates.EUR.sell}</p>
        <p>USD → RUB (raw): {rates.USD_RUB.raw}</p>
        <p>USD → RUB (округлённый): {rates.USD_RUB.rounded}</p>
      </div>
    </div>
  );
};

export default Calculator;