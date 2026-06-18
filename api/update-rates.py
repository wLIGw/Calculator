import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
import pathlib

def handler(request):
    try:
        # --- Парсим Kapitalbank ---
        URL = "https://www.kapital24.uz/ru/remote-banking/kapitalbank/"
        headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        }
        response = requests.get(URL, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        currencies = ["USD", "EUR"]
        rates = {}

        for cur in currencies:
            tbody = soup.find("tbody", id=cur)
            if not tbody:
                continue
            data_row = tbody.find_all("tr")[1]
            cols = data_row.find_all("td")
            currency_code = cols[0].get_text(strip=True)
            office = cols[1].get_text(strip=True)
            buy = cols[2].get_text(strip=True).replace(" ", "")
            sell = cols[3].get_text(strip=True).replace(" ", "")
            rates[currency_code] = {
                "buy": buy,
                "sell": sell,
                "source": "Kapitalbank mobile (kapital24)",
                "office": office
            }

        if not rates:
            return Response(
                json.dumps({"status": "error", "message": "Не удалось найти валюты"}),
                status=500,
                headers={"Content-Type": "application/json"}
            )

        # --- Курс USD/RUB с ЦБ РФ ---
        CBR_URL = "https://www.cbr-xml-daily.ru/daily_json.js"
        cbr_response = requests.get(CBR_URL, timeout=10)
        cbr_response.raise_for_status()
        cbr_data = cbr_response.json()

        usd_rub_raw = Decimal(str(cbr_data["Valute"]["USD"]["Value"]))
        usd_rub_rounded = int(usd_rub_raw.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

        rates["USD_RUB"] = {
            "raw": float(usd_rub_raw),
            "rounded": usd_rub_rounded,
            "source": "CBR"
        }

        # --- Сохраняем rates.json в public/ ---
        output_path = pathlib.Path(__file__).parent.parent / "public" / "rates.json"
        data = {
            "updated_at": datetime.now().isoformat(timespec="minutes"),
            "rates": rates
        }
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        # --- Возвращаем данные сразу в ответе ---
        return Response(
            json.dumps({"status": "ok", "message": "Курсы обновлены!", "data": data},
                       ensure_ascii=False),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        return Response(
            json.dumps({"status": "error", "message": str(e)}),
            status=500,
            headers={"Content-Type": "application/json"}
        )