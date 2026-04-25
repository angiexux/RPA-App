'use client';

import { useState } from 'react';

interface Source {
  id: string;
  reportLink: string;
  sourceName: string;
  frequency: string;
  latestVersion: string;
  notableFor: string;
}

interface FormData {
  reportLink: string;
  sourceName: string;
  frequency: string;
  latestVersion: string;
  notableFor: string;
}

const initialFormData: FormData = {
  reportLink: '',
  sourceName: '',
  frequency: '',
  latestVersion: '',
  notableFor: '',
};

export default function SourceCitation() {
  const [sources, setSources] = useState<Source[]>([
    {
      id: '1',
      reportLink: 'https://example.com/report1',
      sourceName: 'Global Intelligence Report',
      frequency: 'Monthly',
      latestVersion: 'v2.1',
      notableFor: 'Geopolitical analysis',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdate = () => {
    if (
      !formData.reportLink ||
      !formData.sourceName ||
      !formData.frequency ||
      !formData.latestVersion ||
      !formData.notableFor
    ) {
      alert('Please fill in all fields');
      return;
    }

    if (editingId) {
      setSources((prev) =>
        prev.map((source) =>
          source.id === editingId ? { ...source, ...formData } : source
        )
      );
      setEditingId(null);
    } else {
      const newSource: Source = {
        id: Date.now().toString(),
        ...formData,
      };
      setSources((prev) => [...prev, newSource]);
    }

    setFormData(initialFormData);
    setShowForm(false);
  };

  const handleEdit = (source: Source) => {
    setFormData({
      reportLink: source.reportLink,
      sourceName: source.sourceName,
      frequency: source.frequency,
      latestVersion: source.latestVersion,
      notableFor: source.notableFor,
    });
    setEditingId(source.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setSources((prev) => prev.filter((source) => source.id !== id));
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Source Citations</h2>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel();
            } else {
              setShowForm(true);
            }
          }}
          className="rounded-lg bg-[var(--accent-gold)] px-4 py-2 font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-lt)] active:scale-95"
        >
          {showForm ? 'Cancel' : 'Add Source'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card space-y-4 p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {editingId ? 'Edit Source' : 'Add New Source'}
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Report/Link */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Report/Link
              </label>
              <input
                type="url"
                name="reportLink"
                value={formData.reportLink}
                onChange={handleInputChange}
                placeholder="https://example.com/report"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
            </div>

            {/* Source Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Source Name
              </label>
              <input
                type="text"
                name="sourceName"
                value={formData.sourceName}
                onChange={handleInputChange}
                placeholder="e.g., Global Intelligence Report"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              >
                <option value="">Select frequency</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
                <option value="On-demand">On-demand</option>
              </select>
            </div>

            {/* Latest Version */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)]">
                Latest Version
              </label>
              <input
                type="text"
                name="latestVersion"
                value={formData.latestVersion}
                onChange={handleInputChange}
                placeholder="e.g., v2.1"
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
              />
            </div>
          </div>

          {/* Notable For */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Notable For
            </label>
            <textarea
              name="notableFor"
              value={formData.notableFor}
              onChange={handleInputChange}
              placeholder="Describe what this source is notable for..."
              rows={3}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-[var(--text-primary)] placeholder-[var(--text-muted)] transition focus:outline-none focus:ring-2 focus:ring-[var(--accent-gold)]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddOrUpdate}
              className="flex-1 rounded-lg bg-[var(--accent-gold)] px-4 py-2 font-semibold text-[var(--bg-primary)] transition hover:bg-[var(--accent-gold-lt)] active:scale-95"
            >
              {editingId ? 'Update Source' : 'Add Source'}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sources Table */}
      {sources.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Report/Link
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Source Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Frequency
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Latest Version
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Notable For
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr
                    key={source.id}
                    className="border-b border-[var(--border)] transition hover:bg-[var(--bg-secondary)]"
                  >
                    <td className="px-6 py-4">
                      <a
                        href={source.reportLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[var(--accent-gold)] underline decoration-dotted underline-offset-2 transition hover:text-[var(--accent-gold-lt)]"
                      >
                        {source.reportLink.length > 30
                          ? source.reportLink.substring(0, 30) + '...'
                          : source.reportLink}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {source.sourceName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-[var(--accent-gold)] px-3 py-1 text-xs font-semibold text-[var(--bg-primary)]">
                        {source.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      {source.latestVersion}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                      {source.notableFor.length > 40
                        ? source.notableFor.substring(0, 40) + '...'
                        : source.notableFor}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(source)}
                          className="rounded-lg bg-[var(--info)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-80 active:scale-95"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="rounded-lg bg-[var(--danger)] px-3 py-1 text-xs font-semibold text-white transition hover:opacity-80 active:scale-95"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !showForm && (
          <div className="card space-y-4 border-2 border-dashed border-[var(--border)] p-12 text-center">
            <p className="text-[var(--text-muted)]">No sources added yet</p>
            <p className="text-sm text-[var(--text-muted)]">
              Click the "Add Source" button to get started
            </p>
          </div>
        )
      )}
    </div>
  );
}
