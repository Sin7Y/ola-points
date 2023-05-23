import { ethers } from "hardhat";
import XLSX from "xlsx";
import { BigNumber } from "ethers";
import { OlaPoints__factory } from "../types";


async function main() {

    const owner = (await ethers.getSigners())[0];
    console.log("Owner:", owner.address);
    // We get the contract to deploy on testnet
    const olaPoints = await OlaPoints__factory.connect("0x67BBb9b28c2794eA81dE46771283643572BcCdE4", owner);

    var workbook = XLSX.readFile('./scripts/points-2023-05-26.xlsx');
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);
    {
        let addresses: string[] = [];
        // define Auction and presale tokenID
        let nums: BigNumber[] = [];
        sheet_name_list.forEach(function (name) { /* iterate through sheets */
            let worksheet = workbook.Sheets[name];
            for (let key in worksheet) {
                if (key[0] === '!') continue;
                if (key.startsWith("A")) {
                    addresses.push(worksheet[key].v);
                } else {
                    nums.push(ethers.utils.parseEther(worksheet[key].v.toString()));
                }
            }
        });
        console.log(addresses);
        console.log(nums);

        const tx = await olaPoints.batchTransfer(addresses, nums);
        console.log('tx hash: ', tx.hash);
        const receipt = await tx.wait();

        if (receipt.status) {
            console.log('tx success');
            for (let i = 0; i < receipt.logs.length; i++) {
                console.log("transferd token", BigNumber.from(receipt.logs[i].topics[3]).toNumber());
            }
        } else {
            throw new Error(`failed to transfer token`);
        }
    }


}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });