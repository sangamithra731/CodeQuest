import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Deep navy card with a gold foil-style border and seal — matches the
// app's pixel-lantern theme but reads as a "premium" printed certificate.
export async function generateCertificate({ studentName, languageName, date }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const italic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const navy = rgb(0.05, 0.07, 0.13);
  const gold = rgb(1, 0.79, 0.24);
  const goldDark = rgb(0.71, 0.53, 0.06);
  const parchment = rgb(0.96, 0.95, 0.91);
  const mist = rgb(0.6, 0.65, 0.75);

  // Background
  page.drawRectangle({ x: 0, y: 0, width, height, color: navy });

  // Outer gold border (double-line "premium" frame)
  const margin = 24;
  page.drawRectangle({
    x: margin, y: margin, width: width - margin * 2, height: height - margin * 2,
    borderColor: gold, borderWidth: 3,
  });
  page.drawRectangle({
    x: margin + 10, y: margin + 10, width: width - (margin + 10) * 2, height: height - (margin + 10) * 2,
    borderColor: goldDark, borderWidth: 1,
  });

  // Corner accents (small gold squares, echoing the pixel-art theme)
  const corners = [
    [margin + 4, height - margin - 12],
    [width - margin - 12, height - margin - 12],
    [margin + 4, margin + 4],
    [width - margin - 12, margin + 4],
  ];
  corners.forEach(([x, y]) => {
    page.drawRectangle({ x, y, width: 8, height: 8, color: gold });
  });

  // Eyebrow
  page.drawText("CODEQUEST", {
    x: width / 2 - bold.widthOfTextAtSize("CODEQUEST", 14) / 2,
    y: height - 90, size: 14, font: bold, color: gold,
  });

  // Title
  const title = "Certificate of Completion";
  page.drawText(title, {
    x: width / 2 - bold.widthOfTextAtSize(title, 30) / 2,
    y: height - 140, size: 30, font: bold, color: parchment,
  });

  // Subtext
  const sub = "This certifies that";
  page.drawText(sub, {
    x: width / 2 - regular.widthOfTextAtSize(sub, 13) / 2,
    y: height - 200, size: 13, font: regular, color: mist,
  });

  // Student name (the hero element)
  page.drawText(studentName, {
    x: width / 2 - bold.widthOfTextAtSize(studentName, 34) / 2,
    y: height - 250, size: 34, font: bold, color: gold,
  });

  // Underline beneath the name
  const nameWidth = bold.widthOfTextAtSize(studentName, 34);
  page.drawLine({
    start: { x: width / 2 - nameWidth / 2 - 20, y: height - 262 },
    end: { x: width / 2 + nameWidth / 2 + 20, y: height - 262 },
    thickness: 1, color: goldDark,
  });

  // Body
  const body = `has successfully completed all 20 modules of the ${languageName} track,`;
  page.drawText(body, {
    x: width / 2 - regular.widthOfTextAtSize(body, 14) / 2,
    y: height - 300, size: 14, font: regular, color: parchment,
  });
  const body2 = "passing every quiz with a score of 80% or higher.";
  page.drawText(body2, {
    x: width / 2 - regular.widthOfTextAtSize(body2, 14) / 2,
    y: height - 320, size: 14, font: regular, color: parchment,
  });

  // Date + signature line (bottom)
  page.drawText(`Issued ${date}`, { x: margin + 60, y: margin + 50, size: 11, font: italic, color: mist });
  page.drawLine({ start: { x: width - margin - 220, y: margin + 65 }, end: { x: width - margin - 60, y: margin + 65 }, thickness: 1, color: mist });
  page.drawText("CodeQuest Academy", { x: width - margin - 200, y: margin + 48, size: 11, font: italic, color: mist });

  // Gold seal (simple circular badge, bottom center)
  const sealX = width / 2;
  const sealY = margin + 60;
  page.drawCircle({ x: sealX, y: sealY, size: 26, color: gold });
  page.drawCircle({ x: sealX, y: sealY, size: 26, borderColor: goldDark, borderWidth: 2 });
  page.drawText("★", { x: sealX - 8, y: sealY - 8, size: 16, font: bold, color: navy });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export async function downloadCertificate({ studentName, languageName, date }) {
  const bytes = await generateCertificate({ studentName, languageName, date });
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CodeQuest-${languageName}-Certificate.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}