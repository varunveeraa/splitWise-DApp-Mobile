const splitFactoryABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "deployedSplits",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        },
        {
          "name": "desc",
          "type": "string"
        },
        {
          "name": "notes",
          "type": "string"
        },
        {
          "name": "dates",
          "type": "string"
        },
        {
          "name": "mediaSource",
          "type": "string"
        }
      ],
      "name": "createSplit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getDeployedSplits",
      "outputs": [
        {
          "name": "",
          "type": "address[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ]

const projectId = "af21521794137bf96ff2ad602ac95493"

const contractAddress = "0xA4c6b014b43406a06112dC1606E542D806d2F82a"

export { projectId, splitFactoryABI, contractAddress };