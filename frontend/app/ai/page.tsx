'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api, getToken } from '@/lib/api';

interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  recommendedRoles: string[];
}

interface JobMatch {
  matchScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'resume' | 'jobmatch' | 'coverletter'>('resume');

  // Resume analyser state
  const [file, setFile] = useState<File | null>(null);
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeError, setResumeError] = useState('');

  // Job match state
  const [jobDescription, setJobDescription] = useState('');
  const [matching, setMatching] = useState(false);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const [jobMatchError, setJobMatchError] = useState('');

  // Cover letter state
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState('');

  const handleAnalyseResume = async () => {
    if (!file) return;
    setAnalysing(true);
    setResumeError('');
    setAnalysis(null);
    const token = getToken() as string;
    const data = await api.analyseResume(token, file);
    if (data.analysis) {
      setAnalysis(data.analysis);
      setResumeText(data.resumeText);
    } else {
      setResumeError(data.message || 'Analysis failed');
    }
    setAnalysing(false);
  };

  const handleJobMatch = async () => {
    if (!resumeText || !jobDescription) {
      setJobMatchError('Please analyse your resume first, then paste a job description');
      return;
    }
    setMatching(true);
    setJobMatchError('');
    setJobMatch(null);
    const token = getToken() as string;
    const data = await api.jobMatch(token, resumeText, jobDescription);
    if (data.match) {
      setJobMatch(data.match);
    } else {
      setJobMatchError(data.message || 'Job match failed');
    }
    setMatching(false);
  };

  const handleCoverLetter = async () => {
    if (!resumeText || !jobDescription) {
      setCoverLetterError('Please analyse your resume and add a job description first');
      return;
    }
    setGeneratingLetter(true);
    setCoverLetterError('');
    setCoverLetter('');
    const token = getToken() as string;
    const data = await api.coverLetter(token, resumeText, jobDescription, companyName, roleName);
    if (data.coverLetter) {
      setCoverLetter(data.coverLetter);
    } else {
      setCoverLetterError(data.message || 'Generation failed');
    }
    setGeneratingLetter(false);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert('Cover letter copied to clipboard!');
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-900">CareerLens</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          <span className="text-sm font-medium text-gray-900">AI Tools</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">AI Career Tools</h2>
          <p className="text-gray-500 mt-1">Powered by Claude AI</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'resume', label: 'Resume Analyser' },
            { id: 'jobmatch', label: 'Job Match Scorer' },
            { id: 'coverletter', label: 'Cover Letter' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Resume Analyser Tab */}
        {activeTab === 'resume' && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Resume</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-sm text-gray-500 mb-4">Upload your resume as PDF</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Choose PDF file
                </label>
                {file && (
                  <p className="text-sm text-green-600 mt-3">✓ {file.name}</p>
                )}
              </div>
              {resumeError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4">{resumeError}</div>
              )}
              <button
                onClick={handleAnalyseResume}
                disabled={!file || analysing}
                className="w-full mt-4 bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {analysing ? '🤖 Analysing your resume...' : 'Analyse Resume'}
              </button>
            </div>

            {analysis && (
              <div className="space-y-4">
                <div className={`bg-white rounded-2xl border p-6 ${scoreBg(analysis.score)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Resume Score</div>
                      <div className={`text-5xl font-bold mt-1 ${scoreColor(analysis.score)}`}>
                        {analysis.score}<span className="text-2xl text-gray-400">/100</span>
                      </div>
                    </div>
                    <div className="text-5xl">
                      {analysis.score >= 80 ? '🌟' : analysis.score >= 60 ? '👍' : '💪'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{analysis.summary}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">✅ Strengths</h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">🔧 Areas to Improve</h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((imp, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>{imp}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">🔑 Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full border border-red-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">💼 Recommended Roles</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommendedRoles.map((role, i) => (
                      <span key={i} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full border border-blue-200">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('jobmatch')}
                  className="w-full bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Now check Job Match →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Job Match Tab */}
        {activeTab === 'jobmatch' && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Match Scorer</h3>
              <p className="text-sm text-gray-500 mb-4">
                {resumeText
                  ? '✅ Resume loaded — paste a job description below'
                  : '⚠️ Please analyse your resume first on the Resume tab'}
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={8}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>
              {jobMatchError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mt-4">{jobMatchError}</div>
              )}
              <button
                onClick={handleJobMatch}
                disabled={!jobDescription || matching || !resumeText}
                className="w-full mt-4 bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {matching ? '🤖 Scoring your match...' : 'Score My Match'}
              </button>
            </div>

            {jobMatch && (
              <div className="space-y-4">
                <div className={`bg-white rounded-2xl border p-6 ${scoreBg(jobMatch.matchScore)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Match Score</div>
                      <div className={`text-5xl font-bold mt-1 ${scoreColor(jobMatch.matchScore)}`}>
                        {jobMatch.matchScore}<span className="text-2xl text-gray-400">%</span>
                      </div>
                    </div>
                    <div className="text-5xl">
                      {jobMatch.matchScore >= 80 ? '🎯' : jobMatch.matchScore >= 60 ? '👍' : '📚'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{jobMatch.summary}</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">✅ Skills You Have</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobMatch.matchingSkills.map((skill, i) => (
                      <span key={i} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">❌ Skills to Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {jobMatch.missingSkills.map((skill, i) => (
                      <span key={i} className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full border border-red-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">💡 Recommendations</h4>
                  <ul className="space-y-2">
                    {jobMatch.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>{rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setActiveTab('coverletter')}
                  className="w-full bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Generate Cover Letter →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter Tab */}
        {activeTab === 'coverletter' && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter Generator</h3>
              <p className="text-sm text-gray-500 mb-4">
                {resumeText
                  ? '✅ Resume loaded — fill in details below'
                  : '⚠️ Please analyse your resume first on the Resume tab'}
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Google"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      value={roleName}
                      onChange={e => setRoleName(e.target.value)}
                      placeholder="Frontend Developer"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  />
                </div>
                {coverLetterError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{coverLetterError}</div>
                )}
                <button
                  onClick={handleCoverLetter}
                  disabled={!jobDescription || generatingLetter || !resumeText}
                  className="w-full bg-gray-900 text-white rounded-lg py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {generatingLetter ? '🤖 Writing your cover letter...' : 'Generate Cover Letter'}
                </button>
              </div>
            </div>

            {coverLetter && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Your Cover Letter</h4>
                  <button
                    onClick={handleCopyLetter}
                    className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
                  {coverLetter}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}