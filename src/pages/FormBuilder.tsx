import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFieldStore } from '../store/formStore';
import type { FormField, FieldType } from '../types';
import styles from '../styles/FormBuilder.module.css';

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text',     label: 'Text Input'       },
  { value: 'email',    label: 'Email'             },
  { value: 'number',   label: 'Number'            },
  { value: 'textarea', label: 'Textarea'          },
  { value: 'select',   label: 'Dropdown (select)' },
  { value: 'checkbox', label: 'Checkbox'          },
  { value: 'radio',    label: 'Radio Group'       },
];

export default function FormBuilder() {
  const navigate = useNavigate();
  const { fields, addField, removeField, moveField, clearFields } = useFieldStore();

  const [label,        setLabel       ] = useState('');
  const [type,         setType        ] = useState<FieldType>('text');
  const [required,     setRequired    ] = useState(false);
  const [optionsInput, setOptionsInput] = useState('');
  const [errorMsg,     setErrorMsg    ] = useState('');

  const needsOptions = type === 'select' || type === 'radio';

  const handleAdd = () => {
    if (!label.trim()) { setErrorMsg('Field label is required.'); return; }
    if (needsOptions && !optionsInput.trim()) {
      setErrorMsg('Please provide comma-separated options.'); return;
    }
    setErrorMsg('');

    const newField: FormField = {
      id:      `field_${Date.now()}`,
      label:   label.trim(),
      type,
      required,
      options: needsOptions
        ? optionsInput.split(',').map((o) => o.trim()).filter(Boolean)
        : undefined,
    };

    addField(newField);
    setLabel('');
    setType('text');
    setRequired(false);
    setOptionsInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Form Builder</h1>
          <p className={styles.subtitle}>Define your form fields, then preview and submit.</p>
        </div>
        <button
          className={styles.previewBtn}
          disabled={fields.length === 0}
          onClick={() => navigate('/form-preview')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          Preview Form
          {fields.length > 0 && (
            <span className={styles.previewBadge}>{fields.length}</span>
          )}
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.addPanel}>
          <h2 className={styles.panelTitle}>Add New Field</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Field Label *</label>
            <input
              className={styles.input}
              placeholder='e.g. "User Name", "Status"…'
              value={label}
              onChange={(e) => { setLabel(e.target.value); setErrorMsg(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Input Type *</label>
            <select
              className={styles.select}
              value={type}
              onChange={(e) => { setType(e.target.value as FieldType); setErrorMsg(''); }}
            >
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {needsOptions && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Options <span className={styles.hint}>(comma separated)</span>
              </label>
              <input
                className={styles.input}
                placeholder='e.g. "Active, Inactive, Pending"'
                value={optionsInput}
                onChange={(e) => { setOptionsInput(e.target.value); setErrorMsg(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
              <span>Mark as required</span>
            </label>
          </div>

          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

          <button className={styles.addBtn} onClick={handleAdd}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Field
          </button>
        </div>
        <div className={styles.listPanel}>
          <div className={styles.listHeader}>
            <h2 className={styles.panelTitle}>
              Form Fields
              {fields.length > 0 && (
                <span className={styles.countBadge}>{fields.length}</span>
              )}
            </h2>
            {fields.length > 0 && (
              <button className={styles.clearBtn} onClick={clearFields}>
                Clear All
              </button>
            )}
          </div>

          {fields.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No fields yet.</p>
              <p>Add your first field from the left panel.</p>
            </div>
          ) : (
            <>
              <div className={styles.fieldList}>
                {fields.map((field, index) => (
                  <div key={field.id} className={styles.fieldCard}>
                    <span className={styles.fieldNum}>{index + 1}</span>
                    <div className={styles.fieldInfo}>
                      <div className={styles.fieldTop}>
                        <span className={styles.fieldLabel}>{field.label}</span>
                        <span className={styles.typeBadge}>{field.type}</span>
                        {field.required && (
                          <span className={styles.reqBadge}>required</span>
                        )}
                      </div>
                      {field.options && (
                        <p className={styles.optionsText}>
                          Options: {field.options.join(' · ')}
                        </p>
                      )}
                    </div>
                    <div className={styles.cardActions}>
                      <button className={styles.moveBtn}
                        disabled={index === 0}
                        onClick={() => moveField(index, index - 1)}>↑</button>
                      <button className={styles.moveBtn}
                        disabled={index === fields.length - 1}
                        onClick={() => moveField(index, index + 1)}>↓</button>
                      <button className={styles.removeBtn}
                        onClick={() => removeField(field.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cta}>
                <p>{fields.length} field{fields.length !== 1 ? 's' : ''} ready.</p>
                <button className={styles.previewBtnLg}
                  onClick={() => navigate('/form-preview')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Go to Preview & Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}