const defaultDictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const defaultPadding = '=';

function base64Decode (input, dictionary, padding) {
  if (dictionary === undefined) {
    dictionary = defaultDictionary;
  }

  if (padding === undefined) {
    padding = defaultPadding;
  }

  let bytes = [];
  const split = input.split('');
  for(let i = 0; i < split.length; i += 4) {
    const a = dictionary.indexOf(split[i + 0]);
    const b = dictionary.indexOf(split[i + 1]);
    const c = dictionary.indexOf(split[i + 2]);
    const d = dictionary.indexOf(split[i + 3]);

    if (a === -1 || b === -1) {
      throw new Error('invalid input');
    }

    bytes.push(((a << 2) | (b >> 4)) & 255);

    if (c === -1) {
      break;
    }

    bytes.push(((b << 4) | (c >> 2)) & 255);

    if (d === -1) {
      break;
    }

    bytes.push(((c << 6) | d) & 255);
  };
  return new Uint8Array(bytes);
}
