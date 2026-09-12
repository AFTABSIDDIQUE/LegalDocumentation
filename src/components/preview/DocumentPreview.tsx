import { useState } from "react";
import type { ReactNode } from "react";

import type {
  LegalDocument,
  DocumentBlock,
} from "../../types/document";

interface DocumentPreviewProps {
  document: LegalDocument;

  onUpdateBlock: (
    blockId: string,
    content: string
  ) => void;

  onDeleteBlock: (blockId: string) => void;

  onMoveBlock: (
    blockId: string,
    direction: "up" | "down"
  ) => void;
}

function renderVariables(
  content: string,
  fields: Record<string, string>
): ReactNode {
  const parts = content.split(/({{.*?}})/g);

  return parts.map((part, index) => {
    const match = part.match(/^{{(.*?)}}$/);

    if (!match) {
      return part;
    }

    const variable = match[1].trim();
    const value = formatFieldValue(
      variable,
      fields[variable]
    );

    return (
      <strong key={`${variable}-${index}`}>{value}</strong>
    );
  });
}

function formatFieldValue(
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

function sentenceCase(value: string) {
  const normalized = value.trim().toLowerCase();

  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "";
}

function EditableBlock({
  block,
  fields,
  onUpdate,
  onDelete,
  onMove,
  fontSize,
  lineSpacing,
}: {
  block: DocumentBlock;
  fields: Record<string, string>;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onMove: (direction: "up" | "down") => void;
  fontSize: number;
  lineSpacing: number;
}) {
  const [editing, setEditing] = useState(false);

  const [editedContent, setEditedContent] =
    useState(block.content);

  const displayContent = renderVariables(
    block.content,
    fields
  );

  const style: React.CSSProperties = {
    textAlign: block.align || "left",
    fontSize: `${block.type === "heading" ? block.fontSize || 18 : fontSize}px`,
    fontWeight: block.bold ? "bold" : "normal",
    fontStyle: block.italic ? "italic" : "normal",
    lineHeight: lineSpacing,
    fontFamily: '"Times New Roman", serif',
    textDecoration: block.type === "heading" ? "underline" : "none",
    whiteSpace: "pre-line",
  };

  const startEditing = () => {
    setEditedContent(block.content);
    setEditing(true);
  };

  const saveChanges = () => {
    onUpdate(editedContent);
    setEditing(false);
  };

  const cancelChanges = () => {
    setEditedContent(block.content);
    setEditing(false);
  };

  if (block.type === "heading") {
    return (
      <div className="editable-block">
        <div className="block-toolbar">
          <button onClick={() => onMove("up")}>
            ↑
          </button>

          <button onClick={() => onMove("down")}>
            ↓
          </button>

          <button onClick={startEditing}>
            ✏️
          </button>

          <button onClick={onDelete}>
            🗑
          </button>
        </div>

        {editing ? (
          <div>
            <input
              className="edit-input"
              value={editedContent}
              onChange={(e) =>
                setEditedContent(e.target.value)
              }
              style={style}
            />

            <div className="edit-actions">
              <button onClick={saveChanges}>
                Save
              </button>

              <button onClick={cancelChanges}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <h1
            className="document-heading"
            style={style}
            onDoubleClick={startEditing}
          >
            {displayContent}
          </h1>
        )}
      </div>
    );
  }

  if (block.type === "paragraph") {
    const isNumberedPoint = /^\d+\.\s/.test(block.content);

    return (
      <div
        className={`editable-block ${
          block.id.startsWith("additional-point-")
            ? "additional-point-block"
            : isNumberedPoint
              ? "numbered-point-block"
              : ""
        } ${
          block.id === "rent-point-1" ? "first-rent-point-block" : ""
        }`}
      >
        <div className="block-toolbar">
          <button onClick={() => onMove("up")}>
            ↑
          </button>

          <button onClick={() => onMove("down")}>
            ↓
          </button>

          <button onClick={startEditing}>
            ✏️ Edit
          </button>

          <button onClick={onDelete}>
            🗑 Delete
          </button>
        </div>

        {editing ? (
          <div className="editor-box">
            <textarea
              className="edit-textarea"
              value={editedContent}
              onChange={(e) =>
                setEditedContent(e.target.value)
              }
              style={style}
              rows={6}
              autoFocus
            />

            <div className="edit-actions">
              <button
                className="save-button"
                onClick={saveChanges}
              >
                Save
              </button>

              <button
                className="cancel-button"
                onClick={cancelChanges}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p
            className="document-paragraph"
            style={style}
            onDoubleClick={startEditing}
          >
            {displayContent}
          </p>
        )}
      </div>
    );
  }

  if (block.type === "signature") {
    return (
      <div className="editable-block">
        <div className="block-toolbar">
          <button onClick={() => onMove("up")}>
            ↑
          </button>

          <button onClick={() => onMove("down")}>
            ↓
          </button>

          <button onClick={startEditing}>
            ✏️
          </button>

          <button onClick={onDelete}>
            🗑
          </button>
        </div>

        {editing ? (
          <div>
            <input
              className="edit-input"
              value={editedContent}
              onChange={(e) =>
                setEditedContent(e.target.value)
              }
              style={style}
            />

            <div className="edit-actions">
              <button onClick={saveChanges}>
                Save
              </button>

              <button onClick={cancelChanges}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="document-signature"
            style={style}
            onDoubleClick={startEditing}
          >
            {displayContent}
          </div>
        )}
      </div>
    );
  }

  return null;
}

export default function DocumentPreview({
  document,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}: DocumentPreviewProps) {
  return (
    <div className="preview-container">
      {document.pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className={`document-page ${
            pageIndex === 0
              ? "first-page"
              : "legal-page"
          }`}
          style={{
            width:
              pageIndex === 0
                ? document.settings.firstPage.width
                : document.settings.otherPages.width,
            minHeight:
              pageIndex === 0
                ? document.settings.firstPage.height
                : document.settings.otherPages.height,
          }}
        >
          {page.blocks.map((block) => {
            const blockElement = (
              <EditableBlock
                key={block.id}
                block={block}
                fields={document.fields}
                onUpdate={(content) =>
                  onUpdateBlock(block.id, content)
                }
                onDelete={() => onDeleteBlock(block.id)}
                onMove={(direction) =>
                  onMoveBlock(block.id, direction)
                }
                fontSize={
                  pageIndex === 0
                    ? document.settings.fontSize
                    : 18
                }
                lineSpacing={
                  pageIndex === 0
                    ? document.settings.lineSpacing
                    : 2
                }
              />
            );

            const additionalPointAnchor =
              document.type === "agreement"
                ? "rent-point-10"
                : "paragraph-7";

            if (block.id !== additionalPointAnchor) {
              return blockElement;
            }

            return (
              <div key={block.id}>
                {blockElement}
                {document.additionalPoints.map((point, index) => {
                  if (!point.trim()) {
                    return null;
                  }

                  const pointNumber =
                    (document.type === "agreement" ? 11 : 7) +
                    document.additionalPoints
                      .slice(0, index)
                      .filter((additionalPoint) =>
                        additionalPoint.trim()
                      ).length;

                  return (
                    <EditableBlock
                      key={`additional-point-${index}`}
                      block={{
                        id: `additional-point-${index}`,
                        type: "paragraph",
                        content: `${pointNumber}. ${sentenceCase(point)}`,
                        align: "justify",
                        fontSize: 14,
                      }}
                      fields={document.fields}
                      onUpdate={() => undefined}
                      onDelete={() => undefined}
                      onMove={() => undefined}
                      fontSize={
                        pageIndex === 0
                          ? document.settings.fontSize
                          : 18
                      }
                      lineSpacing={
                        pageIndex === 0
                          ? document.settings.lineSpacing
                          : 2
                      }
                    />
                  );
                })}
              </div>
            );
          })}

          <div className="page-number">
            Page {pageIndex + 1}
          </div>
        </div>
      ))}
    </div>
  );
}