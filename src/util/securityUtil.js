import { SECURITY } from '../constant';
import rs from 'jsrsasign';
import * as timestamp from 'unix-timestamp';
import * as CryptoJS from 'crypto-js';

export const createToken = (expiresIn, payload, prvKeyHex) => {
  const now = timestamp.now();

  const content = expiresIn ? {
    iat: now,
    exp: timestamp.add(now, expiresIn),
    data: payload,
  } : {
    data: payload,
  };

  const header = { alg: SECURITY.ALGO, typ: 'JWT' };
  const sHeader = JSON.stringify(header);
  const sContent = JSON.stringify(content);

  // create ECDSA key object with Hex input
  const prvKey = new rs.KJUR.crypto.ECDSA({ curve: SECURITY.CURVE });
  prvKey.setPrivateKeyHex(prvKeyHex);
  prvKey.isPrivate = true;
  prvKey.isPublic = false;

  // sometimes for some reason the errors below occur randomly, so try a few times before giving up
  // unknown ECDSA sig r length error
  // unknown ECDSA sig s length error
  let token;
  for (let i = 0; i < 5; i += 1) {
    try {
      token = rs.jws.JWS.sign(null, sHeader, sContent, prvKey);
      break;
    } catch (error) {
      if (i === 4) {
        const customError = new Error(error);
        customError.attempts = i;
        throw customError;
      }
    }
  }
  return token;
};

export const verify = (token, pubhex) => {
  // verify JWT
  const options = { alg: [SECURITY.ALGO] };
  const pubKey = new rs.KJUR.crypto.ECDSA({ curve: SECURITY.CURVE });
  pubKey.setPublicKeyHex(pubhex);
  pubKey.isPrivate = false;
  pubKey.isPublic = true;

  return rs.jws.JWS.verify(token, pubKey, options);
};

export const encrypt = (msg, key) => {
  // convert to word array so AES treats this as a key and not a passphrase
  const bytesKey = CryptoJS.enc.Hex.parse(key);

  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  // The default output format is CryptoJS.format.OpenSSL,
  // but this only transports the salt.
  const encrypted = CryptoJS.AES.encrypt(msg, bytesKey, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,

  });

  // append iv - 32 bytes in hex
  let cipherText = '';

  cipherText += iv.toString() + encrypted.toString();

  return cipherText;
};

export const decrypt = (txMessage, key) => {
  const ivStart = 0;
  const msgStart = 32;

  // convert to word array so aes treats this as a key and not a passphrase
  const bytesKey = CryptoJS.enc.Hex.parse(key);

  const iv = CryptoJS.enc.Hex.parse(txMessage.substr(ivStart, msgStart));
  const encrypted = txMessage.substring(msgStart);

  const decrypted = CryptoJS.AES.decrypt(encrypted, bytesKey, {
    iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const generateKeyPair = () => {
  const prvKey = new rs.KJUR.crypto.ECDSA({ curve: SECURITY.CURVE });
  prvKey.isPrivate = true;
  prvKey.isPublic = false;
  const {
    ecprvhex: privateKey,
    ecpubhex: publicKey,
  } = prvKey.generateKeyPairHex();
  return { privateKey, publicKey };
};

export const verifySuperIdExt = (body, ext, clientAccessSecret) => {
  const bodyStr = JSON.stringify(body);
  const hmacBuffer = CryptoJS.HmacSHA256(bodyStr, clientAccessSecret);
  return ext === CryptoJS.enc.Base64.stringify(hmacBuffer);
};
