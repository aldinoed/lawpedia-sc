// Firebase imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

// Angular imports
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';

// App imports
import { AppRoutingModule } from './app.routes';

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        CommonModule,
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideAnalytics(() => getAnalytics()),
        // provideAppCheck(() => initializeAppCheck(getAppCheckOptions(), getCustomProviderFactories())),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        provideFunctions(() => getFunctions()),
        provideMessaging(() => getMessaging()),
        providePerformance(() => getPerformance()),
        provideStorage(() => getStorage()),
        provideRemoteConfig(() => getRemoteConfig()),
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [ScreenTrackingService, UserTrackingService]
})

export class AppModule { }