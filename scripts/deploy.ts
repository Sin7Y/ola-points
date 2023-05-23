import { ethers } from "hardhat";

async function main() {

  const OlaPoints = await ethers.getContractFactory("OlaPoints");
  const olaPoints = await OlaPoints.deploy("Ola Points", "OLAP");

  await olaPoints.deployed();

  console.log(
    `Ola Points with deployed to ${olaPoints.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
