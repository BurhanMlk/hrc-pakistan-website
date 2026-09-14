import { useState } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Input, Button, Card, StatusBadge } from '../../components/ui/index.jsx';
import { publicApi } from '../../services/publicApi.js';
import { getApiError } from '../../services/api.js';
import { formatDate } from '../../utils/helpers.js';
import { COMPLAINT_STATUSES } from '../../config/constants.js';

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const track = async (e) => {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await publicApi.trackComplaint(complaintId.trim());
      setResult(data);
    } catch (err) {
      setError(getApiError(err, 'Unable to find that complaint ID.'));
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = result ? COMPLAINT_STATUSES.indexOf(result.status) : -1;

  return (
    <>
      <PageHeader title="Track Your Complaint" description="Enter your complaint ID to check the status of your concern." eyebrow="Status" breadcrumbs={[{ label: 'Track Complaint' }]} />
      <section className="section-pad">
        <div className="container-page mx-auto max-w-2xl">
          <form onSubmit={track} className="card flex flex-col gap-3 p-6 sm:flex-row">
            <Input
              label="Complaint ID"
              placeholder="HRC-TC-2026-XXXX"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" variant="primary" loading={loading} className="self-end">
              <Search className="h-4 w-4" /> Track
            </Button>
          </form>

          {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

          {result && (
            <Card className="mt-6 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Complaint ID</p>
                  <p className="text-xl font-extrabold tracking-widest text-navy-900">{result.complaintId}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Incident type: <span className="font-semibold">{result.incidentType}</span> · Submitted: <span className="font-semibold">{formatDate(result.submittedAt)}</span>
              </p>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center">
                  {COMPLAINT_STATUSES.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          i <= statusIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {i < statusIndex ? '✓' : i + 1}
                        </span>
                      </div>
                      {i < COMPLAINT_STATUSES.length - 1 && (
                        <span className={`mx-1 h-0.5 flex-1 ${i < statusIndex ? 'bg-green-600' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 hidden justify-between text-[10px] text-gray-500 sm:flex">
                  {COMPLAINT_STATUSES.map((s) => <span key={s} className="w-20 text-center">{s}</span>)}
                </div>
              </div>

              {result.timeline?.length > 0 && (
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <h3 className="mb-3 text-sm font-bold text-navy-900">Status Updates</h3>
                  <ul className="space-y-2">
                    {result.timeline.map((t, i) => (
                      <li key={i} className="text-sm text-gray-600">
                        <span className="font-semibold text-navy-900">{t.status}</span> — {formatDate(t.createdAt)}
                        {t.note ? <span className="text-gray-500"> · {t.note}</span> : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
