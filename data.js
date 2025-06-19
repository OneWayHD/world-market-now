// ✅ data.js（3カテゴリ対応：indices / forex / crypto）

const indices = [
  { name: "Dow Jones", baseValue: 34000, flag: "https://flagcdn.com/us.svg" },
  { name: "NASDAQ", baseValue: 13500, flag: "https://flagcdn.com/us.svg" },
  { name: "S&P 500", baseValue: 4300, flag: "https://flagcdn.com/us.svg" },
  { name: "Nikkei 225 (Futures)", baseValue: 39000, flag: "https://flagcdn.com/jp.svg" },
  { name: "DAX (Germany)", baseValue: 16000, flag: "https://flagcdn.com/de.svg" },
  { name: "CAC 40 (France)", baseValue: 7300, flag: "https://flagcdn.com/fr.svg" },
  { name: "FTSE 100 (UK)", baseValue: 7600, flag: "https://flagcdn.com/gb.svg" },
  { name: "Hang Seng", baseValue: 18500, flag: "https://flagcdn.com/hk.svg" },
  { name: "SENSEX (India)", baseValue: 63000, flag: "https://flagcdn.com/in.svg" },
  { name: "KOSPI (Korea)", baseValue: 2550, flag: "https://flagcdn.com/kr.svg" }
];

const forex = [
  { name: "USD/JPY", baseValue: 155.23, flag: "https://flagcdn.com/us.svg" },
  { name: "EUR/USD", baseValue: 1.08, flag: "https://flagcdn.com/eu.svg" },
  { name: "GBP/USD", baseValue: 1.27, flag: "https://flagcdn.com/gb.svg" },
  { name: "AUD/JPY", baseValue: 104.5, flag: "https://flagcdn.com/au.svg" },
  { name: "USD/CHF", baseValue: 0.89, flag: "https://flagcdn.com/ch.svg" },
  { name: "USD/CAD", baseValue: 1.37, flag: "https://flagcdn.com/ca.svg" },
  { name: "NZD/USD", baseValue: 0.61, flag: "https://flagcdn.com/nz.svg" },
  { name: "EUR/GBP", baseValue: 0.86, flag: "https://flagcdn.com/eu.svg" },
  { name: "EUR/JPY", baseValue: 167.41, flag: "https://flagcdn.com/eu.svg" },
  { name: "USD/SGD", baseValue: 1.35, flag: "https://flagcdn.com/sg.svg" }
];

const crypto = [
  { name: "BTC/USD", baseValue: 67000, flag: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=026" },
  { name: "ETH/USD", baseValue: 3500, flag: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=026" },
  { name: "XRP/USD", baseValue: 0.62, flag: "https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=026" },
  { name: "BNB/USD", baseValue: 600, flag: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=026" },
  { name: "SOL/USD", baseValue: 150, flag: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=026" },
  { name: "ADA/USD", baseValue: 0.42, flag: "https://cryptologos.cc/logos/cardano-ada-logo.svg?v=026" },
  { name: "DOGE/USD", baseValue: 0.12, flag: "https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=026" },
  { name: "DOT/USD", baseValue: 6.5, flag: "https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=026" },
  { name: "LTC/USD", baseValue: 75, flag: "https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=026" },
  { name: "AVAX/USD", baseValue: 30, flag: "https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=026" }
];
