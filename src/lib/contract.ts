export const CONTRACT_ADDRESS = "0x61e56d103678d0e0e75c86f90Bb9FdF0c5CD65f3";
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_RPC = "https://rpc.sepolia.org";
export const SEPOLIA_RPC_BACKUP = "https://sepolia.gateway.tenderly.co";
export const ETHERSCAN_BASE = "https://sepolia.etherscan.io";

export const CONTRACT_ABI = [
  // Write functions
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }, { internalType: "string", name: "_name", type: "string" }, { internalType: "string", name: "_category", type: "string" }, { internalType: "string", name: "_farmLocation", type: "string" }, { internalType: "string", name: "_certNumber", type: "string" }, { internalType: "string", name: "_imageHash", type: "string" }],
    name: "addProduct", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }, { internalType: "string", name: "_stageName", type: "string" }, { internalType: "string", name: "_location", type: "string" }, { internalType: "string", name: "_handlerName", type: "string" }, { internalType: "string", name: "_description", type: "string" }],
    name: "addStage", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }],
    name: "generateQR", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }, { internalType: "string", name: "_location", type: "string" }, { internalType: "string", name: "_certId", type: "string" }],
    name: "registerFarmer", outputs: [], stateMutability: "nonpayable", type: "function",
  },
  // Read functions
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allFarmers", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allProductIds", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }, { internalType: "uint256", name: "", type: "uint256" }],
    name: "farmerProducts", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "farmers",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "location", type: "string" },
      { internalType: "string", name: "certificationId", type: "string" },
      { internalType: "bool", name: "isVerified", type: "bool" },
      { internalType: "uint256", name: "registeredAt", type: "uint256" },
    ],
    stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_farmer", type: "address" }],
    name: "getFarmerProducts", outputs: [{ internalType: "string[]", name: "", type: "string[]" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }],
    name: "getProduct",
    outputs: [{
      components: [
        { internalType: "string", name: "productId", type: "string" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "category", type: "string" },
        { internalType: "string", name: "farmLocation", type: "string" },
        { internalType: "string", name: "certificationNumber", type: "string" },
        { internalType: "address", name: "farmerAddress", type: "address" },
        { internalType: "string", name: "farmerName", type: "string" },
        { internalType: "uint256", name: "harvestDate", type: "uint256" },
        { internalType: "uint256", name: "registeredAt", type: "uint256" },
        { internalType: "bool", name: "isOrganic", type: "bool" },
        { internalType: "string", name: "imageHash", type: "string" },
      ],
      internalType: "struct OrganicChain.Product", name: "", type: "tuple",
    }],
    stateMutability: "view", type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }],
    name: "getSupplyChain",
    outputs: [{
      components: [
        { internalType: "string", name: "stageName", type: "string" },
        { internalType: "string", name: "location", type: "string" },
        { internalType: "string", name: "handlerName", type: "string" },
        { internalType: "string", name: "description", type: "string" },
        { internalType: "uint256", name: "timestamp", type: "uint256" },
        { internalType: "address", name: "recordedBy", type: "address" },
        { internalType: "bool", name: "isCompleted", type: "bool" },
      ],
      internalType: "struct OrganicChain.SupplyStage[]", name: "", type: "tuple[]",
    }],
    stateMutability: "view", type: "function",
  },
  {
    inputs: [], name: "getTotalFarmers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function",
  },
  {
    inputs: [], name: "getTotalProducts",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function",
  },
  { inputs: [], name: "owner", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" },
  {
    inputs: [{ internalType: "string", name: "_productId", type: "string" }],
    name: "verifyOrganic",
    outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "view", type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "address", name: "farmer", type: "address" }, { indexed: false, internalType: "string", name: "name", type: "string" }, { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }],
    name: "FarmerRegistered", type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "string", name: "productId", type: "string" }, { indexed: false, internalType: "string", name: "name", type: "string" }, { indexed: false, internalType: "address", name: "farmer", type: "address" }, { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }],
    name: "ProductAdded", type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "string", name: "productId", type: "string" }, { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }],
    name: "QRGenerated", type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: "string", name: "productId", type: "string" }, { indexed: false, internalType: "string", name: "stageName", type: "string" }, { indexed: false, internalType: "string", name: "location", type: "string" }, { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" }],
    name: "StageAdded", type: "event",
  },
] as const;
