export default async function handler(req, res) {
  try {
    // Парсим Kapitalbank
    const response = await fetch(
      "https://www.kapital24.uz/ru/remote-banking/kapitalbank/",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        },
      }
    );

    const html = await response.text();

    // Парсим HTML через регулярки (без beautifulsoup)
    const rates = {};

    for (const cur of ["USD", "EUR"]) {
      const tbodyRegex = new RegExp(
        `<tbody[^>]*id=["']${cur}["'][^>]*>[\\s\\S]*?</tbody>`,
        "i"
      );
      const tbodyMatch = html.match(tbodyRegex);
      if (!tbodyMatch) continue;

      const rows = tbodyMatch[0].match(/<tr[\s\S]*?<\/tr>/gi);
      if (!rows || rows.length < 2) continue;

      const dataRow = rows[1];
      const cols = dataRow.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (!cols || cols.length < 4) continue;

      const getText = (td) => td.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();

      rates[cur] = {
        buy: getText(cols[2]),
        sell: getText(cols[3]),
        source: "Kapitalbank mobile (kapital24)",
        office: getText(cols[1]),
      };
    }

    if (Object.keys(rates).length === 0) {
      return res.status(500).json({
        status: "error",
        message: "Не удалось найти валюты — структура HTML изменилась",
      });
    }

    // Курс USD/RUB с ЦБ РФ
    const cbrResponse = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
    const cbrData = await cbrResponse.json();
    const usdRubRaw = cbrData.Valute.USD.Value;
    const usdRubRounded = Math.round(usdRubRaw);

    rates["USD_RUB"] = {
      raw: usdRubRaw,
      rounded: usdRubRounded,
      source: "CBR",
    };

    const data = {
      updated_at: new Date().toISOString().slice(0, 16),
      rates,
    };

    return res.status(200).json({
      status: "ok",
      message: "Курсы обновлены!",
      data,
    });

  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: e.message,
    });
  }
}