/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
/* eslint-disable quotes */
const express = require("express");

const router = express.Router();

const { ethers } = require("ethers");
const axios = require("axios");

const pinataSDK = require('@pinata/sdk');

const pinata = pinataSDK('c17edaf981e8b9b8e3a9', 'ab8c5a58dab5d97a888d8d1f922db6772e7b016ec6aa0217e0b56599c3597a36');

const WEB3_ENDPOINT = "https://cloudflare-eth.com";

const handleError = () => undefined;

const getTokenMetadata = async (address, tokenID) => {
  const abi = ["function tokenURI(uint256 _tokenId) view returns (string URI)"];
  const { JsonRpcProvider } = ethers.providers;
  const provider = new JsonRpcProvider(WEB3_ENDPOINT);
  const contract = new ethers.Contract(address, abi, provider);

  const token = await Promise.all([
    contract.tokenURI(tokenID).catch(handleError),
  ]);

  return token;
};
router.get("/", (req, res) => {
  res.json("Add NFT Information");
});

router.get("/:contract/:token/:chain", (req, res) => {
  var contract = req.params.contract;
  var tokenID = req.params.token;
  var chain = req.params.chain;
  var jsonBuilder = {};
  getTokenMetadata(contract, tokenID).then((token) => {
    console.log(token[0]);
    let uri = token[0].toString();
    if (uri.substring(0, 4) === "ipfs") {
      uri = `https://gateway.pinata.cloud/${uri.substring(6)}`;
    }
    axios.get(uri).then((response) => {
      console.log(response.data);
      pinata.pinJSONToIPFS(response.data, null).then((response2) => {
        res.json(response2);
      });
    });
  });
});

module.exports = router;
