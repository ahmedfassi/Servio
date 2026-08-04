import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Service {
  readonly name: string;
  readonly kicker: string;
  readonly description: string;
  readonly icon: string;
  readonly position: string;
}

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {
  protected readonly activeService = signal<string | null>(null);
  protected readonly services: readonly Service[] = [
    {
      name: 'Digital menu',
      kicker: 'Always current',
      description: 'Update items, prices and availability instantly—without reprinting a thing.',
      icon: '≡',
      position: 'north',
    },
    {
      name: 'QR ordering',
      kicker: 'Scan to serve',
      description: 'Let guests browse and order from their own device with a frictionless flow.',
      icon: '⌗',
      position: 'north-east',
    },
    {
      name: 'Staff roles',
      kicker: 'Clear ownership',
      description: 'Give every team member the right tools and permissions for their shift.',
      icon: '◎',
      position: 'east',
    },
    {
      name: 'Real-time tracking',
      kicker: 'See every move',
      description: 'Follow orders from table to kitchen to checkout as the service unfolds.',
      icon: '↗',
      position: 'south-east',
    },
    {
      name: 'Electronic payment',
      kicker: 'Secure by design',
      description: 'Accept modern payment methods through a clear, guest-friendly experience.',
      icon: '◇',
      position: 'south',
    },
    {
      name: 'Fast checkout',
      kicker: 'Finish beautifully',
      description: 'Split, settle and close tables in seconds when guests are ready to leave.',
      icon: '→',
      position: 'south-west',
    },
    {
      name: 'Table management',
      kicker: 'Own the floor',
      description: 'Coordinate occupancy, reservations and service status from one live view.',
      icon: '▦',
      position: 'west',
    },
    {
      name: 'Smart analytics',
      kicker: 'Know what works',
      description: 'Turn daily performance into practical insights for sharper decisions.',
      icon: '⌁',
      position: 'north-west',
    },
  ];

  protected toggleService(name: string): void {
    this.activeService.update((active) => (active === name ? null : name));
  }
}
