import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { InfoTooltipComponent } from '@common/components/general/info-tooltip/info-tooltip.component';
import { GameData } from '@common/components/start-game/select-game/select-game.component';
import { NonFocusableDirective } from '@common/directives/non-focusable.directive';
import { GameMode } from '@common/enums/game-mode.enum';
import { Player } from '@common/interfaces/player.interface';
import { FormValuer } from '@common/types/form-valuer.type';
import { Shuffler } from '@common/utils/shuffler.util';
import { GameKey, GameSetupData } from '@configs/games.config';
import { TranslateModule } from '@ngx-translate/core';
import { filter, Subscription } from 'rxjs';

interface GameSetupForm {
    players: FormArray<FormControl<string>>;
    gameMode: FormControl<GameMode>;
    timerEnabled: FormControl<boolean>;
    monstersDisabled: FormControl<boolean>;
    randomizePlayerNum: FormControl<boolean>;
}

@Component({
    selector: 'app-selected-game-setup',
    standalone: true,
    imports: [MatRadioGroup, MatRadioButton, ReactiveFormsModule, MatCheckbox, TranslateModule, MatFormField, MatInput, MatLabel, MatButton, NonFocusableDirective, InfoTooltipComponent],
    templateUrl: './selected-game-setup.component.html',
    styleUrl: './selected-game-setup.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedGameSetupComponent implements OnInit, OnDestroy {
    @Input({ required: true }) public selectedGame: GameData | undefined;
    @Output() public readonly startGame: EventEmitter<GameSetupData> = new EventEmitter<GameSetupData>();
    @Output() public readonly goBack: EventEmitter<void> = new EventEmitter<void>();

    protected readonly showError: WritableSignal<boolean> = signal(false);
    protected readonly gameMode: typeof GameMode = GameMode;
    protected readonly form: FormGroup<GameSetupForm> = new FormGroup<GameSetupForm>({
        players: new FormArray<FormControl<string>>(
            [new FormControl<string>('', { nonNullable: true }), new FormControl<string>('', { nonNullable: true }), new FormControl<string>('', { nonNullable: true }), new FormControl<string>('', { nonNullable: true }), new FormControl<string>('', { nonNullable: true })],
            { validators: [Validators.required] },
        ),
        gameMode: new FormControl<GameMode>(GameMode.SEMI_COOP, { nonNullable: true }),
        randomizePlayerNum: new FormControl<boolean>(true, { nonNullable: true }),
        timerEnabled: new FormControl<boolean>(false, { nonNullable: true }),
        monstersDisabled: new FormControl<boolean>(false, { nonNullable: true }),
    });
    private readonly subSink: Subscription = new Subscription();
    private readonly gameSetupData: WritableSignal<GameSetupData | null> = signal(null);
    private readonly players: WritableSignal<Player[]> = signal([]);
    private readonly gameId: WritableSignal<string> = signal('nemesisOriginal');

    constructor() {
        this.form = new FormGroup({
            players: new FormArray([]),
            gameId: new FormControl('nemesisOriginal', [Validators.required]),
        });

        this.form.valueChanges.subscribe((value) => {
            if (value?.players) {
                this.players.set(value.players);
            }
        });
    }

    @Input() set data(value: GameData) {
        if (value) {
            this.gameSetupData.set(value.gameSetupData);
            this.players.set(value.players);
            this.gameId.set(value.gameId);

            // Reset form with new data
            const playersArray = this.form.get('players') as FormArray;
            playersArray.clear();

            value.players.forEach((player) => {
                playersArray.push(
                    new FormGroup({
                        name: new FormControl(player.name, [Validators.required]),
                        num: new FormControl(player.num, [Validators.required]),
                    })
                );
            });

            this.form.patchValue({
                gameId: value.gameId,
                players: value.players,
            });
        }
    }

    public ngOnInit(): void {
        this.subSink.add(
            this.form.controls.players.valueChanges.pipe(filter(() => this.showError())).subscribe(() => {
                this.showError.set(false);
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subSink.unsubscribe();
    }

    protected onStartGameClick(): void {
        const formValue: FormValuer<GameSetupForm> = this.form.getRawValue();
        const players: string[] = formValue.players.filter(player => !!player);
        const isEnoughPlayers: boolean = players.length > 0;

        if (isEnoughPlayers) {
            this.startGame.emit(this.generateGameSetupData(formValue, players));
        } else {
            this.showError.set(true);
        }
    }

    protected onGoBackClick(): void {
        this.goBack.emit();
    }

    private generateGameSetupData(formValue: FormValuer<GameSetupForm>, players: string[]): GameSetupData {
        const baseSetupData: Omit<GameSetupData, 'gameId'> = {
            players: this.generatePlayersData(players, formValue.randomizePlayerNum),
            gameMode: formValue.gameMode,
            timerEnabled: formValue.timerEnabled,
            monstersDisabled: formValue.monstersDisabled,
            createdDate: new Date().toISOString(),
        };

        return {
            gameId: 'nemesisOriginal',
            ...baseSetupData,
        };
    }

    private generatePlayersData(playerNames: string[], randomize: boolean): Player[] {
        if (randomize) {
            const playerNumbers: number[] = Shuffler.shuffle(Array.from({ length: playerNames.length }, (_, i) => i + 1));
            return playerNames.map((name, index) => ({
                name,
                timeUsedMs: 0,
                num: playerNumbers[index],
            }));
        }
        return playerNames.map((name, index) => ({
            name,
            timeUsedMs: 0,
            num: index + 1,
        }));
    }
}
