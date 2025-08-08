import { Injectable, Signal } from '@angular/core';
import { gameSavedLogText, Logger, LogItem } from '@common/classes/logger.class';
import { Autodestruction } from '@common/interfaces/autodestruction.interface';
import { MonsterDevelopmentResult } from '@common/interfaces/monster-development-result.interface';
import { MonsterTokenBase } from '@common/interfaces/monster-token-base.interface';

@Injectable()
export class NemesisOriginalLoggerService {
    public readonly logs: Signal<LogItem[]>;
    private readonly logger: Logger = new Logger();

    public constructor() {
        this.logs = this.logger.logs;
    }

    public init(logs: LogItem[], roundNumFn: () => number): void {
        this.logger.init(logs, roundNumFn);
    }

    public logMonsterDevelopment(developmentResult: MonsterDevelopmentResult<MonsterTokenBase>): void {
        this.logger.addRecord(
            `Развитие монстра: ${developmentResult.success ? 'успех' : 'неудача'} (${developmentResult.token.id})`,
            'monster',
        );
    }

    public logMonsterEncounter(monster: MonsterTokenBase): void {
        this.logger.addRecord(`Встреча с монстром (${monster.id})`, 'monster');
    }

    public logMonsterAdd(monster: MonsterTokenBase): void {
        this.logger.addRecord(`Появление монстра (${monster.id})`, 'monster');
    }

    public logMonsterKill(monster: MonsterTokenBase): void {
        this.logger.addRecord(`Монстр уничтожен (${monster.id})`, 'monster');
    }

    public logMonsterRetreat(monster: MonsterTokenBase): void {
        this.logger.addRecord(`Монстр отступил (${monster.id})`, 'monster');
    }

    public logAutodestructionStateChange(
        stateFrom: Autodestruction['state'] | undefined,
        stateTo: Autodestruction['state'] | undefined,
    ): void {
        this.logger.addRecord(
            `Самоуничтожение: смена состояния (${stateFrom || 'выключено'} => ${stateTo || 'выключено'})`,
            'tracker',
        );
    }

    public logRoundChange(nextRoundNum: number): void {
        this.logger.addRecord(`Смена раунда (${this.logger.getRoundNum()} => ${nextRoundNum})`, 'event');
    }

    public logSaveGameState(): void {
        this.logger.addRecord(gameSavedLogText, 'event');
    }

    public logAutodestructionStateInevitable(): void {
        this.logger.addRecord('Самоуничтожение: стадия НЕИЗБЕЖНА!', 'event');
    }
}
