import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore, useSubmissionStore } from '../store/formStore';
import type { SubmittedEntry } from '../types';
import styles from '../styles/FormPreview.module.css';

export default function FormPreview() {
  const navigate = useNavigate();
  const { fields } = useFieldStore();
  const { submissions, addSubmission, clearSubmissions } = useSubmissionStore();

  const [formData,   setFormData  ] = useState<Record<string, string | boolean>>({});
  const [submitted,  setSubmitted ] = useState(false);
  const [activeTab,  setActiveTab ] = useState<'form' | 'history'>('form');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleChange = (id: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: SubmittedEntry = {
      id:          `sub_${Date.now()}`,
      submittedAt: new Date().toLocaleString(),
      data:        { ...formData },
    };

    // 1. Add submission    
    addSubmission(entry);

    // 2. Console log
    console.group('=== Form Submitted ===');
    console.log('Submitted at:', entry.submittedAt);
    console.log('ID          :', entry.id);
    console.table(
      Object.entries(entry.data).map(([k, v]) => ({ field: k, value: v }))
    );
    console.groupEnd();

    setSubmitted(true);
    setFormData({});
  };

  if (fields.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <h2>No form configured</h2>
        <p>Go to Form Builder to add fields first.</p>
        <button className={styles.goBuilderBtn}
          onClick={() => navigate('/form-builder')}>
          Go to Form Builder
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Form Preview</h1>
          <p className={styles.subtitle}>
            {fields.length} field{fields.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button className={styles.backBtn}
          onClick={() => navigate('/form-builder')}>
          ← Back to Builder
        </button>
      </div>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'form' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('form')}>
          Fill Form
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}>
          Submission History
          {submissions.length > 0 && (
            <span className={styles.histBadge}>{submissions.length}</span>
          )}
        </button>
      </div>
      {activeTab === 'form' && (
        <div className={styles.formCard}>
          {submitted ? (
            <div className={styles.successBox}>
              <div className={styles.successIcon}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2>Submitted Successfully!</h2>
              <p>Data saved to localStorage & logged to browser console.</p>
              <div className={styles.successActions}>
                <button className={styles.submitAgainBtn}
                  onClick={() => setSubmitted(false)}>
                  Submit Another Response
                </button>
                <button className={styles.viewHistBtn}
                  onClick={() => setActiveTab('history')}>
                  View History ({submissions.length})
                </button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              {fields.map((field) => (
                <div key={field.id} className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.req}> *</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      className={styles.textarea}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      value={(formData[field.id] as string) ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className={styles.select}
                      required={field.required}
                      value={(formData[field.id] as string) ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    >
                      <option value="">-- Select an option --</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={(formData[field.id] as boolean) ?? false}
                        onChange={(e) => handleChange(field.id, e.target.checked)}
                      />
                      <span>{field.label}</span>
                    </label>
                  ) : field.type === 'radio' ? (
                    <div className={styles.radioGroup}>
                      {field.options?.map((opt) => (
                        <label key={opt} className={styles.radioLabel}>
                          <input
                            type="radio"
                            name={field.id}
                            value={opt}
                            required={field.required}
                            checked={(formData[field.id] as string) === opt}
                            onChange={() => handleChange(field.id, opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      className={styles.input}
                      type={field.type}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      value={(formData[field.id] as string) ?? ''}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <div className={styles.formFooter}>
                <button type="button" className={styles.clearBtn}
                  onClick={() => setFormData({})}>
                  Clear
                </button>
                <button type="submit" className={styles.submitBtn}>
                  Submit Form
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className={styles.histCard}>
          {submissions.length === 0 ? (
            <div className={styles.emptyHist}>
              <p>No submissions yet.</p>
              <button className={styles.goFormBtn}
                onClick={() => setActiveTab('form')}>
                Fill the form
              </button>
            </div>
          ) : (
            <>
              <div className={styles.histHeader}>
                <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
                <button className={styles.clearHistBtn}
                  onClick={() => {
                    if (window.confirm('Clear all submission history?'))
                      clearSubmissions();
                  }}>
                  Clear History
                </button>
              </div>

              {submissions.map((sub, idx) => (
                <div key={sub.id} className={styles.subCard}>
                  <button
                    className={styles.subCardHead}
                    onClick={() =>
                      setExpandedId(expandedId === sub.id ? null : sub.id)
                    }>
                    <div className={styles.subLeft}>
                      <span className={styles.subIdx}>#{submissions.length - idx}</span>
                      <span className={styles.subTime}>{sub.submittedAt}</span>
                    </div>
                    <span>{expandedId === sub.id ? '▲' : '▼'}</span>
                  </button>

                  {expandedId === sub.id && (
                    <div className={styles.subBody}>
                      {fields.map((field) => (
                        <div key={field.id} className={styles.subRow}>
                          <span className={styles.subKey}>{field.label}</span>
                          <span className={styles.subVal}>
                            {sub.data[field.id] === undefined || sub.data[field.id] === ''
                              ? <em className={styles.empty}>—</em>
                              : sub.data[field.id] === true ? '✓ Yes'
                              : sub.data[field.id] === false ? '✗ No'
                              : String(sub.data[field.id])}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}