const MarketplaceMigration = artifacts.require("PurchaseMarketplace");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceMigration);
};
