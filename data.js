// ✅ data.js（3カテゴリ対応：indices / forex / crypto）

const indices = [
  { name: "Dow Jones", symbol: "DJI", baseValue: 34000, flag: "https://flagcdn.com/us.svg" },
  { name: "NASDAQ", symbol: "IXIC", baseValue: 13500, flag: "https://flagcdn.com/us.svg" },
  { name: "S&P 500", symbol: "SPX", baseValue: 4300, flag: "https://flagcdn.com/us.svg" },
  { name: "Nikkei 225 (Futures)", symbol: "NI225", baseValue: 39000, flag: "https://flagcdn.com/jp.svg" },
  { name: "DAX (Germany)", symbol: "DAX", baseValue: 16000, flag: "https://flagcdn.com/de.svg" },
  { name: "CAC 40 (France)", symbol: "CAC40", baseValue: 7300, flag: "https://flagcdn.com/fr.svg" },
  { name: "FTSE 100 (UK)", symbol: "FTSE", baseValue: 7600, flag: "https://flagcdn.com/gb.svg" },
  { name: "Hang Seng", symbol: "HSI", baseValue: 18500, flag: "https://flagcdn.com/hk.svg" },
  { name: "SENSEX (India)", symbol: "SENSEX", baseValue: 63000, flag: "https://flagcdn.com/in.svg" },
  { name: "KOSPI (Korea)", symbol: "KOSPI", baseValue: 2550, flag: "https://flagcdn.com/kr.svg" }
];

const forex = [
  { name: "USD/JPY", symbol: "USDJPY", baseValue: 155.23, flag: "https://flagcdn.com/us.svg" },
  { name: "EUR/USD", symbol: "EURUSD", baseValue: 1.08, flag: "https://flagcdn.com/eu.svg" },
  { name: "GBP/USD", symbol: "GBPUSD", baseValue: 1.27, flag: "https://flagcdn.com/gb.svg" },
  { name: "AUD/JPY", symbol: "AUDJPY", baseValue: 104.5, flag: "https://flagcdn.com/au.svg" },
  { name: "USD/CHF", symbol: "USDCHF", baseValue: 0.89, flag: "https://flagcdn.com/ch.svg" },
  { name: "USD/CAD", symbol: "USDCAD", baseValue: 1.37, flag: "https://flagcdn.com/ca.svg" },
  { name: "NZD/USD", symbol: "NZDUSD", baseValue: 0.61, flag: "https://flagcdn.com/nz.svg" },
  { name: "EUR/GBP", symbol: "EURGBP", baseValue: 0.86, flag: "https://flagcdn.com/eu.svg" },
  { name: "EUR/JPY", symbol: "EURJPY", baseValue: 167.41, flag: "https://flagcdn.com/eu.svg" },
  { name: "USD/SGD", symbol: "USDSGD", baseValue: 1.35, flag: "https://flagcdn.com/sg.svg" }
];

const crypto = [
  { name: "BTC/USD", symbol: "BTCUSD", baseValue: 67000, flag: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026" },
  { name: "ETH/USD", symbol: "ETHUSD", baseValue: 3500, flag: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026" },
  { name: "XRP/USD", symbol: "XRPUSD", baseValue: 0.62, flag: "https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=026" },
  { name: "BNB/USD", symbol: "BNBUSD", baseValue: 600, flag: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=026" },
  { name: "SOL/USD", symbol: "SOLUSD", baseValue: 150, flag: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=026" },
  { name: "ADA/USD", symbol: "ADAUSD", baseValue: 0.42, flag: "https://cryptologos.cc/logos/cardano-ada-logo.svg?v=026" },
  { name: "DOGE/USD", symbol: "DOGEUSD", baseValue: 0.12, flag: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=026" },
  { name: "DOT/USD", symbol: "DOTUSD", baseValue: 6.5, flag: "https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=026" },
  { name: "LTC/USD", symbol: "LTCUSD", baseValue: 75, flag: "https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=026" },
  { name: "AVAX/USD", symbol: "AVAXUSD", baseValue: 30, flag: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=026" }
];
