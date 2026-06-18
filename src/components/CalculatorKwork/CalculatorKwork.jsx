import React, { useState, useEffect } from "react";
import "./style.scss";

const CalculatorKworkPrice = ({ rates: ratesProp }) => {
  const [rates, setRates] = useState({
    USD: { buy: 0 },
    EUR: { sell: 0 },
    USD_RUB: { rounded: 0 },
  });
  const [priceRUB, setPriceRUB] = useState(5000);
  const [resultEUR, setResultEUR] = useState(0);

  const KWORK_FEE = 0.2;
  const VISA_PERCENT = 0.03;
  const VISA_FIXED = 1.4;

  // загрузка при старте
  useEffect(() => {
    fetch("/rates.json?ts=" + Date.now())
      .then((res) => res.json())
      .then((data) => setRates(data.rates))
      .catch((err) => console.error(err));
  }, []);

  // обновление от кнопки
  useEffect(() => {
    if (ratesProp) setRates(ratesProp);
  }, [ratesProp]);

  useEffect(() => {
    const usdBuy = Number(rates.USD.buy);
    const eurSell = Number(rates.EUR.sell);
    const rubPerUsd = Number(rates.USD_RUB.rounded);

    if (!priceRUB || !usdBuy || !eurSell || !rubPerUsd) {
      setResultEUR(0);
      return;
    }

    const rubAfterKwork = priceRUB * (1 - KWORK_FEE);
    const usdBeforeVisa = rubAfterKwork / rubPerUsd;
    const usdAfterVisa = usdBeforeVisa * (1 - VISA_PERCENT) - VISA_FIXED;

    if (usdAfterVisa <= 0) {
      setResultEUR(0);
      return;
    }

    const uzs = usdAfterVisa * usdBuy;
    const eur = uzs / eurSell;
    setResultEUR(eur.toFixed(2));
  }, [priceRUB, rates]);

  return (
    <div className="calculator">
      <h2>Kwork Price</h2>
      <div className="amount-block">
        <div className="amount-label">Цена на Kwork (RUB)</div>
        <input
          className="amount-input"
          type="number"
          min="0"
          value={priceRUB}
          onChange={(e) => setPriceRUB(Number(e.target.value))}
        />
      </div>
      <div className="result">
        Вы заработаете (EUR)
        <div className="result-value">{resultEUR}</div>
      </div>
      <div className="rates-info">
        <div className="rates-title">Используемые курсы</div>
        <p>USD → UZS (buy): {rates.USD.buy}</p>
        <p>EUR → UZS (sell): {rates.EUR.sell}</p>
        <p>USD → RUB: {rates.USD_RUB.rounded}</p>
      </div>
    </div>
  );
};

export default CalculatorKworkPrice;