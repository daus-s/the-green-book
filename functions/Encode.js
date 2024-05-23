function createEncoding() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
  
    const base = characters.length;
  
    function encode(number) {
      let encodedString = '';
      while (number > 0) {
        const remainder = number % base;
        encodedString = characters[remainder] + encodedString;
        number = Math.floor(number / base);
      }
      return encodedString || characters[0];
    }
  
    function decode(encodedString) {
      let decodedNumber = 0;
      for (let i = 0; i < encodedString.length; i++) {
        const char = encodedString.charAt(i);
        const value = characters.indexOf(char);
        decodedNumber = decodedNumber * base + value;
      }
      return decodedNumber;
    }
  
    return { encode, decode };
}
  
  // Example usage:
const { encode, decode } = createEncoding();
module.exports = {encode, decode};
/* 
const integerToEncode = 123456789;
const encodedString = encode(integerToEncode);
console.log('Encoded:', encodedString);

const decodedInteger = decode(encodedString);
console.log('Decoded:', decodedInteger); 
*/