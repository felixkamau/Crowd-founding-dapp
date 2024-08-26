const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("CrowdWorks", (m) => {

  const lock = m.contract("CrowdWorks");

  return { lock };
});
