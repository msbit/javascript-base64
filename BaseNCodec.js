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

  encode (input) {
    let characters = [];
    for (let i = 0; i < input.length; i += 3) {
      const a = input[i + 0];
      const b = input[i + 1];
      const c = input[i + 2];

      const outputA = (a >> 2) & 63;
      characters.push(this.dictionary[outputA]);

      let outputB = (a << 4) & 63;
      if (b === undefined) {
        characters.push(this.dictionary[outputB]);
        characters.push(this.padding);
        characters.push(this.padding);
        break;
      }
      outputB = outputB | ( b >> 4);
      characters.push(this.dictionary[outputB]);

      let outputC = (b << 2) & 63;
      if (c === undefined) {
        characters.push(this.dictionary[outputC]);
        characters.push(this.padding);
        break;
      }
      outputC = outputC | (c >> 6);
      characters.push(this.dictionary[outputC]);

      const outputD = c & 63;
      characters.push(this.dictionary[outputD]);
    }
    return characters;
  }
}
