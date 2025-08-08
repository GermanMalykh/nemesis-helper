import { GameMode } from '@common/enums/game-mode.enum';
import { Player } from '@common/interfaces/player.interface';
import { IsoDateString } from '@common/types/iso-date-string.type';
import { TranslationKey } from '@common/types/translation-key.type';

export type GameKey = keyof GameConfigs;

export interface GameConfig {
    id: GameKey;
    idShort: string;
    path: string;
    nameKey: TranslationKey;
    disabled: boolean;
    imageUrl: string;
}

export interface GameConfigs {
    nemesisOriginal: GameConfig;
}

export const gameConfigs: GameConfigs = Object.freeze({
    nemesisOriginal: Object.freeze({
        id: 'nemesisOriginal',
        idShort: 'nog',
        path: 'nemesis',
        nameKey: 'tk.game.name.nemesis-original',
        imageUrl: 'assets/images/tileNog.jpg',
        disabled: false,
    }),
});

interface GameSetupDataBase {
    players: Player[];
    gameMode: GameMode;
    timerEnabled: boolean;
    monstersDisabled: boolean;
    createdDate: IsoDateString;
}

export interface GameSetupDataOriginal extends GameSetupDataBase {
    gameId: 'nemesisOriginal';
}

export type GameSetupData = GameSetupDataOriginal;
