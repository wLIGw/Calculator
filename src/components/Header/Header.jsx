import "./style.scss";
import UpdateRatesButton from "../UpdateRatesButton/UpdateRatesButton";

const Header = ({ onRatesUpdated }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header-title">Calculator</div>
          <UpdateRatesButton onRatesUpdated={onRatesUpdated} />
        </div>
      </div>
    </header>
  );
};

export default Header;