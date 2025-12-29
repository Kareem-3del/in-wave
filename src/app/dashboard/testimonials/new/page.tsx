import { TestimonialForm } from '@/components/dashboard/TestimonialForm'
import { createTestimonialAction } from '../actions'

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add New Testimonial</h1>
      </div>

      <div className="card">
        <TestimonialForm action={createTestimonialAction} />
      </div>
    </div>
  )
}
