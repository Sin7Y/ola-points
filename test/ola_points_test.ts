import { ethers } from "hardhat";
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const OlaPoints = await ethers.getContractFactory("OlaPoints");
    const [owner, other] = await ethers.getSigners();

    const olaPoints = await OlaPoints.deploy("Ola Points", "OLAP");

    await olaPoints.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { OlaPoints, olaPoints, owner, other };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { olaPoints, owner } = await loadFixture(deployTokenFixture);

    const ownerBalance = await olaPoints.balanceOf(owner.address);
    expect(await olaPoints.totalSupply()).to.equal(ownerBalance);
  });

  it("owner should be deployer", async function () {
    const { olaPoints, owner, other } = await loadFixture(
      deployTokenFixture
    );

    expect(await olaPoints.owner()).to.eq(owner.address);
  });

  it("owner transfer", async function () {
    const { olaPoints, owner, other } = await loadFixture(
      deployTokenFixture
    );

    await olaPoints.connect(owner).transfer(other.address, 1);
    expect(await olaPoints.balanceOf(other.address)).to.eq(1);
  });

  it("ormal user transfer", async function () {
    const { olaPoints, owner, other } = await loadFixture(
      deployTokenFixture
    );
    await expect(olaPoints.connect(other).transfer(other.address, 1)).to.be.revertedWith("Transfers are disabled.");
    await olaPoints.connect(owner).enableTransfers();
    expect(await olaPoints.transfersEnabled()).to.eq(true);
    await olaPoints.connect(owner).mint(other.address, 100);
    expect(await olaPoints.balanceOf(other.address)).to.eq(100);
    await olaPoints.connect(other).transfer(owner.address, 5);
    expect(await olaPoints.balanceOf(other.address)).to.eq(95);
  });
});

