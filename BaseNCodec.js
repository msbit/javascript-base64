const defaultDictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const defaultPadding = '=';

class BaseNCodec {
  constructor (dictionary, padding) {
    if (dictionary === undefined) {
      dictionary = defaultDictionary;
    }
    this.dictionary = dictionary;

    if (padding === undefined) {
      padding = defaultPadding;
    }
    this.padding = padding;
  }

  decode (input) {
    let bytes = [];
    const split = input.split('');
    for(let i = 0; i < split.length; i += 4) {
      const a = this.dictionary.indexOf(split[i + 0]);
      const b = this.dictionary.indexOf(split[i + 1]);
      const c = this.dictionary.indexOf(split[i + 2]);
      const d = this.dictionary.indexOf(split[i + 3]);

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
}
