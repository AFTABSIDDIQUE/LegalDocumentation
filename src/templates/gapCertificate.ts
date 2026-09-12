import type { LegalDocument } from "../types/document";

export const gapCertificateTemplate: LegalDocument = {
  id: "gap-certificate-001",

  type: "gap-certificate",

  title: "Gap Certificate",

  fields: {
    applicantName: "",
    age: "",
    parentName: "",
    address: "",
    qualification: "",
    completionDate: "",
    institution: "",
    gapFrom: "",
    gapTo: "",
    place: "",
    date: "",
  },

  additionalPoints: [],

  pages: [
    {
      blocks: [
        {
          id: "heading-1",
          type: "heading",
          content: "GAP CERTIFICATE",
          align: "center",
          bold: true,
          fontSize: 20,
        },

        {
          id: "paragraph-1",
          type: "paragraph",
          content:
            "I, {{applicantName}}, aged {{age}} years, son/daughter of {{parentName}}, residing at {{address}}, do hereby solemnly affirm and declare as under:",
          align: "justify",
          fontSize: 16,
        },

      ],
    },
    {
      blocks: [
        {
          id: "paragraph-2",
          type: "paragraph",
          content:
            "1. That I have successfully completed my {{qualification}} (last educational qualification) in {{completionDate}} from {{institution}} (name of school/college/university).",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "paragraph-3",
          type: "paragraph",
          content:
            "2. That I had a gap in my education for a period of one month, from {{gapFrom}} to {{gapTo}}.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "paragraph-4",
          type: "paragraph",
          content:
            "3. That the said gap period was due to financial difficulties / financial reasons, because of which I was unable to continue my education during the said period.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "paragraph-5",
          type: "paragraph",
          content:
            "4. That during the aforesaid gap period, I did not take admission in or attend any other educational institution.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "paragraph-6",
          type: "paragraph",
          content:
            "5. That I am submitting this Gap Certificate to the concerned College/University authorities as proof and explanation of my educational gap period.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "paragraph-7",
          type: "paragraph",
          content:
            "6. I hereby declare that the information stated above is true and correct to the best of my knowledge and belief, and nothing material has been concealed.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "signature-1",
          type: "signature",
          content: "\n\n\n ______________________ \n\n{{applicantName}}",
          align: "right",
          fontSize: 16,
        },
      ],
    },
  ],

  settings: {
    fontFamily: "Times New Roman",
    fontSize: 16,
    lineSpacing: 1.5,

    firstPage: {
      width: "8.27in",
      height: "11.69in",
      stampPaper: false,
    },

    otherPages: {
      width: "8.5in",
      height: "14in",
    },

    margins: {
      top: "1in",
      right: "0.5in",
      bottom: "1in",
      left: "1in",
    },
  },
};