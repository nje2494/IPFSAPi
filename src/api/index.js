const express = require('express');

const nfts = require('./nfts');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'NFT Resolver V1'
  });
});

router.use('/nft', nfts);

module.exports = router;
