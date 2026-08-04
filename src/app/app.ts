import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  scrollToFeatures(): void {
    document
      .getElementById('features')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}