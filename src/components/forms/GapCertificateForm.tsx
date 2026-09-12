import type { LegalDocument } from "../../types/document";
import { CheckCircle2, FileText, GraduationCap, MapPin } from "lucide-react";

interface GapCertificateFormProps {
  document: LegalDocument;
  onChange: (field: string, value: string) => void;
  onAdditionalPointChange: (
    pointIndex: number,
    value: string
  ) => void;
  onAddPoint: () => void;
  onSettingChange: (
    setting: "fontSize" | "lineSpacing",
    value: number
  ) => void;
}

function sentenceCase(value: string) {
  const normalized = value.trim().toLowerCase();

  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "";
}

function GapCertificateForm({
  document,
  onChange,
  onAdditionalPointChange,
  onAddPoint,
  onSettingChange,
}: GapCertificateFormProps) {
  const fields = document.fields;

  const renderInput = (
    field: string,
    label: string,
    placeholder: string,
    type = "text"
  ) => (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={fields[field] || ""}
        onChange={(e) => onChange(field, e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );

  return (
    <div className="form-panel">
      <div className="form-intro">
        <div className="form-icon"><FileText size={20} /></div>
        <div>
          <p className="eyebrow">Create document</p>
          <h2>Gap certificate</h2>
          <p className="form-description">Fill in your details and the affidavit updates live.</p>
        </div>
      </div>

      <div className="completion-card">
        <div className="completion-copy"><CheckCircle2 size={16} /><span>Live preview enabled</span></div>
        <span className="completion-pill">Draft</span>
      </div>

      <section className="form-section">
        <div className="section-heading"><span className="section-number">Aa</span><div><h3>Document formatting</h3><p>Choose the preview text size and spacing.</p></div></div>
        <div className="field-row">
          <label className="field">
            <span>Font size</span>
            <select
              value={document.settings.fontSize}
              onChange={(event) =>
                onSettingChange(
                  "fontSize",
                  Number(event.target.value)
                )
              }
            >
              <option value={12}>12 px</option>
              <option value={14}>14 px</option>
              <option value={16}>16 px</option>
              <option value={18}>18 px</option>
              <option value={20}>20 px</option>
            </select>
          </label>
          <label className="field">
            <span>Line spacing</span>
            <select
              value={document.settings.lineSpacing}
              onChange={(event) =>
                onSettingChange(
                  "lineSpacing",
                  Number(event.target.value)
                )
              }
            >
              <option value={1}>1.0 (Single)</option>
              <option value={1.15}>1.15</option>
              <option value={1.5}>1.5</option>
              <option value={2}>2.0 (Double)</option>
            </select>
          </label>
        </div>
      </section>

      <section className="form-section">
        <div className="section-heading"><span className="section-number">01</span><div><h3>Personal details</h3><p>Tell us who this certificate is for.</p></div></div>
        {renderInput("applicantName", "Applicant name", "e.g. Ananya Sharma")}
        {renderInput("age", "Age", "e.g. 18", "number")}
        {renderInput("parentName", "Father / mother name", "e.g. Rajesh Sharma")}
        <label className="field">
          <span>Residential address</span>
          <textarea value={fields.address || ""} onChange={(e) => onChange("address", e.target.value)} placeholder="House no., street, city, state" rows={3} />
        </label>
      </section>

      <section className="form-section">
        <div className="section-heading"><span className="section-number"><GraduationCap size={15} /></span><div><h3>Education history</h3><p>Add your latest qualification.</p></div></div>
        {renderInput("qualification", "Last educational qualification", "e.g. Bachelor of Commerce")}
        {renderInput("institution", "School / college / university", "e.g. University of Delhi")}
        {renderInput("completionDate", "Month and year completed", "e.g. May 2024")}
      </section>

      <section className="form-section">
        <div className="section-heading"><span className="section-number">03</span><div><h3>Gap period</h3><p>The certificate records a one-month gap.</p></div></div>
        <div className="field-row">
          {renderInput("gapFrom", "Start month and year", "e.g. June 2024", "month")}
          {renderInput("gapTo", "End month and year", "e.g. June 2024", "month")}
        </div>
        <div className="additional-points">
          <div className="additional-points-heading">
            <span>Additional points</span>
            <button
              type="button"
              className="add-field-button"
              onClick={onAddPoint}
            >
              + Add point
            </button>
          </div>
          {document.additionalPoints.map((point, index) => (
            <label className="field" key={`additional-point-${index}`}>
              <span>Point {index + 7}</span>
              <input
                type="text"
                value={point}
                onChange={(event) =>
                  onAdditionalPointChange(index, event.target.value)
                }
                onBlur={(event) =>
                  onAdditionalPointChange(
                    index,
                    sentenceCase(event.target.value)
                  )
                }
                placeholder="e.g. I remained at home during this period"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="form-section last-section">
        <div className="section-heading"><span className="section-number"><MapPin size={15} /></span><div><h3>Signing details</h3><p>Where and when will you sign?</p></div></div>
        <div className="field-row">
          {renderInput("place", "Place", "e.g. New Delhi")}
          {renderInput("date", "Date", "e.g. 10 July 2024", "date")}
        </div>
      </section>
    </div>
  );
}

export default GapCertificateForm;