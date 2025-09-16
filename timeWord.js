/**
 * timeWord(timeStr) -> string
 * Convert "HH:MM" 24h time to words.
 *
 * Rules:
 * - 00:00 => "midnight"
 * - 12:00 => "noon"
 * - Hours 0-11 are "am"; 12-23 are "pm"
 * - For minutes 00 => "o’clock"
 * - For 01-09 => "oh <n>"
 * - Use standard English words for 0..59
 */

function timeWord(timeStr) {
    const [hh, mm] = timeStr.split(":").map((s) => parseInt(s, 10));

  // special cases
  if (hh === 0 && mm === 0) return "midnight";
  if (hh === 12 && mm === 0) return "noon";

  const isPM = hh >= 12;
  const hour12 = ((hh + 11) % 12) + 1; // 0->12, 13->1 etc.

  const numWords = [
    "zero","one","two","three","four","five","six","seven","eight","nine",
    "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen",
    "eighteen","nineteen"
  ];
  const tensWords = ["","ten","twenty","thirty","forty","fifty"];

  function sayNumber(n){
    if (n < 20) return numWords[n];
    const tens = Math.floor(n/10);
    const ones = n % 10;
    return ones ? `${tensWords[tens]} ${numWords[ones]}` : tensWords[tens];
  }

  const hourWord = numWords[hour12];

  let minuteWord;
  if (mm === 0) {
    minuteWord = "o’clock";
  } else if (mm < 10) {
    minuteWord = `oh ${numWords[mm]}`;
  } else {
    minuteWord = sayNumber(mm);
  }

  const suffix = isPM ? "pm" : "am";
  return `${hourWord} ${minuteWord} ${suffix}`.trim();
}

module.exports = timeWord;