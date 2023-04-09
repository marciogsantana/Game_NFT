const CONTRACT_ADDRESS = "0x10963B25ac71e717479bE494eEc5e91864Fe487a";

/*
 * Adicione esse método e tenha certeza de exportá-lo no final!
 */
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };