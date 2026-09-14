import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Input, Select, Textarea, Button } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { workAreas } from '../../config/navigation.js';

const AVAILABILITY = ['Weekdays', 'Weekends', 'Evenings', 'Flexible', 'Remote'];

export default function VolunteerPage() {
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        skills: typeof values.skills === 'string'
          ? values.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : values.skills || [],
      };
      const res = await publicApi.submitVolunteer(payload);
      toast.success(res.message || 'Application submitted.');
      reset();
    } catch (err) {
      toast.error(getApiError(err, 'Application failed.'));
    }
  };

  return (
    <>
      <PageHeader title="Volunteer With Us" description="Give your time and skills to defend human rights in your community." eyebrow="Get Involved" breadcrumbs={[{ label: 'Get Involved' }, { label: 'Volunteer' }]} />
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 sm:p-8" noValidate>
              <h2 className="text-xl font-bold text-navy-900">Volunteer Application</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full Name *" error={errors.name?.message} {...register('name', { required: 'Name is required.' })} />
                <Input label="Email *" type="email" error={errors.email?.message} {...register('email', { required: 'Email is required.' })} />
                <Input label="Phone *" error={errors.phone?.message} {...register('phone', { required: 'Phone is required.' })} />
                <Input label="City" {...register('city')} />
                <Input label="Institution" className="sm:col-span-2" {...register('institution')} />
              </div>

              <Input label="Skills (comma separated)" placeholder="e.g. teaching, design, law, communication" {...register('skills')} />

              <div>
                <span className="label">Areas of Interest</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {workAreas.map((a) => (
                    <label key={a.slug} className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm">
                      <input type="checkbox" value={a.title} {...register('areasOfInterest')} className="h-4 w-4 rounded border-gray-300 text-navy-700" />
                      {a.title}
                    </label>
                  ))}
                </div>
              </div>

              <Select label="Availability" options={AVAILABILITY} {...register('availability')} />

              <Textarea label="Motivation" rows={4} placeholder="Why do you want to volunteer?" {...register('motivation')} />

              <Button type="submit" variant="accent" loading={isSubmitting} className="w-full sm:w-auto">Submit Application</Button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-navy-900">Why volunteer?</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-600">
                <li>Make a real difference in your community.</li>
                <li>Build skills and experience.</li>
                <li>Connect with like-minded people.</li>
                <li>Contribute to campaigns and events.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
