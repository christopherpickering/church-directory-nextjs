import ContactForm from '@/components/ContactForm'
import DashboardLayout from '@/components/DashboardLayout'

export default function ContactPage() {
  return (
    <div className="pt-16 pb-24">
      <DashboardLayout>
        <ContactForm
          title="Contact Us"
          description="If you have any questions about the church directory or need assistance, please fill out this form."
        />
      </DashboardLayout>
    </div>
  )
}
