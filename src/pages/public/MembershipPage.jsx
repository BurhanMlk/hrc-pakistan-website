import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Input, Select, Textarea, Button } from '../../components/ui/index.jsx';
import FileUpload from '../../components/ui/FileUpload.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { MEMBER_TYPES } from '../../config/constants.js';
import { workAreas } from '../../config/navigation.js';

export default function MembershipPage() {
  const toast = useToast();
  const { settings } = useSettings();
  const payment = settings.payment || {};
  const [photo, setPhoto] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    if (!paymentProof) {
      toast.error('Please upload a payment screenshot.');
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (Array.isArray(v)) v.forEach((item) => formData.append(k, item));
      else if (v !== undefined && v !== null && v !== '') formData.append(k, v);
    });
    if (photo) formData.append('photo', photo);
    if (paymentProof) formData.append('paymentScreenshot', paymentProof);
    try {
      const res = await publicApi.submitMember(formData);
      toast.success(res.message || 'Application submitted.');
      reset();
      setPhoto(null);
      setPaymentProof(null);
    } catch (err) {
      toast.error(getApiError(err, 'Application failed.'));
    }
  };

  return (
    <>
      <PageHeader title="Become a Member" description="Join a community committed to protecting and promoting human rights." eyebrow="Get Involved" breadcrumbs={[{ label: 'Get Involved' }, { label: 'Membership' }]} />
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 sm:p-8" noValidate>
              <h2 className="text-xl font-bold text-navy-900">Membership Application</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full Name *" placeholder="Your full name" error={errors.fullName?.message} {...register('fullName', { required: 'Full name is required.' })} />
                <Input label="Email *" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email', { required: 'Email is required.' })} />
                <Input label="Phone *" placeholder="03XX-XXXXXXX" error={errors.phone?.message} {...register('phone', { required: 'Phone is required.' })} />
                <Input label="City" placeholder="City" {...register('city')} />
                <Input label="Profession" placeholder="Your profession" {...register('profession')} />
                <Input label="Institution" placeholder="School, university or organization" {...register('institution')} />
              </div>

              <Select
                label="Membership Type *"
                options={MEMBER_TYPES}
                error={errors.membershipType?.message}
                {...register('membershipType', { required: 'Select a membership type.' })}
              />

              <div>
                <span className="label">Area of Interest</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {workAreas.map((a) => (
                    <label key={a.slug} className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                      <input type="checkbox" value={a.title} {...register('areaOfInterest')} className="h-4 w-4 rounded border-gray-300 text-navy-700" />
                      {a.title}
                    </label>
                  ))}
                </div>
              </div>

              <Textarea label="Short Motivation" rows={4} placeholder="Why do you want to join?" {...register('motivation')} />

              <FileUpload label="Photo (optional)" value={photo ? [photo] : []} onChange={(f) => setPhoto(f)} />
              <FileUpload label="Payment Screenshot *" accept="image/*" value={paymentProof ? [paymentProof] : []} onChange={(f) => setPaymentProof(f)} hint="Attach a screenshot of your payment as proof." />
              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300" error={errors.consent?.message} {...register('consent', { required: 'Consent is required.' })} />
                <span>I consent to the processing of my information in accordance with the organization's Data Protection Policy. *</span>
              </label>
              {errors.consent && <p className="text-xs text-red-600" role="alert">{errors.consent.message}</p>}

              <Button type="submit" variant="accent" loading={isSubmitting} className="w-full sm:w-auto">Submit Application</Button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-900">Membership Fee Payment</h3>
              {payment.accountNumber ? (
                <div className="mt-3 space-y-2 text-sm text-gray-700">
                  {payment.accountTitle && (
                    <p><span className="font-semibold">Account Title:</span> {payment.accountTitle}</p>
                  )}
                  <p><span className="font-semibold">Account Number:</span> {payment.accountNumber}</p>
                  {payment.bankName && (
                    <p><span className="font-semibold">Bank:</span> {payment.bankName}</p>
                  )}
                  {payment.instructions && <p className="mt-1 text-gray-600">{payment.instructions}</p>}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-600">Payment details will be shared soon. Please attach your payment screenshot when submitting your application.</p>
              )}
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-900">Membership Benefits</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                <li>Be part of a network of human rights advocates.</li>
                <li>Participate in campaigns, events and trainings.</li>
                <li>Receive updates on our work and opportunities.</li>
                <li>Contribute your skills to meaningful causes.</li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-900">What happens next?</h3>
              <p className="mt-2 text-sm text-gray-600">Your application will be reviewed by our team. Once approved, you will receive a unique membership number.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
