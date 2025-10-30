const quotes = [
  "항상 기뻐하라. 쉬지 말고 기도하라. 범사에 감사하라. (데살로니가전서 5:16-18)",
  "두려워하지 말라 내가 너와 함께 함이라. (이사야 41:10)",
  "어려움 속에서도 희망을 잃지 마세요.",
  // ... 기타 명언/구절 추가 가능 ...
];

function showQuoteOfTheDay() {
  const idx = new Date().getDate() % quotes.length;
  document.getElementById('quote-of-the-day').textContent = quotes[idx];
}

window.addEventListener('DOMContentLoaded', showQuoteOfTheDay);
