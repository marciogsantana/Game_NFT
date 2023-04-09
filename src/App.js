/*
 * Nós vamos precisar usar estados agora! Não esqueça de importar useState
 */
import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter";
import Arena from './Components/Arena';
import LoadingIndicator from "./Components/LoadingIndicator";
import myEpicGame from "./utils/MyEpicGame.json";  // json que conecta o front ao contrato na blockchain
import { ethers } from "ethers"; // interage com a blockchain 
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants"  // para pegar as informações do contrato
                                                                        // para interagir com o front

// Constantes
const TWITTER_HANDLE = "MarcioGomesde10";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Só uma variável de estado que vamos usar para armazenar a carteira pública do usuário.
   */
  const [currentAccount, setCurrentAccount] = useState(null);

  /*
 * Logo abaixo da conta, configure essa propriedade de novo estado.
 */
const [characterNFT, setCharacterNFT] = useState(null);

// variavel de estado para carregamento
const [isLoading, setIsLoading] = useState(false);

  /*
   * Já que esse método vai levar um tempo, lembre-se de declará-lo como async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Eu acho que você não tem a metamask!");
        /*
       * Nós configuramos o isLoading aqui porque usamos o return na proxima linha
       */
      setIsLoading(false);
        return;
      } else {
        console.log("Nós temos o objeto ethereum", ethereum);

        /*
         * Checa se estamos autorizados a acessar a carteira do usuário.
         */
        const accounts = await ethereum.request({ method: "eth_accounts" });

        /*
         * Usuário pode ter múltiplas contas autorizadas, pegamos a primeira se estiver ali!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Carteira conectada::", account);
          setCurrentAccount(account);
        } else {
          console.log("Não encontramos uma carteira conectada");
        }
      }
    } catch (error) {
      console.log(error);
    }
     /*
   * Nós lançamos a propriedade de estado depois de toda lógica da função
   */
  setIsLoading(false);
  };

  /*
   * Implementa o seu método connectWallet aqui
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Instale a MetaMask!");
        return;
      }

      /*
       * Método chique para pedir acesso para a conta.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! Isso deve escrever o endereço público uma vez que autorizarmos Metamask.
       */
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    // verificando se estamos na rede Goerli testes
    const checkNetwork = async () => {
      try {
        if (window.ethereum.networkVersion !== "5") {
          alert("Please connect to Goerli!");
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  // UseEffects
useEffect(() => {
  /*
   * Quando nosso componente for montado, tenha certeza de configurar o estado de carregamento
   */
  setIsLoading(true);
  checkIfWalletIsConnected();
}, []);

  
useEffect(() => {
  /*
   * A função que vamos chamar que interage com nosso contrato inteligente
   */
  const fetchNFTMetadata = async () => {
    console.log("Verificando pelo personagem NFT no endereço:", currentAccount);
    
    // provider busca as informações da blockchain e um no que conecta aos outros nos
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // recebe permissão para assinar mudanças de estado na rede
    const signer = provider.getSigner();
    // gameContract recebe as tres informações para integarir com a blockchai
    // 1- endereço do contrato
    // 2- arquivos ABI
    // 3- singer (autorização)
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    // verifica na blockchin se a carterira conectada 
    // tem um NFT,  verifica pelo nome 
    // esta buscando a função checkIfUserHasNFT do contrato MyEpicGame.sol
    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log("Usuário tem um personagem NFT")
      setCharacterNFT(transformCharacterData(characterNFT))
    } else {
      console.log("Nenhum personagem NFT foi encontrado")
    }

    /*
     * Uma vez que tivermos acabado a busca, configure o estado de carregamento para falso.
     */
    setIsLoading(false);
  };

  /*
   * Nós so queremos rodar isso se tivermos uma wallet conectada
   */

  if (currentAccount) {
    console.log("Conta Atual:", currentAccount) // pega chave publica altera a pagina sempre que o endereço é alterado
    fetchNFTMetadata();
  }
}, [currentAccount]);

  
  // Métodos de renderização
const renderContent = () => {
  /*
   * Se esse app estiver carregando, renderize o indicador de carregamento
   */
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          //src="https://thumbs.gfycat.com/AnchoredPleasedBergerpicard-size_restricted.gif"
          src="https://www.picgifs.com/movies-and-series/series/dragon-ball-z/picgifs-dragon-ball-z-0089173.gif"
          //alt="Nascimento Gif"
          alt="Dragon Ball Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Conecte sua carteira para começar
        </button>
      </div>
    );
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
	/*
	* Se tiver uma carteira conectada e um personagem NFT, é hora de batalhar!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
  }
};

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Batalhas no Metaverso ⚔️</p>
          <p className="sub-text">Junte os amigos e proteja o Metaverso!!</p>
          {/*
         * Aqui é onde nosso botão e código de imagem ficava! Lembre-se que movemos para o método de renderização.
         */}
        {renderContent()}
         
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;