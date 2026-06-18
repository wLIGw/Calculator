import "./style.scss";
import Calculator from "../Calculator/Calculator.jsx";
import CalculatorRub from "../CalculatorRub/CalculatorRub.jsx";
import CalculatorKworkPrice from "../CalculatorKwork/CalculatorKwork.jsx";
import CalculatorATM from "../CalculatorEuroBank/CalculatorEuroBank.jsx";

const Main = ({ rates }) => {
  return (
    <main className="main">
      <div className="container">
        <div className="main__wrapper">
          <Calculator rates={rates} />
          <CalculatorKworkPrice rates={rates} />
          <CalculatorRub rates={rates} />
          <CalculatorATM rates={rates} />
        </div>
      </div>
    </main>
  );
};

export default Main;
