'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getToken, removeToken } from '@/lib/api';

interface Job {
  _id: string;
  company: string;
  role: string;
  status: string;
  salary: number;
  notes: string;
  appliedDate: string;
}

interface JobForm {
  company: string;
  role: string;
  status: string;
  salary: string;
  notes: string;
  jobUrl: string;
}

const emptyForm: JobForm = {
  company: '',
  role: '',
  status: 'Applied',
  salary: '',
  notes: '',
  jobUrl: ''
};

export default function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) { router.push('/login'); return; }
    fetchJobs(token);
  }, []);

  const fetchJobs = async (token: string) => {
    const data = await api.getJobs(token);
    if (data.message === 'Invalid token') {
      removeToken();
      router.push('/login');
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const token = getToken() as string;
    const data = await api.createJob(token, {
      ...form,
      salary: Number(form.salary) || 0
    });
    if (data._id) {
      setJobs([data, ...jobs]);
      setForm(emptyForm);
      setShowForm(false);
    } else {
      setError(data.message || 'Failed to add job');
    }
    setSubmitting(false);
  };

  const handleDeleteJob = async (jobId: string) => {
  const confirmed = window.confirm('Are you sure you want to delete this job?');
  if (!confirmed) return;
  const token = getToken() as string;
  await api.deleteJob(token, jobId);
  setJobs(jobs.filter(j => j._id !== jobId));
};

  const handleUpdateStatus = async (jobId: string, status: string) => {
    const token = getToken() as string;
    const updated = await api.updateJob(token, jobId, { status });
    setJobs(jobs.map(j => j._id === jobId ? updated : j));
  };

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const statusColor: Record<string, string> = {
    Applied: 'bg-blue-50 text-blue-700',
    Interview: 'bg-yellow-50 text-yellow-700',
    Offer: 'bg-green-50 text-green-700',
    Rejected: 'bg-red-50 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">CareerLens</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Job'}
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* Add Job Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Application</h2>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleAddJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                  <input
                    required
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    placeholder="Google"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <input
                    required
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                    placeholder="Frontend Developer"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={e => setForm({ ...form, salary: e.target.value })}
                    placeholder="120000"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                <input
                  value={form.jobUrl}
                  onChange={e => setForm({ ...form, jobUrl: e.target.value })}
                  placeholder="https://linkedin.com/jobs/..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Applied via LinkedIn, referral from John..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Application'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: jobs.length, color: 'bg-gray-900 text-white' },
            { label: 'Applied', count: jobs.filter(j => j.status === 'Applied').length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Interview', count: jobs.filter(j => j.status === 'Interview').length, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Offer', count: jobs.filter(j => j.status === 'Offer').length, color: 'bg-green-50 text-green-700' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-sm mt-1 opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📋</div>
            <div className="text-lg font-medium text-gray-600">No applications yet</div>
            <div className="text-sm text-gray-400 mt-1">Click "+ Add Job" to get started</div>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{job.role}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{job.company}</div>
                    {job.notes && (
                      <div className="text-xs text-gray-400 mt-1">{job.notes}</div>
                    )}
                    <div className="text-xs text-gray-300 mt-1">
                      {new Date(job.appliedDate).toLocaleDateString('en-AU')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.salary > 0 && (
                      <div className="text-sm text-gray-500">
                        ${job.salary.toLocaleString()}
                      </div>
                    )}
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                  <span className="text-xs text-gray-400 mr-2">Move to:</span>
                  {['Applied', 'Interview', 'Offer', 'Rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(job._id, status)}
                      disabled={job.status === status}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors
                        ${job.status === status
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="ml-auto text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}