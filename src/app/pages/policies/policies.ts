import { afterNextRender, Component, HostListener, signal } from '@angular/core';

interface PolicySection {
  readonly id: string;
  readonly number: string;
  readonly title: string;
  readonly summary: string;
  readonly paragraphs: readonly string[];
  readonly bullets: readonly string[];
}

@Component({
  selector: 'app-policies',
  imports: [],
  templateUrl: './policies.html',
  styleUrl: './policies.css',
})
export class Policies {
  protected readonly readingProgress = signal(0);
  protected readonly openSections = signal<readonly string[]>(['privacy']);
  protected readonly sections: readonly PolicySection[] = [
    {
      id: 'privacy',
      number: '01',
      title: 'Privacy Policy',
      summary: 'How we collect, use and respect information across the Serv.io platform.',
      paragraphs: [
        'Serv.io processes information needed to provide restaurant and café management services. This may include account details, venue information, transaction records, device data and support conversations supplied by users or generated through normal platform use.',
        'We use this information to operate and improve the platform, authenticate users, deliver support, protect accounts, meet legal obligations and communicate important service updates. We do not sell personal information.',
      ],
      bullets: [
        'Account and business contact information',
        'Operational activity, orders and payment references',
        'Technical, security and support information',
      ],
    },
    {
      id: 'terms',
      number: '02',
      title: 'Terms and Conditions',
      summary: 'The fair-use terms that keep Serv.io reliable for every hospitality team.',
      paragraphs: [
        'By accessing Serv.io, users agree to provide accurate registration information, protect their account information and use the platform only for lawful business activity. Access is granted as a limited, non-transferable right for the subscribed venue or organisation.',
        'Platform availability may occasionally be affected by planned maintenance, urgent security work or circumstances outside reasonable control. We aim to communicate material interruptions and restore service promptly.',
      ],
      bullets: [
        'Do not attempt to bypass platform security or access controls',
        'Keep venue, billing and authorised-user details current',
        'Respect intellectual property and applicable local laws',
      ],
    },
    {
      id: 'cookies',
      number: '03',
      title: 'Cookie Policy',
      summary: 'A clear view of the small files that help Serv.io remain secure and useful.',
      paragraphs: [
        'Serv.io uses essential cookies and similar browser storage to maintain sessions, remember preferences, prevent fraud and understand basic platform performance. Essential cookies are required for signed-in features to work correctly.',
        'Where optional analytics are used, users will be given appropriate choices. Browser settings can also block or remove cookies, although doing so may affect secure sessions and saved preferences.',
      ],
      bullets: [
        'Essential storage for secure platform sessions',
        'Preference storage for a consistent experience',
        'Optional, consent-based performance measurement',
      ],
    },
    {
      id: 'payments',
      number: '04',
      title: 'Payment and Refund Policy',
      summary: 'How subscriptions, payment services and eligible refunds are handled.',
      paragraphs: [
        'Subscription charges are presented before purchase and billed according to the selected plan. Taxes, transaction fees or third-party payment costs may apply where disclosed. Venue operators remain responsible for reviewing guest transactions and payout details.',
        'Refund requests are assessed against the subscribed plan, the reason for the request and applicable consumer law. Approved refunds are returned through the original payment method; bank processing time may vary.',
      ],
      bullets: [
        'Report incorrect charges promptly with the relevant reference',
        'Guest refunds follow the venue’s own published terms',
        'Chargebacks may require supporting transaction records',
      ],
    },
    {
      id: 'protection',
      number: '05',
      title: 'Data Protection',
      summary: 'The safeguards and practices used to protect operational and personal data.',
      paragraphs: [
        'We apply proportionate technical and organisational controls designed to protect data from unauthorised access, alteration, loss or disclosure. These include access controls, role separation, monitored infrastructure and secure transmission practices.',
        'Data is retained only as long as needed for service delivery, legitimate business purposes and legal requirements. Depending on location and applicable law, individuals may have rights to access, correct, export, restrict or delete their personal data.',
      ],
      bullets: [
        'Role-based access for authorised team members',
        'Documented incident response and recovery practices',
        'Vendor assessment for relevant service providers',
      ],
    },
    {
      id: 'responsibilities',
      number: '06',
      title: 'User Responsibilities',
      summary: 'Simple responsibilities that protect guests, teams and the wider platform.',
      paragraphs: [
        'Account owners control who can access their Serv.io workspace and which permissions each person receives. They should review access regularly, remove former staff promptly and make sure shared devices are properly secured.',
        'Users are responsible for the accuracy and legality of menu content, prices, tax settings, customer notices and operational data entered into the platform. Suspected misuse or security incidents should be reported without delay.',
      ],
      bullets: [
        'Protect account details and private access information',
        'Assign only the permissions each staff member needs',
        'Maintain lawful menus, notices and customer communications',
      ],
    },
  ];

  constructor() {
    afterNextRender(() => this.updateReadingProgress());
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  protected updateReadingProgress(): void {
    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    this.readingProgress.set(Math.min(100, Math.max(0, progress)));
  }

  protected isOpen(id: string): boolean {
    return this.openSections().includes(id);
  }

  protected toggleSection(id: string): void {
    this.openSections.update((open) =>
      open.includes(id) ? open.filter((sectionId) => sectionId !== id) : [...open, id],
    );
  }

  protected openSection(id: string): void {
    if (!this.isOpen(id)) {
      this.openSections.update((open) => [...open, id]);
    }
  }
}
