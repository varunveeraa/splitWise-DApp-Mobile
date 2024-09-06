import AsyncStorage from "@react-native-async-storage/async-storage";

let authToken: boolean = false;
let walletAddress: string = "";

function getToken() {
  return authToken;
}
  
function updateToken(val: boolean) {
  authToken = val;
}

function getWallAdd () {
  return walletAddress;
}

function updateWalletAdd (val: string) {
  walletAddress = val;
}

export { getToken, updateToken, getWallAdd, updateWalletAdd };