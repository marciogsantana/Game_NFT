import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";

/*
 * Passamos os metadados do nosso personagem NFT para que podemos ter um card legal na nossa UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // estado
  const [gameContract, setGameContract] = useState(null);

  /*
  * Estado que vai segurar os metadados do boss
  */
const [boss, setBoss] = useState(null);

/*
 * Vamos usar isso para adicionar algumas animações durante ataques
 */

const [attackState, setAttackState] = useState("");

// acão de ataques
const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Atacando o boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
      }
    } catch (error) {
      console.error("Erro atacando o boss:", error);
      setAttackState("");
    }
  };

// UseEffects
useEffect(() => {
    /*
     * Configurando função async que vai pegar o bosso do nosso contrato e setar ele no estado
     */
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log("Boss:", bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };
  
    /*
        * Configura a lógica quando esse evento for disparado
        */
    const onAttackComplete = (newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Atualiza o hp do boss e do player
        */
        setBoss((prevState) => {
            return { ...prevState, hp: bossHp };
        });

        setCharacterNFT((prevState) => {
            return { ...prevState, hp: playerHp };
        });
    };

    if (gameContract) {
        fetchBoss();
        gameContract.on('AttackComplete', onAttackComplete);
    }

    /*
    * Tem certeza de limpar esse evento quando componente for removido
    */
    return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }
}, [gameContract]);


  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);  // executa um nodo para interagir com a rede
      const signer = provider.getSigner();  // pega as autorização para alterar o estado da rede
      const gameContract = new ethers.Contract(  // interage com o contrato
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Objeto Ethereum não encontrado");
    }
  }, []);

  return (
    <div className="arena-container">
      {/* Boss */}
      {boss && (
        <div className="boss-container">
            {/* Adicionando attackState para o className! São só nomes de classe */}
            <div className={`boss-content ${attackState}`}>
            <h2>🔥 {boss.name} 🔥</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Atacar ${boss.name}`}
            </button>
          </div>
        </div>
      )}
  
      {/* Troque a UI de personagem por isso */}
      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Seu Personagem</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Dano de Ataque: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;