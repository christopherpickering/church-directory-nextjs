import AuthenticatedLayout from '@/components/AuthLayout'
import ContactForm from '@/components/ContactForm'

export default function ContactPage() {
  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout>
        <ContactForm
          title="Contact Us"
          description="If you have any questions about the church directory or need assistance, please fill out this form."
        />
      </AuthenticatedLayout>
    </div>
  )
}
