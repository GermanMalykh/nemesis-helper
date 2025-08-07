import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslationGroup } from '@common/interfaces/translation-group.interface';
import { GameIdTkPipe } from '@common/pipes/game-id-tk/game-id-tk.pipe';
import { GameKey } from '@configs/games.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { signal, WritableSignal, computed, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

export interface FaqModalData {
    gameId: GameKey;
    faqGroups: TranslationGroup[];
}

@Component({
    selector: 'app-faq-modal',
    standalone: true,
    imports: [TranslateModule, GameIdTkPipe, FormsModule, ReactiveFormsModule, MatFormField, MatInput, MatLabel],
    templateUrl: './faq-modal.component.html',
    styleUrl: './faq-modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqModalComponent {
    protected readonly data: FaqModalData = inject(MAT_DIALOG_DATA);
    protected searchControl: FormControl<string> = new FormControl('', { nonNullable: true });
    protected readonly originalData: TranslationGroup[] = this.data.faqGroups;
    protected readonly filteredGroups: WritableSignal<TranslationGroup[]> = signal(this.originalData);
    private readonly translate = inject(TranslateService);

    protected scrollInto(index: number): void {
        document.querySelector(`#group${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
    public constructor() {
        this.searchControl.valueChanges.pipe(debounceTime(200)).subscribe((search) => {
            const query = search.toLowerCase().trim();
            const result = this.originalData
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) => {
                        const translated = this.translate.instant(item);
                        return query === '' || translated.toLowerCase().includes(query);
                    }),
                }))
                .filter((group) => group.items.length > 0);
            this.filteredGroups.set(result);
        });
    }
}
