import type { LegalDocument } from "../../types/document";
import { CheckCircle2, FileText } from "lucide-react";

interface RentAgreementFormProps {
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

const numberWords = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen",
];

const tensWords = [
  "", "", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety",
];

function underThousand(value: number): string {
  if (value < 20) {
    return numberWords[value];
  }

  if (value < 100) {
    return `${tensWords[Math.floor(value / 10)]}${
      value % 10 ? ` ${numberWords[value % 10]}` : ""
    }`;
  }

  return `${numberWords[Math.floor(value / 100)]} hundred${
    value % 100 ? ` ${underThousand(value % 100)}` : ""
  }`;
}

function amountInWords(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  const amount = Number(digits);

  if (!Number.isSafeInteger(amount)) {
    return "";
  }

  if (amount === 0) {
    return "Zero";
  }

  const groups = [
    { divisor: 10000000, label: "crore" },
    { divisor: 100000, label: "lakh" },
    { divisor: 1000, label: "thousand" },
  ];
  let remaining = amount;
  const parts: string[] = [];

  for (const group of groups) {
    const count = Math.floor(remaining / group.divisor);

    if (count > 0) {
      parts.push(`${underThousand(count)} ${group.label}`);
      remaining %= group.divisor;
    }
  }

  if (remaining > 0) {
    parts.push(underThousand(remaining));
  }

  return parts.join(" ").replace(/^./, (character) =>
    character.toUpperCase()
  );
}

function RentAgreementForm({
  document,
  onChange,
  onAdditionalPointChange,
  onAddPoint,
  onSettingChange,
}: RentAgreementFormProps) {
  const fields = document.fields;
  const handleStartDateChange = (value: string) => {
    onChange("startDate", value);

    if (!value) {
      onChange("endDate", "");
      return;
    }

    const [year, month, day] = value
      .split("-")
      .map(Number);
    const endDate = new Date(year, month - 1, day);
    endDate.setMonth(endDate.getMonth() + 11);

    const formattedEndDate = [
      endDate.getFullYear(),
      String(endDate.getMonth() + 1).padStart(2, "0"),
      String(endDate.getDate()).padStart(2, "0"),
    ].join("-");

    onChange("endDate", formattedEndDate);
  };

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
        onChange={(event) => onChange(field, event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );

  const renderAmountInput = (
    field: "deposit" | "monthlyRent",
    label: string,
    placeholder: string
  ) => (
    <label className="field">
      <span>{label}</span>
      <input
        type="text"
        inputMode="numeric"
        value={fields[field] || ""}
        onChange={(event) =>
          onChange(field, event.target.value.replace(/\D/g, ""))
        }
        placeholder={placeholder}
      />
      {fields[field] && amountInWords(fields[field]) && (
        <small className="amount-in-words">
          {amountInWords(fields[field])}
        </small>
      )}
    </label>
  );

  return (
    <div className="form-panel">
      <div className="form-intro">
        <div className="form-icon"><FileText size={20} /></div>
        <div>
          <p className="eyebrow">Create document</p>
          <h2>Rent agreement</h2>
          <p className="form-description">Fill in the parties and premises details.</p>
        </div>
      </div>
      <div className="completion-card">
        <div className="completion-copy"><CheckCircle2 size={16} /><span>Live preview enabled</span></div>
        <span className="completion-pill">Draft</span>
      </div>
      <section className="form-section">
        <div className="section-heading"><span className="section-number">Aa</span><div><h3>Document formatting</h3><p>Choose the preview text size and spacing.</p></div></div>
        <div className="field-row">
          <label className="field"><span>Font size</span><select value={document.settings.fontSize} onChange={(event) => onSettingChange("fontSize", Number(event.target.value))}><option value={12}>12 px</option><option value={14}>14 px</option><option value={16}>16 px</option><option value={18}>18 px</option><option value={20}>20 px</option></select></label>
          <label className="field"><span>Line spacing</span><select value={document.settings.lineSpacing} onChange={(event) => onSettingChange("lineSpacing", Number(event.target.value))}><option value={1}>1.0 (Single)</option><option value={1.15}>1.15</option><option value={1.5}>1.5</option><option value={2}>2.0 (Double)</option></select></label>
        </div>
      </section>
      <section className="form-section">
        <div className="section-heading"><span className="section-number">01</span><div><h3>Parties</h3><p>Enter the agreement parties and date.</p></div></div>
        {renderInput("agreementDate", "Agreement date", "Select agreement date", "date")}
        {renderInput("licensorName", "Licensor name", "e.g. Mohammed Zeeshan Siddique")}
        {renderInput("licensorAddress", "Licensor address", "Full address")}
        {renderInput("licenseeName", "Licensee name", "e.g. Md Faisal Ansari")}
        {renderInput("licenseeAddress", "Licensee address", "Full address")}
      </section>
      <section className="form-section">
        <div className="section-heading"><span className="section-number">02</span><div><h3>Premises and payment</h3><p>Enter the property and financial details.</p></div></div>
        {renderInput("premisesAddress", "Premises address", "Full premises address")}
        <div className="field-row">
          {renderInput("duration", "Agreement period", "e.g. 11 months")}
          {renderAmountInput("deposit", "Security deposit", "e.g. 20000")}
        </div>
        <div className="field-row">
          <label className="field">
            <span>Start date</span>
            <input
              type="date"
              value={fields.startDate || ""}
              onChange={(event) =>
                handleStartDateChange(event.target.value)
              }
            />
          </label>
          <label className="field">
            <span>End date (auto-calculated)</span>
            <input
              type="date"
              value={fields.endDate || ""}
              onChange={(event) =>
                onChange("endDate", event.target.value)
              }
            />
          </label>
        </div>
        {renderAmountInput("monthlyRent", "Monthly rent", "e.g. 6000")}
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
              <span>Point {index + 11}</span>
              <input
                type="text"
                value={point}
                onChange={(event) =>
                  onAdditionalPointChange(index, event.target.value)
                }
                onBlur={(event) => {
                  const value = event.target.value.trim().toLowerCase();
                  onAdditionalPointChange(
                    index,
                    value
                      ? value.charAt(0).toUpperCase() + value.slice(1)
                      : ""
                  );
                }}
                placeholder="e.g. The parties agree to the following additional term"
              />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RentAgreementForm;
