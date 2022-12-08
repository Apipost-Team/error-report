let signed_crc_table = function ():Int32Array|Array<number> {
  var c = 0, table = new Array(256);

  for (var n = 0; n != 256; ++n) {
      c = n;
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      c = ((c & 1) ? (-306674912 ^ (c >>> 1)) : (c >>> 1));
      table[n] = c;
  }

  return typeof Int32Array !== 'undefined' ? new Int32Array(table) : table;
};

let T = signed_crc_table();

let crc32_buf_8 = function (buf:any) {
  var C = -1, L = buf.length - 7;
  for (var i = 0; i < L;) {
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
  }
  while (i < L + 7) C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
  return C ^ -1;
};


export default class CRC32 {

  public static buf(buf:any):number {
      if (buf.length > 10000) return crc32_buf_8(buf);
      var C = -1, L = buf.length - 3;
      for (var i = 0; i < L;) {
          C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
          C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
          C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
          C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      }
      while (i < L + 3) C = (C >>> 8) ^ T[(C ^ buf[i++]) & 0xFF];
      return C ^ -1;
  }

  /**
   * @param string
   * @returns {number}
   */
  public static str(string:string):number {

      var C:number = -1;

      for (var i:number = 0, L:number = string.length, c:any, d:any; i < L;) {
          c = string.charCodeAt(i++);
          if (c < 0x80) {
              C = (C >>> 8) ^ T[(C ^ c) & 0xFF];
          } else if (c < 0x800) {
              C = (C >>> 8) ^ T[(C ^ (192 | ((c >> 6) & 31))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF];
          } else if (c >= 0xD800 && c < 0xE000) {
              c = (c & 1023) + 64;
              d = string.charCodeAt(i++) & 1023;
              C = (C >>> 8) ^ T[(C ^ (240 | ((c >> 8) & 7))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 2) & 63))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | ((d >> 6) & 15) | ((c & 3) << 4))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | (d & 63))) & 0xFF];
          } else {
              C = (C >>> 8) ^ T[(C ^ (224 | ((c >> 12) & 15))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | ((c >> 6) & 63))) & 0xFF];
              C = (C >>> 8) ^ T[(C ^ (128 | (c & 63))) & 0xFF];
          }
      }

      return C ^ -1;
  }
}