var AssetContract = artifacts.require("./AssetContract.sol");

module.exports = function(deployer) {
  deployer.deploy(AssetContract, ['m00001','m00002','m00003','m00004','m00005','m00006'],[222,333,444,555,666,777], {gas: 6700000});
};