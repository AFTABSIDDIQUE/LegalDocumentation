export type DocumentType =
  | "affidavit"
  | "agreement"
  | "gap-certificate"
  | "undertaking"
  | "declaration";

export type BlockType =
  | "heading"
  | "paragraph"
  | "list"
  | "signature"
  | "spacer";

export interface DocumentBlock {
  id: string;
  type: BlockType;
  content: string;
  align?: "left" | "center" | "right" | "justify";
  fontSize?: number;
  bold?: boolean;
  italic?: boolean;
}

export interface DocumentPage {
  blocks: DocumentBlock[];
}

export interface LegalDocument {
  id: string;
  type: DocumentType;
  title: string;

  fields: Record<string, string>;

  additionalPoints: string[];

  pages: DocumentPage[];

  settings: {
    fontFamily: string;
    fontSize: number;
    lineSpacing: number;

    firstPage: {
      width: string;
      height: string;
      stampPaper: boolean;
    };

    otherPages: {
      width: string;
      height: string;
    };

    margins: {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
  };
}