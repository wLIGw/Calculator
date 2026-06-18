import { useState } from "react";
import "./style.scss";

const UpdateRatesButton = ({ onRatesUpdated }) => {
  const [status, setStatus] = useState("idle");

  const handleClick = async () => {
    try {
      setStatus("loading");
      const res = await fetch("/api/update-rates");
      const json = await res.json();

      if (res.ok && json.status === "ok") {
        onRatesUpdated(json.data.rates); // передаём свежие курсы наверх
        setStatus("success");
        setTimeout(() => setStatus("idle"), 1500);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2000);
      }
    } catch (err) {
      console.error("Ошибка при обновлении курсов:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const buttonText = {
    idle: "Обновить курсы",
    loading: "Обновление...",
    success: "Курсы обновлены",
    error: "Сервер не активен",
  };

  return (
    <button
      className={`update-button ${status}`}
      onClick={handleClick}
      disabled={status === "loading"}
    >
      {status === "loading" && <span className="spinner" />}
      {buttonText[status]}
    </button>
  );
};

export default UpdateRatesButton;