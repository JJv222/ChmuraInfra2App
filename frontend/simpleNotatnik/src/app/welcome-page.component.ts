import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'welcome-page',
  standalone: true, // Potrzebne do linków
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>Witaj w aplikacji Notes!</h1>
    </div>
  `
})
export class WelcomePage {}