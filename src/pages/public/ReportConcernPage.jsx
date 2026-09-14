import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock, AlertTriangle, ClipboardList } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Input, Select, Textarea, Button, Card } from '../../components/ui/index.jsx';
import FileUpload from '../../components/ui/FileUpload.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { COMPLAINT_CATEGORIES } from '../../config/constants.js';

export default function ReportConcernPage() {
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && k !== 'consent') formData.append(k, v);
    });
    formData.append('consent', values.consent ? 'true' : 'false');
    files.forEach((f) => formData.append('files', f));
    try {
      const res = await publicApi.submitComplaint(formData);
      setResult(res.data);
      toast.success('Your concern has been submitted successfully.');
    } catch (err) {
      toast.error(getApiError(err, 'Submission failed.'));
    }
  };

  if (result) {
    return (
      <>
        <PageHeader title="Report a Human Rights Concern" eyebrow="Confidential" description="Submit a concern securely and confidentially." />
        <section className="section-pad">
          <div className="container-page mx-auto max-w-2xl">
            <Card className="p-8 text-center">
              <ShieldCheck className="mx-auto h-14 w-14 text-green-600" />
              <h2 className="mt-4 text-2xl font-bold text-navy-900">Your concern has been submitted successfully.</h2>
              <p className="mt-2 text-gray-600">Please save your unique complaint ID. You will need it to track your concern.</p>
              <div className="mt-6 rounded-lg bg-navy-50 p-6">
                <p className="text-sm text-gray-500">Your complaint ID</p>
                <p className="mt-1 text-3xl font-extrabold tracking-widest text-navy-900">{result.complaintId}</p>
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/track-complaint" className="btn-primary">Track Your Complaint</Link>
                <Link to="/" className="btn-outline">Return Home</Link>
              </div>
            </Card>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Report a Human Rights Concern" eyebrow="Confidential" description="Your voice matters. Report a concern and our team will review it with care and confidentiality." breadcrumbs={[{ label: 'Report a Concern' }]} />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 sm:p-8" noValidate>
              <h2 className="text-xl font-bold text-navy-900">Submit a Concern</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Full Name *" error={errors.fullName?.message} {...register('fullName', { required: 'Full name is required.' })} />
                <Input label="Email" type="email" error={errors.email?.message} {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email.' } })} />
                <Input label="Phone" {...register('phone')} />
                <Input label="City" {...register('city')} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Incident Type *"
                  options={COMPLAINT_CATEGORIES}
                  placeholder="Select category"
                  error={errors.incidentType?.message}
                  {...register('incidentType', { required: 'Select an incident type.' })}
                />
                <Input label="Incident Date" type="date" {...register('incidentDate')} />
              </div>

              <Input label="Incident Location" placeholder="Where did this happen?" {...register('incidentLocation')} />

              <Textarea label="Description *" rows={6} placeholder="Please describe what happened, including any relevant details." error={errors.description?.message} {...register('description', { required: 'Description is required.' })} />

              <FileUpload
                label="Supporting Files (optional)"
                multiple
                value={files}
                onChange={(selected) => setFiles(selected ? (Array.isArray(selected) ? selected : [selected]) : [])}
                hint="Images, PDFs or documents. Maximum 5 files."
              />

              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300" {...register('confidentialityRequest')} />
                <span>I request that my information be treated with strict confidentiality.</span>
              </label>

              <label className="flex items-start gap-2 text-sm text-gray-700">
                <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-gray-300" {...register('consent', { required: 'Consent is required.' })} />
                <span>I consent to the processing of my information in accordance with the Data Protection Policy. *</span>
              </label>
              {errors.consent && <p className="text-xs text-red-600" role="alert">{errors.consent.message}</p>}

              <Button type="submit" variant="accent" loading={isSubmitting} className="w-full sm:w-auto">Submit Concern</Button>
            </form>
          </div>

          <aside className="space-y-5">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900"><ClipboardList className="h-5 w-5 text-accent-600" /> What can be reported?</h3>
              <p className="mt-2 text-sm text-gray-600">Violence, discrimination, violations of women, child, minority, labour, disability or digital rights, and restrictions on freedom of expression.</p>
            </Card>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900"><Lock className="h-5 w-5 text-accent-600" /> Privacy & confidentiality</h3>
              <p className="mt-2 text-sm text-gray-600">Your information is handled securely and shared only with authorized staff on a need-to-know basis.</p>
            </Card>
            <Card className="p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-navy-900"><ShieldCheck className="h-5 w-5 text-accent-600" /> What happens next?</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-600">
                <li>Your concern is received and logged.</li>
                <li>Our team reviews it confidentially.</li>
                <li>It is assigned for assessment or investigation.</li>
                <li>You can track status using your complaint ID.</li>
              </ol>
            </Card>
            <Card className="border-red-200 bg-red-50 p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-red-800"><AlertTriangle className="h-5 w-5" /> Emergency disclaimer</h3>
              <p className="mt-2 text-sm text-red-700">If you are in immediate danger, please contact local emergency services right away. This form is not an emergency service.</p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
