import type { LegalDocument } from "../types/document";

export const rentAgreementTemplate: LegalDocument = {
  id: "rent-agreement-001",
  type: "agreement",
  title: "Leave and License Agreement",
  fields: {
    agreementDate: "",
    licensorName: "",
    licensorAddress: "",
    licenseeName: "",
    licenseeAddress: "",
    premisesAddress: "",
    duration: "11 months",
    startDate: "",
    endDate: "",
    deposit: "",
    monthlyRent: "",
  },
  additionalPoints: [],
  pages: [
    {
      blocks: [
        {
          id: "heading-1",
          type: "heading",
          content: "LEAVE AND LICENSE",
          align: "center",
          bold: true,
          fontSize: 20,
        },
        {
          id: "rent-intro",
          type: "paragraph",
          content:
            "THIS AGREEMENT OF LEAVE AND LICENSE is made and entered into {{agreementDate}} BETWEEN {{licensorName}}, an adult, Indian inhabitant of {{licensorAddress}}, hereinafter referred to as the LICENSOR (which expression shall mean and include his heirs, executors, administrators and assigns) of the FIRST PART; AND {{licenseeName}}, an adult, Indian inhabitant residing at {{licenseeAddress}}, hereinafter called the LICENSEE (which expression shall mean and include his heirs, executors, administrators and assigns) of the SECOND PART.",
          align: "justify",
          fontSize: 16,
        },
      ],
    },
    {
      blocks: [
        {
          id: "rent-premises",
          type: "paragraph",
          content:
            "WHEREAS the Licensor is the legally and lawfully owner of the premises situated at {{premisesAddress}}, to be used for residential purposes, hereinafter referred to as the SAID PREMISES.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-witness",
          type: "paragraph",
          content: "NOW THEREFORE THIS INDENTURE WITNESSETH AS UNDER:",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-1",
          type: "paragraph",
          content:
            "1. The party of the First Part (Licensor) doth hereby grant and allow the Licensee to use the aforesaid premises for residential purposes for a period of {{duration}}, commencing from {{startDate}} to {{endDate}}. The above-mentioned period is fixed and shall be binding on both parties.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-2",
          type: "paragraph",
          content:
            "2. The Licensee has paid a deposit of Rs. {{deposit}} to the Licensor without any interest.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-3",
          type: "paragraph",
          content:
            "3. The Licensee shall pay the party of the First Part a sum of Rs. {{monthlyRent}} per month as compensation for use and occupation of the said premises.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-4",
          type: "paragraph",
          content:
            "4. The Licensee shall pay the electricity bills for the said premises according to the sub-meter reading.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-5",
          type: "paragraph",
          content:
            "5. On expiry of this agreement, the Licensee shall return possession of the said premises to the Licensor against receipt of the balance security deposit after deduction of the agreed compensation.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-6",
          type: "paragraph",
          content:
            "6. One month's notice shall be required from either party before termination of this agreement.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-7",
          type: "paragraph",
          content:
            "7. The Licensee shall keep the premises clean and shall not conduct any activity that causes nuisance to neighbours.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-8",
          type: "paragraph",
          content:
            "8. The Licensee shall not conduct illegal activities or keep offensive, dangerous, or explosive articles in the premises.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-9",
          type: "paragraph",
          content:
            "9. The Licensee shall not make any alteration, modification, renovation, or extension without written permission from the Licensor.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-point-10",
          type: "paragraph",
          content:
            "10. The Licensor has no objection if the Licensee uses this agreement for personal or professional purposes such as applying for a new gas connection or cylinder, purchasing a vehicle, obtaining a telephone connection, or opening a bank account.",
          align: "justify",
          fontSize: 16,
        },
      ],
    },
    {
      blocks: [
        {
          id: "rent-closing",
          type: "paragraph",
          content:
            "IN WITNESS WHEREOF PARTIES HERETO have hereunto set their respective hands the day and year first hereinabove written.",
          align: "justify",
          fontSize: 16,
        },
        {
          id: "rent-signatures",
          type: "signature",
          content:
            "\n\nSIGNED SEALED AND DELIVERED by the          )\nWITHINNAMED \"LICENSOR\"                         )\n{{licensorName}}                                )\nIn the presence of..........................    )\nWITNESSES:\n1.\n2.\n\n\nSIGNED SEALED AND DELIVERED by the          )\nWITHINNAMED \"LICENSEE\"                         )\nMR. {{licenseeName}}                            )\nIn the presence of ..........                  )\nWITNESSES:\n)\n1.\n2.",
          align: "left",
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
      right: "1in",
      bottom: "1in",
      left: "1.5in",
    },
  },
};
