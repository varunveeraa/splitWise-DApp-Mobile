import Web3 from 'web3';

// Use the provider from Metamask
const web3 = new Web3(window.ethereum);

const contractAddress = '0x9abD88de9c5dC73B9948367F85c67c67Ec5dA9Fb';
const contractABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"deployedSplits","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"desc","type":"string"},{"name":"notes","type":"string"},{"name":"dates","type":"string"},{"name":"mediaSource","type":"string"}],"name":"createSplit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDeployedSplits","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"}]  

const contract = new web3.eth.Contract(contractABI, contractAddress);

export { web3, contract };
