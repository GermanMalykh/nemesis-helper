import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localePL from '@angular/common/locales/pl';
import localeRU from '@angular/common/locales/ru';
import { inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { Translations } from '@common/interfaces/translations.interface';
import { GlobalLoaderService } from '@common/services/global-loader/global-loader.service';
import { LanguageCode } from '@common/types/language-code.type';
import { StorageManager } from '@common/utils/storage-manager.util';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {

    public readonly currentLanguage: Signal<LanguageCode>;
    private readonly currentLanguageWritable: WritableSignal<LanguageCode>;
    private readonly httpClient: HttpClient = inject(HttpClient);
    private readonly translateService: TranslateService = inject(TranslateService);
    private readonly globalLoader: GlobalLoaderService = inject(GlobalLoaderService);
    private readonly loadedLanguages: Record<LanguageCode, boolean> = {
        en: false,
        pl: false,
        ru: false,
    };

    public constructor() {
        registerLocaleData(localePL);
        registerLocaleData(localeRU);
        const defaultLang: LanguageCode = StorageManager.loadConfig()?.language || this.translateService.getDefaultLang() as LanguageCode;
        this.currentLanguageWritable = signal(defaultLang);
        this.currentLanguage = this.currentLanguageWritable.asReadonly();
        this.translateService.addLangs(['en', 'pl', 'ru']);
    }

    public initTranslations(): Observable<void> {
        return this.changeLanguage(this.currentLanguageWritable());
    }

    public toggleLanguage(): Observable<LanguageCode> {
        const languages: LanguageCode[] = ['en', 'pl', 'ru'];
        const currentIndex = languages.indexOf(this.currentLanguageWritable());
        const nextIndex = (currentIndex + 1) % languages.length;
        return this.changeLanguage(languages[nextIndex]).pipe(map(() => languages[nextIndex]));
    }

    public changeLanguage(languageCode: LanguageCode): Observable<void> {
        this.globalLoader.isLoading.set(true);
        return this.loadTranslations(languageCode).pipe(
            tap(() => {
                this.translateService.use(languageCode);
                this.currentLanguageWritable.set(languageCode);
                StorageManager.saveConfig({ language: languageCode });
                this.globalLoader.isLoading.set(false);
            }),
            catchError(err => {
                this.globalLoader.isLoading.set(false);
                return throwError(() => err);
            }),
        );
    }

    private loadTranslations(languageCode: LanguageCode): Observable<void> {
        const isLanguageLoaded: boolean = this.loadedLanguages[languageCode];
        return isLanguageLoaded ? of(undefined) : this.httpClient.get<Translations>(`assets/i18n/${ languageCode }.json`).pipe(
            tap(translations => {
                this.translateService.setTranslation(languageCode, translations);
                this.loadedLanguages[languageCode] = true;
            }),
            map(() => undefined),
        );
    }
}
