import hre from "hardhat";


// verify contracts on etherscan
async function main(): Promise<void> {


    await hre.run("verify:verify", {
        address: "0x67BBb9b28c2794eA81dE46771283643572BcCdE4",
        constructorArguments: [
            "Ola-Vm Points",
            "OVP"
        ],
    });

}

main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
