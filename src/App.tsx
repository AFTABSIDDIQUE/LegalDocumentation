import { useState } from "react";
import { Download, FileCheck2, ShieldCheck } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  AlignmentType,
  Document as WordDocument,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

import DocumentPreview from "./components/preview/DocumentPreview";
import GapCertificateForm from "./components/forms/GapCertificateForm";
import RentAgreementForm from "./components/forms/RentAgreementForm";

import { gapCertificateTemplate } from "./templates/gapCertificate";
import { rentAgreementTemplate } from "./templates/rentAgreement";

import type {
  DocumentBlock,
  LegalDocument,
} from "./types/document";

function createWordParagraph(
  block: DocumentBlock,
  fields: Record<string, string>,
  fontSize: number,
  lineSpacing: number
) {
  const isHeading = block.type === "heading";
  const runs = block.content.split(/({{.*?}}|\n)/g).map((part) => {
    if (part === "\n") {
      return new TextRun({ break: 1 });
    }

    const match = part.match(/^{{(.*?)}}$/);
    const text = match
      ? formatPdfFieldValue(match[1].trim(), fields[match[1].trim()])
      : part;

    return new TextRun({
      text,
      bold: isHeading || Boolean(match),
      underline: isHeading ? {} : undefined,
      font: "Times New Roman",
      size: Math.round(
        (isHeading ? block.fontSize || 18 : fontSize) *
          0.75 *
          2
      ),
    });
  });

  return new Paragraph({
    alignment:
      block.align === "center"
        ? AlignmentType.CENTER
        : block.align === "right"
          ? AlignmentType.RIGHT
          : block.align === "justify"
            ? AlignmentType.JUSTIFIED
            : AlignmentType.LEFT,
    spacing: {
      line: Math.round(
        240 * (block.type === "signature" ? 1 : lineSpacing)
      ),
      before: block.id === "rent-point-1" ? 400 : 0,
      after: block.type === "heading" ? 0 : 200,
    },
    children: runs,
  });
}

function formatPdfFieldValue(
  variable: string,
  value: string | undefined
) {
  if (!value) {
    return `{{${variable}}}`;
  }

  if (variable === "agreementDate" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return `${getOrdinal(day)} DAY OF ${new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(date).toUpperCase()} ${year}`;
  }

  if (
    (variable === "gapFrom" || variable === "gapTo") &&
    /^\d{4}-\d{2}$/.test(value)
  ) {
    const [year, month] = value.split("-").map(Number);

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1));
  }

  return value;
}

function getOrdinal(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return `${day}TH`;
  }

  switch (day % 10) {
    case 1:
      return `${day}ST`;
    case 2:
      return `${day}ND`;
    case 3:
      return `${day}RD`;
    default:
      return `${day}TH`;
  }
}

function inchesToTwips(value: string) {
  const inches = Number.parseFloat(value);

  if (!Number.isFinite(inches)) {
    throw new Error(`Invalid document margin or page size: ${value}`);
  }

  return Math.round(inches * 1440);
}

function inchesToMillimeters(value: string) {
  const inches = Number.parseFloat(value);

  if (!Number.isFinite(inches)) {
    throw new Error(`Invalid document margin or page size: ${value}`);
  }

  return inches * 25.4;
}

function App() {
  const [document, setDocument] =
    useState<LegalDocument>(
      gapCertificateTemplate
    );

  const handleFieldChange = (
    field: string,
    value: string
  ) => {
    setDocument((currentDocument) => ({
      ...currentDocument,

      fields: {
        ...currentDocument.fields,
        [field]: value,
      },
    }));
  };

  const handleDocumentTypeChange = (
    type: "gap-certificate" | "agreement"
  ) => {
    setDocument(
      type === "agreement"
        ? rentAgreementTemplate
        : gapCertificateTemplate
    );
  };

  const handleAdditionalPointChange = (
    pointIndex: number,
    value: string
  ) => {
    setDocument((currentDocument) => ({
      ...currentDocument,
      additionalPoints: currentDocument.additionalPoints.map(
        (point, index) =>
          index === pointIndex ? value : point
      ),
    }));
  };

  const handleSettingChange = (
    setting: "fontSize" | "lineSpacing",
    value: number
  ) => {
    setDocument((currentDocument) => ({
      ...currentDocument,
      settings: {
        ...currentDocument.settings,
        [setting]: value,
      },
    }));
  };

  const handleAddPoint = () => {
    setDocument((currentDocument) => ({
      ...currentDocument,
      additionalPoints: [
        ...currentDocument.additionalPoints,
        "",
      ],
    }));
  };

  const handleUpdateBlock = (
    blockId: string,
    content: string
  ) => {
    setDocument((currentDocument) => ({
      ...currentDocument,

      pages: currentDocument.pages.map(
        (page) => ({
          ...page,

          blocks: page.blocks.map(
            (block) =>
              block.id === blockId
                ? {
                    ...block,
                    content,
                  }
                : block
          ),
        })
      ),
    }));
  };

  const handleDeleteBlock = (
    blockId: string
  ) => {
    setDocument((currentDocument) => ({
      ...currentDocument,

      pages: currentDocument.pages.map(
        (page) => ({
          ...page,

          blocks: page.blocks.filter(
            (block) =>
              block.id !== blockId
          ),
        })
      ),
    }));
  };

  const handleMoveBlock = (
    blockId: string,
    direction: "up" | "down"
  ) => {
    setDocument((currentDocument) => {
      const pages = currentDocument.pages.map(
        (page) => ({
          ...page,
          blocks: [...page.blocks],
        })
      );

      for (const page of pages) {
        const index = page.blocks.findIndex(
          (block) =>
            block.id === blockId
        );

        if (index === -1) {
          continue;
        }

        const newIndex =
          direction === "up"
            ? index - 1
            : index + 1;

        if (
          newIndex < 0 ||
          newIndex >= page.blocks.length
        ) {
          return currentDocument;
        }

        const temp = page.blocks[index];

        page.blocks[index] =
          page.blocks[newIndex];

        page.blocks[newIndex] = temp;

        break;
      }

      return {
        ...currentDocument,
        pages,
      };
    });
  };

  const handleDownloadPdf = () => {
    const leftMargin = inchesToMillimeters(
      document.settings.margins.left
    );
    const rightMargin = inchesToMillimeters(
      document.settings.margins.right
    );
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [
        inchesToMillimeters(document.settings.firstPage.width),
        inchesToMillimeters(document.settings.firstPage.height),
      ],
    });

    document.pages.forEach((page, pageIndex) => {
      const pageSettings =
        pageIndex === 0
          ? document.settings.firstPage
          : document.settings.otherPages;
      const pageWidth = inchesToMillimeters(pageSettings.width);
      const pageHeight = inchesToMillimeters(pageSettings.height);

      if (pageIndex > 0) {
        pdf.addPage([pageWidth, pageHeight]);
      }

      const pageFontSize =
        pageIndex === 0 ? document.settings.fontSize : 18;
      const pageLineSpacing =
        pageIndex === 0 ? document.settings.lineSpacing : 2;
      const topMargin = inchesToMillimeters(
        document.settings.margins.top
      );
      let y = pageIndex === 0 ? 165.1 : topMargin;

      const contentWidth =
        pageWidth - leftMargin - rightMargin;
      const blocks = page.blocks.flatMap((block) => {
        const additionalPointAnchor =
          document.type === "agreement"
            ? "rent-point-10"
            : "paragraph-7";

        if (block.id !== additionalPointAnchor) {
          return [block];
        }

        return [
          block,
          ...document.additionalPoints
            .filter((point) => point.trim())
            .map((point, index) => ({
              id: `additional-point-${index}`,
              type: "paragraph" as const,
              content: `${(document.type === "agreement" ? 11 : 7) + index}. ${sentenceCase(point)}`,
              align: "justify" as const,
              fontSize: document.settings.fontSize,
              bold: false,
            })),
        ];
      });

      blocks.forEach((block) => {
        const segments = formatPdfSegments(
          block.content,
          document.fields,
          block.type === "heading" || block.bold === true
        );
        const fontSizePx =
        block.type === "heading"
          ? block.fontSize || 18
          : pageFontSize;
        const fontSize = Math.round(fontSizePx * 0.75);
        const lineHeight =
        fontSizePx * 0.264583 * pageLineSpacing;

        if (block.type === "signature") {
          const signatureLines = block.content.split("\n");

          signatureLines.forEach((signatureLine) => {
            const lineSegments = formatPdfSegments(
              signatureLine,
              document.fields
            );

            if (signatureLine.trim()) {
              const signatureAlign =
                document.type === "agreement"
                  ? "left"
                  : "right";
              const signatureX =
                signatureAlign === "left"
                  ? leftMargin
                  : pageWidth - rightMargin;

              drawPdfSegments(
                pdf,
                lineSegments,
                signatureX,
                y,
                {
                  align: signatureAlign,
                  maxWidth: contentWidth,
                },
                signatureAlign
              );
            }

            y += lineHeight;
          });

          y += 4 * 0.264583;
          return;
        }

        const lines = wrapPdfSegments(
          segments,
          contentWidth,
          pdf,
          fontSize
        );
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        lines.forEach((line, lineIndex) => {
        const isLastLine = lineIndex === lines.length - 1;

        if (
          block.align === "justify" &&
          !isLastLine &&
          line.some((segment) => segment.text.includes(" "))
        ) {
          drawJustifiedLine(
            pdf,
            line,
            leftMargin,
            y,
            contentWidth
          );
        } else {
          drawPdfSegments(
            pdf,
            line,
            block.align === "center"
              ? leftMargin + contentWidth / 2
              : block.align === "right"
                ? pageWidth - rightMargin
                : leftMargin,
            y,
            {
              align:
                block.align === "center"
                  ? "center"
                  : block.align === "right"
                    ? "right"
                    : "left",
              maxWidth: contentWidth,
            },
            block.align
          );
        }

        if (block.type === "heading") {
          pdf.setLineWidth(0.3);
          const headingWidth = line.reduce(
            (total, segment) => {
              pdf.setFont(
                "times",
                segment.bold ? "bold" : "normal"
              );
              return total + pdf.getTextWidth(segment.text);
            },
            0
          );
          const headingStart =
            block.align === "center"
              ? leftMargin + contentWidth / 2 - headingWidth / 2
              : block.align === "right"
                ? pageWidth - rightMargin - headingWidth
                : leftMargin;
          pdf.line(
            headingStart,
            y + 1.2,
            headingStart + headingWidth,
            y + 1.2
          );
        }

        y += lineHeight;
        });

        const paragraphSpacingPx =
          block.type === "heading"
            ? 35
            : block.id === "rent-point-1"
              ? 28
            : /^\d+\.\s/.test(block.content)
              ? 14
              : 4;
        y += paragraphSpacingPx * 0.264583;

      });
    });

    pdf.save(`${getDownloadFileName(document)}.pdf`);
  };

  const handleDownloadWord = () => {
    const sections = document.pages.map((page, pageIndex) => {
      const blocks = page.blocks.flatMap((block) => {
        const additionalPoints =
          block.id ===
            (document.type === "agreement"
              ? "rent-point-10"
              : "paragraph-7")
            ? document.additionalPoints
                .filter((point) => point.trim())
                .map((point, index) => ({
                  id: `additional-point-${index}`,
                  type: "paragraph" as const,
                  content: `${(document.type === "agreement" ? 11 : 7) + index}. ${sentenceCase(point)}`,
                  align: "justify" as const,
                  fontSize: document.settings.fontSize,
                  bold: false,
                }))
            : [];

        return [block, ...additionalPoints];
      });

      const pageSettings =
        pageIndex === 0
          ? document.settings.firstPage
          : document.settings.otherPages;

      return {
        properties: {
          page: {
            size: {
              width: inchesToTwips(pageSettings.width),
              height: inchesToTwips(pageSettings.height),
            },
            margin: {
              top: inchesToTwips(
                pageIndex === 0
                  ? "6.5in"
                  : document.settings.margins.top
              ),
              right: inchesToTwips(document.settings.margins.right),
              bottom: inchesToTwips(document.settings.margins.bottom),
              left: inchesToTwips(document.settings.margins.left),
            },
          },
        },
        children: blocks.map((block) => createWordParagraph(
          block,
          document.fields,
          pageIndex === 0 ? document.settings.fontSize : 18,
          pageIndex === 0 ? document.settings.lineSpacing : 2
        )),
      };
    });
    const wordDocument = new WordDocument({
      sections,
    });

    void Packer.toBlob(wordDocument).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = globalThis.document.createElement("a");
      link.href = url;
      link.download = `${getDownloadFileName(document)}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const getDownloadFileName = (
    currentDocument: LegalDocument
  ) => {
    const documentName =
      currentDocument.type === "agreement"
        ? "rent-agreement"
        : "gap-certificate";
    const personName =
      currentDocument.type === "agreement"
        ? currentDocument.fields.licensorName
        : currentDocument.fields.applicantName;
    const safeName = (personName || "document")
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();

    return `${documentName}-${safeName || "document"}`;
  };

  const formatPdfSegments = (
    content: string,
    fields: Record<string, string>,
    boldFixedText = false
  ) => content.split(/({{.*?}})/g).map((part) => {
    const match = part.match(/^{{(.*?)}}$/);

    if (!match) {
      return { text: part, bold: boldFixedText };
    }

    const variable = match[1].trim();

    return {
      text: formatPdfField(
        variable,
        fields[variable]?.trim()
      ),
      bold: true,
    };
  });

  const wrapPdfSegments = (
    segments: { text: string; bold: boolean }[],
    width: number,
    pdfDocument: jsPDF,
    fontSize: number
  ) => {
    const words = segments.flatMap((segment) =>
      segment.text.split(/(\s+)/).filter(Boolean).map((text) => ({
        text,
        bold: segment.bold,
      }))
    );
    const lines: { text: string; bold: boolean }[][] = [[]];
    let lineWidth = 0;

    words.forEach((word) => {
      pdfDocument.setFont(
        "times",
        word.bold ? "bold" : "normal"
      );
      pdfDocument.setFontSize(fontSize);
      const wordWidth = pdfDocument.getTextWidth(word.text);

      if (
        lineWidth + wordWidth > width &&
        lines[lines.length - 1].length > 0
      ) {
        lines.push([]);
        lineWidth = 0;
      }

      lines[lines.length - 1].push(word);
      lineWidth += wordWidth;
    });

    return lines;
  };

  const drawPdfSegments = (
    pdfDocument: jsPDF,
    segments: { text: string; bold: boolean }[],
    x: number,
    y: number,
    _options: { align: "left" | "center" | "right"; maxWidth: number },
    align?: "left" | "center" | "right" | "justify"
  ) => {
    const textWidth = segments.reduce((total, segment) => {
      pdfDocument.setFont(
        "times",
        segment.bold ? "bold" : "normal"
      );
      return total + pdfDocument.getTextWidth(segment.text);
    }, 0);
    let currentX =
      align === "center"
        ? x - textWidth / 2
        : align === "right"
          ? x - textWidth
          : x;

    segments.forEach((segment) => {
      pdfDocument.setFont(
        "times",
        segment.bold ? "bold" : "normal"
      );
      pdfDocument.text(segment.text, currentX, y);
      currentX += pdfDocument.getTextWidth(segment.text);
    });
  };

  const formatPdfField = (
    variable: string,
    value: string | undefined
  ) => {
    if (!value) {
      return `{{${variable}}}`;
    }

    if (variable === "agreementDate" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      return `${getOrdinal(day)} DAY OF ${new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(date).toUpperCase()} ${year}`;
    }

    if (
      (variable === "gapFrom" || variable === "gapTo") &&
      /^\d{4}-\d{2}$/.test(value)
    ) {
      const [year, month] = value.split("-").map(Number);

      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(year, month - 1));
    }

    return value;
  };

  const drawJustifiedLine = (
    pdfDocument: jsPDF,
    line: { text: string; bold: boolean }[],
    startX: number,
    y: number,
    width: number
  ) => {
    const words = line.flatMap((segment) =>
      segment.text
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((text) => ({
          text,
          bold: segment.bold,
        }))
    );
    const naturalWidth = words.reduce((total, word) => {
      pdfDocument.setFont(
        "times",
        word.bold ? "bold" : "normal"
      );

      return total + pdfDocument.getTextWidth(word.text);
    }, 0);
    const gapCount = words.length - 1;
    pdfDocument.setFont("times", "normal");
    const spaceWidth = pdfDocument.getTextWidth(" ");
    const extraGap =
      gapCount > 0
        ? (width - naturalWidth - spaceWidth * gapCount) /
          gapCount
        : 0;
    let x = startX;

    words.forEach((word, index) => {
      pdfDocument.setFont(
        "times",
        word.bold ? "bold" : "normal"
      );
      pdfDocument.text(word.text, x, y);
      x += pdfDocument.getTextWidth(word.text);

      if (index < gapCount) {
        x += pdfDocument.getTextWidth(" ") + extraGap;
      }
    });
  };

  const sentenceCase = (value: string) => {
    const normalized = value.trim().toLowerCase();

    return normalized
      ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
      : "";
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark"><FileCheck2 size={19} /></div>
          <div><strong>DocuCraft</strong><span>Legal document studio</span></div>
        </div>
        <div className="header-actions">
          <div className="secure-label"><ShieldCheck size={15} /> Private & secure</div>
          <label className="document-type-picker">
            <span>Document</span>
            <select
              value={document.type}
              onChange={(event) =>
                handleDocumentTypeChange(
                  event.target.value as
                    | "gap-certificate"
                    | "agreement"
                )
              }
            >
              <option value="gap-certificate">Gap certificate</option>
              <option value="agreement">Rent agreement</option>
            </select>
          </label>
          <div className="download-actions">
            <button className="download-button" onClick={handleDownloadPdf}><Download size={16} /> PDF</button>
            <button className="download-button word-button" onClick={handleDownloadWord}>Word</button>
          </div>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          {document.type === "agreement" ? (
            <RentAgreementForm
              document={document}
              onChange={handleFieldChange}
              onAdditionalPointChange={
                handleAdditionalPointChange
              }
              onAddPoint={handleAddPoint}
              onSettingChange={handleSettingChange}
            />
          ) : (
            <GapCertificateForm
              document={document}
              onChange={handleFieldChange}
              onAdditionalPointChange={
                handleAdditionalPointChange
              }
              onAddPoint={handleAddPoint}
              onSettingChange={handleSettingChange}
            />
          )}
        </aside>

        <section className="preview-area">
          <DocumentPreview
            document={document}
            onUpdateBlock={
              handleUpdateBlock
            }
            onDeleteBlock={
              handleDeleteBlock
            }
            onMoveBlock={
              handleMoveBlock
            }
          />
        </section>
      </main>
    </div>
  );
}

export default App;