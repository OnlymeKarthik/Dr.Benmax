const hre = require("hardhat");

async function main() {
    const ClaimSettlement = await hre.ethers.getContractFactory("ClaimSettlement");
    const claimSettlement = await ClaimSettlement.deploy();

    await claimSettlement.waitForDeployment();

    console.log(
        `ClaimSettlement deployed to ${claimSettlement.target}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
