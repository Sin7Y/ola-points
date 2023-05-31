import { ethers } from "hardhat";
import XLSX from "xlsx";
import { BigNumber } from "ethers";
import { OlaPoints__factory } from "../types";
import { time } from "node:console";


async function main() {

    const owner = (await ethers.getSigners())[0];
    console.log("Owner:", owner.address);
    // We get the contract to deploy on testnet
    const olaPoints = await OlaPoints__factory.connect("0x67BBb9b28c2794eA81dE46771283643572BcCdE4", owner);

    var workbook = XLSX.readFile('./scripts/May31th_Ola_Points_addresses.xlsx');
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);
    {
        let addresses: string[] = [];
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


        const batchSize = 1000;
        for (let i = 0; i < addresses.length; i += batchSize) {
            // Slice addresses and nums arrays for batch processing
            let batchAddresses = addresses.slice(i, i + batchSize);
            let batchNums = nums.slice(i, i + batchSize);

            // let estimateGas: BigNumber = await olaPoints.estimateGas.batchTransfer(batchAddresses, batchNums);
            // console.log("estimateGas: ", estimateGas.toString());

            const tx = await olaPoints.batchTransfer(batchAddresses, batchNums);
            console.log('tx hash: ', tx.hash);
            const receipt = await tx.wait();

            if (receipt.status) {
                console.log('tx success');
                setTimeout(() => { }, 1000);
            } else {
                throw new Error(`failed to transfer token`);
                // }
            }
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