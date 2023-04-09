import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";

/*
 * .
 */
const SelectCharacter = ({ setCharacterNFT }) => {

  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  /*
 * Nova propriedade de estado para mintar o NFT
 */
const [mintingCharacter, setMintingCharacter] = useState(false);



    // UseEffect
useEffect(() => {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);  // chama nodo para interagir com a blockchain
    const signer = provider.getSigner();  // pede autorização para alterar o estado da blockcahain
    const gameContract = new ethers.Contract(   // conecta o contrato no front
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    /*
     * Essa é a grande diferença. Configura nosso gameContract no estado.
     */
    setGameContract(gameContract);
  } else {
    console.log("Objeto Ethereum não encontrado");
  }
}, []);

/*

Nós temos essa função async chamada getCharacters que usa o nosso gameContract 
para chamar nossa função getAllDefaultCharacters que escrevemos anteriormente no contrato
Nós então mapeamos o que é retornado para nós para transformar os dados em uma maneira que
nossa UI possa entender facilmente.
Depois, nós podemos configurar esses dados no nosso estado para começar a usá-los
Finalmente, toda vez que gameContract muda nós queremos ter certeza que não é null,
então envolvemos a nossa chamada de função em um teste rápido.

*/

useEffect(() => {
  const getCharacters = async () => {
    try {
      console.log("Trazendo personagens do contrato para mintar");

      const charactersTxn = await gameContract.getAllDefaultCharacters();
      console.log("charactersTxn:", charactersTxn);

      const characters = charactersTxn.map((characterData) =>
        transformCharacterData(characterData)
      );

      setCharacters(characters);
    } catch (error) {
      console.error("Algo deu errado ao trazer personagens:", error);
    }
  };

  /*
   * Adiciona um método callback que vai disparar quando o evento for recebido
    Esse método é chamado toda vez que uma nova NFT é mintada. 
    Ela simplesmente escreve os dados para ter certeza que as coisas estão funcionando
    e depois nós precisamos pegar os metadados atuais da nossa recém mintada personagem NFT! 
    

Tudo que estamos fazendo é chamar a função checkIfUserHasNFT que vai retornar todos os nossos metadados!
Nesse ponto, podemos transformar os dados configurados no nosso estado.
 Uma vez que ele estiver configurado, vamos ser transportados para o componente Arena 
 (logo que configurarmos ele, claro).
   */
  const onCharacterMint = async (sender, tokenId, characterIndex) => {
    console.log(
      `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
    );

    /*
     * Uma vez que nosso personagem for mintado, podemos buscar os metadados a partir do nosso contrato e configurar no estado para se mover para a Arena.
     */
    if (gameContract) {
      const characterNFT = await gameContract.checkIfUserHasNFT();
      console.log("CharacterNFT: ", characterNFT);
      setCharacterNFT(transformCharacterData(characterNFT));
    }
  };

  if (gameContract) {
    getCharacters();

    /*
     * Configurar NFT Minted Listener
       usa o  objeto gameContract para ouvir o disparo de CharacterNFTMinted a partir
       do nosso contrato inteligente. Nossa UI vai então rodar a lógica em onCharacterMint!
     */
    gameContract.on("CharacterNFTMinted", onCharacterMint);
  }

  return () => {
    /*
     * Quando seu componente se desmonta, vamos limpar esse listener
     */
    if (gameContract) {
      gameContract.off("CharacterNFTMinted", onCharacterMint);
    }
  };
}, [gameContract]);

// Actions
// chama a função mintCharacterNFT do contrato
const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      /*
       * Mostre nosso indicador de carregamento
       */
      setMintingCharacter(true);
      console.log("Mintando personagem...");
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log("mintTxn:", mintTxn);
      /*
       * Esconde nosso indicador de carregamento quando o mint for terminado
       */
      setMintingCharacter(false);
      
    }
  } catch (error) {
    console.warn("MintCharacterAction Error:", error);

    setMintingCharacter(false);
  }
};

// Métodos de renderização
const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
         onClick={mintCharacterNFTAction(index)} 
         >{`Mintar ${character.name}`}</button>
    </div>
  ));
  

  return (
    <div className="select-character-container">
    <h2>Minte seu Herói. Escolha com sabedoria.</h2>
    {/* Só mostra isso se tiver personagens no estado
     */}
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
  </div>
  );
};



export default SelectCharacter;