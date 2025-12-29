import { notFound } from 'next/navigation'
import { TestimonialForm } from '@/components/dashboard/TestimonialForm'
import { getTestimonialById } from '@/lib/data/testimonials'
import { updateTestimonialAction } from '../actions'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id } = await params
  const testimonial = await getTestimonialById(id)

  if (!testimonial) {
    notFound()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Edit Testimonial</h1>
      </div>

      <div className="card">
        <TestimonialForm testimonial={testimonial} action={updateTestimonialAction} />
      </div>
    </div>
  )
}
