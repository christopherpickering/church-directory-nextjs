import AuthenticatedLayout from '@/components/AuthLayout'
import ContactForm from '@/components/ContactForm'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export default async function ContactPage() {
  const settings = await getSiteSettings()
  return (
    <div className="pt-16 pb-24">
      <AuthenticatedLayout title={settings?.title || 'Address Directory'}>
        <ContactForm
          title="Contact Us"
          description="If you have any questions about the church directory or need assistance, please fill out this form."
        />
      </AuthenticatedLayout>
    </div>
  )
}
