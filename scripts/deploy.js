async function main() {
   const BA = await ethers.getContractFactory("BA");


   const ba = await BA.deploy();
   console.log("Contract deployed to address:", ba.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


//contract address: 0x7225E3D3E8b13Ca93d6Ab9267646E83D5f5D1bA5