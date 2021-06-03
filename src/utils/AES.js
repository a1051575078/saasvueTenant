/*
* 账号加密
*/
import CryptoJS from 'crypto-js';
const AES_KEY = "nishiwodebabyabc"; //16位
const AES_IV = "1234567890123456";  //16位
export default {
    encrypt(text){
        if(typeof(text)==="number"){
            text=text+'';
        }
        var encrypted = CryptoJS.AES.encrypt(
            text,
            CryptoJS.enc.Utf8.parse(AES_KEY),
            {iv:  CryptoJS.enc.Utf8.parse(AES_IV)});
        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },
    decrypt(text){
        var decrypted = CryptoJS.AES.decrypt(
            text,
            CryptoJS.enc.Utf8.parse(AES_KEY),
            {iv: CryptoJS.enc.Utf8.parse(AES_IV)});
        return decrypted.toString(CryptoJS.enc.Utf8);
    },
}