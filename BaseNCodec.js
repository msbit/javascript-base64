const defaultDictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const defaultPadding = '=';

class BaseNCodec {
  constructor (dictionary, padding) {
    if (dictionary === undefined) {
      dictionary = defaultDictionary;
    }
    this.dictionary = dictionary;

    this.decodedSymbolWidth = 8;
    this.encodedSymbolWidth = Math.log2(this.dictionary.length);

    if (this.encodedSymbolWidth % 1 !== 0) {
      throw new Error('invalid dictionary length');
    }

    [this.decodedStride, this.encodedStride] = this.setStrides(this.decodedSymbolWidth, this.encodedSymbolWidth);

    if (padding === undefined) {
      padding = defaultPadding;
    }
    this.padding = padding;
  }

  setStrides (decodedSymbolWidth, encodedSymbolWidth) {
    let decodedLength = decodedSymbolWidth;
    let decodedStride = 1;
    let encodedLength = encodedSymbolWidth;
    let encodedStride = 1;

    while (decodedLength !== encodedLength) {
      if (decodedLength < encodedLength) {
        decodedLength += decodedSymbolWidth;
        decodedStride += 1;
      } else {
        encodedLength += encodedSymbolWidth;
        encodedStride += 1;
      }
    }

    return [decodedStride, encodedStride];
  }

  decode (input) {
    let bytes = [];
    const split = input.split('');
    const mask = Math.pow(2, this.decodedSymbolWidth) - 1;

    for (let i = 0; i < split.length; i += this.encodedStride) {
      for (let j = 1; j < this.encodedStride; j++) {
        const previousBits = j * (this.encodedSymbolWidth / this.decodedStride);
        const currentBits = this.encodedSymbolWidth - previousBits;
        const previous = this.dictionary.indexOf(split[i + (j - 1)]);
        const current = this.dictionary.indexOf(split[i + j]);
        if (current === -1) {
          if (j * this.encodedSymbolWidth < this.decodedSymbolWidth) {
            throw new Error('invalid input');
          }
          break;
        }
        bytes.push(((previous << previousBits) | (current >> currentBits)) & mask);
      }
    };

    return new Uint8Array(bytes);
  }

  encode (input) {
    let characters = [];

    for (let i = 0; i < input.length; i += this.decodedStride) {
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

    return characters.join('');
  }
}
