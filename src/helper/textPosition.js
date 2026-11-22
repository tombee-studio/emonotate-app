// Positions in a text are counted in characters (code points), which do not
// depend on the size of the screen or the letters.

export function indexText(body) {
  const characters = Array.from(body);
  const units = new Uint32Array(characters.length + 1);
  characters.forEach((character, i) => { units[i + 1] = units[i] + character.length; });
  return { length: characters.length, units };
}

// The character that contains a UTF-16 offset, as the DOM reports it.
export function characterAt({ units, length }, offset) {
  let low = 0;
  let high = length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (units[middle] <= offset) low = middle;
    else high = middle - 1;
  }
  return low;
}

// The first character whose bottom is at or below y. bottomOf grows with the character.
export function characterAtHeight(length, y, bottomOf) {
  let low = 0;
  let high = length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (bottomOf(middle) >= y) high = middle;
    else low = middle + 1;
  }
  return low;
}
