import React from "react";
import CryptoJS from "crypto-js";

export const encrypt = (url) => {
  let encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(url),
    "hellokitty"
  ).toString();
  return encryptedData;
};

export const decrypt = (data) => {
  let bytes = CryptoJS.AES.decrypt(data, "hellokitty");
  let decryptedData = "";
  try {
    decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    decryptedData = "";
  }

  if (decryptedData !== "") decryptedData = decryptedData.split("/");
  return decryptedData;
};


export const SocketIOToken = (data) => {
  let token = null;
  try {
    token = btoa(JSON.stringify(data));
  } catch (error) {
    token = null;
    console.log("Encryption Error:",error);
  }
  return token;
};