import { getServices } from '@/lib/data/services';
import { ContactFormClient } from './ContactFormClient';

export default async function ContactForm() {
  const services = await getServices();

  // If no services in DB, use fallback
  if (services.length === 0) {
    const fallbackServices = [
      { id: '1', name: 'Interior design' },
      { id: '2', name: 'Architectural design' },
      { id: '3', name: "Author's supervision" },
      { id: '4', name: 'Equipment' },
      { id: '5', name: 'Renovation' },
      { id: '6', name: 'Realization' },
    ];
    return <ContactFormClient services={fallbackServices} />;
  }

  return <ContactFormClient services={services} />;
}
