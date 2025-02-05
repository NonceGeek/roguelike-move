import React from 'react';
import useSound from 'use-sound';

import attack from '../../assets/sounds/attack.wav';
import crit from '../../assets/sounds/crit.wav';
import goblinAttack from '../../assets/sounds/goblin_attack.wav';
import goblinDeath from '../../assets/sounds/goblin_death.wav';
import goblinPain from '../../assets/sounds/goblin_pain.wav';
import lootManyBTCs from '../../assets/sounds/lootBigGold.ogg';
import lootBTCs from '../../assets/sounds/lootSmallGold.ogg';
import miss from '../../assets/sounds/miss.wav';
import ratAttack from '../../assets/sounds/rat_attack.ogg';
import ratDeath from '../../assets/sounds/rat_death.ogg';
import ratPain from '../../assets/sounds/rat_pain.ogg';
import stairs from '../../assets/sounds/stairs.ogg';
import { useDetectUserInput } from './useDetectUserInput';

export const SOUNDS = {
  crit,
  attack,
  miss,
  lootBTCs,
  lootManyBTCs,
  stairs,
  ratAttack,
  ratPain,
  ratDeath,
  goblinAttack,
  goblinPain,
  goblinDeath,
};

interface Options {
  sounds: (keyof typeof SOUNDS)[];
  round: number;
}

export const useSoundsManager = ({ sounds, round }: Options): void => {
  const didUserInput = useDetectUserInput();
  // eslint-disable-next-line no-console
  const [playCrit] = useSound(crit);
  const [playAttack] = useSound(attack, { volume: 3 });
  const [playMiss] = useSound(miss, { volume: 0.6 });
  const [playLootBTCs] = useSound(lootBTCs);
  const [playLootManyBTCs] = useSound(lootManyBTCs);
  const [playStairs] = useSound(stairs);
  const [playRatAttack] = useSound(ratAttack, { volume: 0.3 });
  const [playRatPain] = useSound(ratPain, { volume: 0.3 });
  const [playRatDeath] = useSound(ratDeath, { volume: 0.3 });
  const [playGoblinAttack] = useSound(goblinAttack, { volume: 0.3 });
  const [playGoblinPain] = useSound(goblinPain, { volume: 0.3 });
  const [playGoblinDeath] = useSound(goblinDeath, { volume: 0.3 });

  const soundPlayer: { [key: string]: typeof playLootBTCs } = {
    crit: playCrit,
    attack: playAttack,
    miss: playMiss,
    lootBTCs: playLootBTCs,
    lootManyBTCs: playLootManyBTCs,
    stairs: playStairs,
    ratAttack: playRatAttack,
    ratPain: playRatPain,
    ratDeath: playRatDeath,
    goblinAttack: playGoblinAttack,
    goblinPain: playGoblinPain,
    goblinDeath: playGoblinDeath,

    // TODO: Add ghost sounds
    ghostAttack: playGoblinAttack,
    ghostPain: playGoblinAttack,
    ghostDeath: playGoblinAttack,
  };

  React.useEffect(() => {
    if (didUserInput) {
      sounds.forEach((sound) => {
        soundPlayer[sound]();
      });
    }
  }, [didUserInput, round, sounds]);
};
