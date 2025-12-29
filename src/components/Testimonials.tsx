import { getTestimonials } from '@/lib/data/testimonials';
import { TestimonialsClient } from './TestimonialsClient';

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  // If no testimonials in DB, use fallback
  if (testimonials.length === 0) {
    const fallbackTestimonials = [
      {
        id: '1',
        name: 'John',
        rating: 5,
        text: "The studio's systematic approach and exceptional organization exceeded my expectations. They were attentive to every detail, ensuring nothing was overlooked. The final result was even better than I imagined, and I couldn't be happier!"
      },
      {
        id: '2',
        name: 'Ahmed',
        rating: 5,
        text: "This team knows how to make things happen! Their organizational skills and methodical approach ensured a smooth process, and their ability to focus on the smallest details brought our project to life in the most incredible way."
      },
    ];
    return <TestimonialsClient testimonials={fallbackTestimonials} />;
  }

  return <TestimonialsClient testimonials={testimonials} />;
}
