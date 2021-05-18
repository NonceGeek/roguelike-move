import { INITIAL_MAX_HP } from '../constants/config';
import { CreatureEntity } from '../constants/creatures';
import { ItemType } from '../constants/items';
import { ActiveConditions } from '../typings/activeConditions';
import { CellData } from '../typings/cell';
import { GameStatus } from '../typings/gameStatus';
import { MoveDirection } from '../typings/moveDirection';
import { Position } from '../typings/position';
import { HoverCellPayload, reduceHoverCell } from './reduceHoverCell';
import { reduceInitCreatures } from './reduceInitCreatures';
import { reduceMovePlayer } from './reduceMovePlayer';
import { reduceUpdateCell, UpdateCellPayload } from './reduceUpdateCell';
import { updateVisibility } from './updateVisibility';

// ACTIONS

export type GameAction =
  | { type: '@@GAME/MOVE_PLAYER'; direction: MoveDirection }
  | { type: '@@GAME/SET_CURRENT_MAP'; currentMap: CellData[][] }
  | { type: '@@GAME/SET_SEED'; seed: string }
  | { type: '@@GAME/INIT_PLAYER_SPAWN'; playerSpawn: Position }
  | { type: '@@GAME/UPDATE_CELL'; payload: UpdateCellPayload }
  | { type: '@@GAME/INIT_VISIBILITY' }
  | { type: '@@GAME/INIT_CREATURES' }
  | { type: '@@GAME/HOVER_CELL'; payload: HoverCellPayload }
  | { type: '@@GAME/HOVER_AWAY_FROM_CELL' };

const movePlayer = (direction: MoveDirection): GameAction => ({
  type: '@@GAME/MOVE_PLAYER',
  direction,
});

const setCurrentMap = (currentMap: CellData[][]): GameAction => ({
  type: '@@GAME/SET_CURRENT_MAP',
  currentMap,
});

const setSeed = (seed: string): GameAction => ({
  type: '@@GAME/SET_SEED',
  seed,
});

const initPlayerSpawn = (playerSpawn: Position): GameAction => ({
  type: '@@GAME/INIT_PLAYER_SPAWN',
  playerSpawn,
});

const updateCell = (payload: UpdateCellPayload): GameAction => ({
  type: '@@GAME/UPDATE_CELL',
  payload,
});

const initVisibility = (): GameAction => ({
  type: '@@GAME/INIT_VISIBILITY',
});

const initCreatures = (): GameAction => ({
  type: '@@GAME/INIT_CREATURES',
});

const hoverCell = (payload: HoverCellPayload): GameAction => ({
  type: '@@GAME/HOVER_CELL',
  payload,
});

const hoverAwayFromCell = (): GameAction => ({
  type: '@@GAME/HOVER_AWAY_FROM_CELL',
});

export const gameActions = {
  movePlayer,
  setCurrentMap,
  setSeed,
  initPlayerSpawn,
  updateCell,
  initVisibility,
  initCreatures,
  hoverCell,
  hoverAwayFromCell,
};

// INITIAL_STATE

export interface GameState {
  currentMap: CellData[][] | null;
  seed: string;
  gameStatus: GameStatus;
  moveDirection: MoveDirection;
  playerPosition: Position;
  characterName: string;
  hp: number;
  maxHp: number;
  gold: number;
  equipedItems: ItemType[];
  inventory: ItemType[];
  interactionText: string;
  eventLogs: string[];
  playerConditions: ActiveConditions;
  creatures: { [id: string]: CreatureEntity };
}

export const INITIAL_STATE: GameState = {
  currentMap: null,
  seed: '',
  gameStatus: 'playing',
  moveDirection: 'Right',
  playerPosition: [0, 0],
  characterName: 'Kerhebos',
  hp: INITIAL_MAX_HP,
  maxHp: INITIAL_MAX_HP,
  gold: 0,
  equipedItems: [],
  inventory: [],
  interactionText: 'You enter the dungeon.',
  eventLogs: [],
  playerConditions: {},
  creatures: {},
};

// REDUCER

export const game = (draft = INITIAL_STATE, action: GameAction): GameState | void => {
  switch (action.type) {
    case '@@GAME/MOVE_PLAYER':
      return reduceMovePlayer(draft, action.direction);
    case '@@GAME/SET_CURRENT_MAP':
      return void (draft.currentMap = action.currentMap);
    case '@@GAME/SET_SEED':
      return void (draft.seed = action.seed);
    case '@@GAME/INIT_PLAYER_SPAWN':
      return void (draft.playerPosition = action.playerSpawn);
    case '@@GAME/UPDATE_CELL':
      return reduceUpdateCell(draft, action.payload);
    case '@@GAME/INIT_VISIBILITY':
      if (draft.currentMap !== null) {
        return void (draft.currentMap = updateVisibility(draft.playerPosition, draft.currentMap));
      }
      break;
    case '@@GAME/INIT_CREATURES':
      return reduceInitCreatures(draft);
    case '@@GAME/HOVER_CELL':
      return reduceHoverCell(draft, action.payload);
    case '@@GAME/HOVER_AWAY_FROM_CELL':
      return void (draft.interactionText = '');
  }
};
