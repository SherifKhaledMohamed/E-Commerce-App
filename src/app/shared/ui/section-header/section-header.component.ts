import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-section-header',
  styleUrl: './section-header.component.css',
  templateUrl: './section-header.component.html',
  styles: [`:host { display: block; }`],
})
export class SectionHeaderComponent {}
