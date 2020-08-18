const BetApp = artifacts.require("./BetApp");

module.exports = (deployer) => {
    deployer.deploy(BetApp);
}