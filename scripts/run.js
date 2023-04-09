const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");  // gerar os arquivos em artifacts
    const gameContract = await gameContractFactory.deploy(
        ["Vegeta", "Trunks", "Goku"],  // nomes dos personagens
		[
			"https://gateway.pinata.cloud/ipfs/QmcrpcGCXxoPUiYLcEuvnRnRkvavCjCZMwfDoRyvngY9PY?_gl=1*70m7bo*rs_ga*OTcwM2NkODItYWRmYy00ZDI2LWIwZjEtYjUyZGJhNDI4MGMy*rs_ga_5RMPXG14TE*MTY4MDUzMjY2OC4xLjEuMTY4MDUzMzE1MS41NS4wLjA.",  // imagens dos personagens
			"https://gateway.pinata.cloud/ipfs/QmeHGvAmxLcLzK2zdzgi6S2d3usz1DuWHkbGMAtQ3MkTX5?_gl=1*bzw685*rs_ga*OTcwM2NkODItYWRmYy00ZDI2LWIwZjEtYjUyZGJhNDI4MGMy*rs_ga_5RMPXG14TE*MTY4MDUzMjY2OC4xLjEuMTY4MDUzMzE1MS41NS4wLjA.",
			"https://gateway.pinata.cloud/ipfs/QmNgxo9B5gpGpyXLRduRcP81ZZhJNfva6PnT8apjioWbfd?_gl=1*gdu9sj*rs_ga*OTcwM2NkODItYWRmYy00ZDI2LWIwZjEtYjUyZGJhNDI4MGMy*rs_ga_5RMPXG14TE*MTY4MDUzMjY2OC4xLjEuMTY4MDUzMzE1MS41NS4wLjA.",
		],
    [100, 200, 300], // HP values   
    [100, 50, 25], // Attack damage values
    "Freeza",
    "https://gateway.pinata.cloud/ipfs/QmVuy7KqECTy32QPA2EDzbHBTZPjDs6g75Y464EQ7j5fkS?_gl=1*ax6vad*rs_ga*OTcwM2NkODItYWRmYy00ZDI2LWIwZjEtYjUyZGJhNDI4MGMy*rs_ga_5RMPXG14TE*MTY4MDU0OTQ4MC4yLjAuMTY4MDU0OTQ4MC42MC4wLjA.",
     100000,
     50    

  );
  
 
     
    await gameContract.deployed()  // cria mineradores falcets

    console.log("Contrato implantado no endereço:", gameContract.address);  // mostra o endereço do contrato

    let txn;
    // Só temos 3 personagens.
    // Uma NFT com personagem no index 2 da nossa array.
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    console.log("Done!");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();