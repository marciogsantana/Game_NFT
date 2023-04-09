const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");  // gerar os arquivos em artifacts
  const gameContract = await gameContractFactory.deploy(
      ["Vegeta", "Trunks", "Goku"],  // nomes dos personagens
  [
    "https://tinyurl.com/2p84zf6e",  // imagens dos personagens
    "https://tinyurl.com/2p8jbveb",
    "https://tinyurl.com/rhk2f9hs",
  ],
  [100, 200, 300], // HP values   
  [100, 50, 25], // Attack damage values
  "Freeza",
  "https://tinyurl.com/3uj4jb6t",
   100000,
   50    

);


   
  await gameContract.deployed()  // cria mineradores falcets

  console.log("Contrato implantado no endereço:", gameContract.address);  // mostra o endereço do contrato



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