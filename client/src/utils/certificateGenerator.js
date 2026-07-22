import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Generates a certificate PDF matching a modern "faceted ribbon" style:
 * near-black background, a diagonal band of angular gold/bronze facets
 * (including a halftone dot facet) sweeping from the top edge into the
 * right side, a gold medallion with striped ribbon tails tucked into the
 * facets, and left-aligned title/name/body copy with a simple date &
 * signature footer.
 */
export async function generateCertificate({
  studentName = "Name Surname",
  courseName = "CodeQuest Course",
  dateStr = "00 / 00 / 0000",
} = {}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const { width: W, height: H } = page.getSize();

  // Convert a "distance from top" y into PDF's bottom-up y.
  const fromTop = (y) => H - y;

  // ---------------------------------------------------------------------
  // Palette
  // ---------------------------------------------------------------------
  const black = rgb(0.067, 0.063, 0.067);
  const nearBlack = rgb(0.11, 0.1, 0.095);
  const bronzeDark = rgb(0.16, 0.11, 0.05);
  const bronzeMid = rgb(0.36, 0.26, 0.11);
  const goldMid = rgb(0.56, 0.43, 0.18);
  const gold = rgb(0.78, 0.62, 0.28);
  const goldBright = rgb(0.93, 0.79, 0.46);
  const goldDim = rgb(0.5, 0.4, 0.22);
  const white = rgb(0.97, 0.97, 0.96);
  const grey = rgb(0.64, 0.64, 0.62);
  const greyDim = rgb(0.46, 0.46, 0.45);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: black });

  // ---------------------------------------------------------------------
  // Diagonal facet ribbon (top edge -> right edge)
  // Built as parallel bands along one centerline, expressed in a local
  // (s = along-line, t = across-line) coordinate system for simplicity.
  // ---------------------------------------------------------------------
  const P0 = { x: 0.40 * W, y: fromTop(-40) };
  const P1 = { x: 1.08 * W, y: fromTop(0.70 * H) };
  const dx = P1.x - P0.x;
  const dy = P1.y - P0.y;
  const len = Math.hypot(dx, dy);
  const u = { x: dx / len, y: dy / len }; // along the ribbon
  const n = { x: -u.y, y: u.x }; // across the ribbon

  const at = (s, t) => ({ x: P0.x + u.x * s + n.x * t, y: P0.y + u.y * s + n.y * t });

  const drawBand = (cOffset, halfWidth, color, opacity = 1) => {
    const sExtra = 260; // extend past both ends so page edges are covered
    const a = at(-sExtra, cOffset - halfWidth);
    const b = at(len + sExtra, cOffset - halfWidth);
    const c = at(len + sExtra, cOffset + halfWidth);
    const d = at(-sExtra, cOffset + halfWidth);
    page.drawSvgPath(`M${a.x},${a.y} L${b.x},${b.y} L${c.x},${c.y} L${d.x},${d.y} Z`, {
      x: 0, y: 0, color, opacity,
    });
  };

  drawBand(-125, 60, bronzeDark);
  drawBand(-58, 34, bronzeMid);
  drawBand(-14, 16, gold);
  drawBand(18, 20, nearBlack);
  drawBand(52, 22, goldMid);
  drawBand(82, 55, black, 0.001); // reset gap to base black before the dot facet
  drawBand(120, 78, bronzeDark);
  drawBand(190, 60, goldMid);

  // Bright highlight seams along a couple of band edges
  [-14 - 16, -14 + 16, 52 - 22, 52 + 22].forEach((t) => {
    const a = at(-260, t);
    const b = at(len + 260, t);
    page.drawSvgPath(`M${a.x},${a.y} L${b.x},${b.y}`, {
      x: 0, y: 0, borderColor: goldBright, borderWidth: 1, opacity: 0.55,
    });
  });

  // Halftone dot facet layered on top of the bronzeDark band around t=120
  const dotSpacing = 7.2;
  for (let s = -40; s < len + 40; s += dotSpacing) {
    for (let t = 88; t < 156; t += dotSpacing) {
      // stagger alternate rows for a natural halftone feel
      const row = Math.round((t - 88) / dotSpacing);
      const ss = s + (row % 2 === 0 ? 0 : dotSpacing / 2);
      const p = at(ss, t);
      if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
      const fade = 0.35 + 0.4 * Math.random();
      page.drawCircle({ x: p.x, y: p.y, size: 1.1, color: goldBright, opacity: fade });
    }
  }

  // ---------------------------------------------------------------------
  // Medallion badge with striped ribbon tails, seated in the facet band
  // ---------------------------------------------------------------------
  const bx = 0.855 * W;
  const by = fromTop(0.185 * H);
  const bR = 46;

  // Ribbon tails (striped gold/dark), drawn first so the medal sits on top
  [-1, 1].forEach((side) => {
    const angle = side * 12;
    const tailPath = `M-11,-4 L11,-4 L11,58 L0,44 L-11,58 Z`;
    page.drawSvgPath(tailPath, {
      x: bx + side * 15, y: by - bR - 4, color: gold,
      rotate: { type: "degrees", angle },
    });
    // dark diagonal stripes on the tail
    for (let i = -2; i <= 6; i++) {
      const stripe = `M${-11 + i * 6},-4 L${-11 + i * 6 + 10},58`;
      page.drawSvgPath(stripe, {
        x: bx + side * 15, y: by - bR - 4, borderColor: bronzeDark, borderWidth: 3,
        opacity: 0.55, rotate: { type: "degrees", angle },
      });
    }
  });

  page.drawCircle({ x: bx, y: by, size: bR, color: gold });
  page.drawCircle({ x: bx, y: by, size: bR, borderColor: goldBright, borderWidth: 1.4 });
  page.drawCircle({ x: bx, y: by, size: bR - 8, color: nearBlack });
  page.drawCircle({ x: bx, y: by, size: bR - 8, borderColor: gold, borderWidth: 1 });
  page.drawCircle({ x: bx, y: by, size: bR - 14, borderColor: goldDim, borderWidth: 0.6 });

  // small dots ringing the inner circle
  for (let i = 0; i < 16; i++) {
    const a = (i * 22.5 * Math.PI) / 180;
    page.drawCircle({
      x: bx + (bR - 11) * Math.sin(a), y: by + (bR - 11) * Math.cos(a),
      size: 0.8, color: goldBright, opacity: 0.85,
    });
  }

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const drawCenteredAt = (text, cx, y, size, font, color) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: cx - w / 2, y, size, font, color });
  };
  drawCenteredAt("Code", bx, by + 6, 8.5, fontBold, goldBright);
  drawCenteredAt("Quest", bx, by - 8, 6.5, fontBold, goldBright);

  // ---------------------------------------------------------------------
  // Left-aligned text block
  // ---------------------------------------------------------------------
  const leftX = 64;
  const spacedText = (text, x, y, size, font, color, spacing) => {
    let cx = x;
    for (const ch of text) {
      page.drawText(ch, { x: cx, y, size, font, color });
      cx += font.widthOfTextAtSize(ch, size) + spacing;
    }
    return cx - spacing;
  };

  page.drawText("CERTIFICATE", { x: leftX, y: fromTop(105), size: 34, font: fontBold, color: white });
  spacedText("OF APPRECIATION", leftX + 2, fromTop(132), 14, fontRegular, gold, 3);
  page.drawLine({
    start: { x: leftX + 2, y: fromTop(144) }, end: { x: leftX + 82, y: fromTop(144) },
    thickness: 1.2, color: gold,
  });

  spacedText("PROUDLY PRESENTED TO", leftX, fromTop(188), 9.5, fontRegular, grey, 2.2);

  page.drawText(studentName, { x: leftX, y: fromTop(238), size: 42, font: fontItalic, color: goldBright });

  spacedText(courseName.toUpperCase(), leftX + 2, fromTop(268), 11, fontBold, white, 1.1);

  const bodyText =
  "This is to proudly announce that the recipient has successfully completed all course requirements and demonstrated the knowledge and skills necessary to earn this certification. We congratulate them on this remarkable achievement and wish them continued success in their future endeavors.";
  const bodySize = 8.5;
  const bodyLineHeight = 13;
  const bodyMaxWidth = 460;
  const words = bodyText.split(" ");
  let line = "";
  let lineY = fromTop(300);
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (fontRegular.widthOfTextAtSize(test, bodySize) > bodyMaxWidth) {
      page.drawText(line, { x: leftX, y: lineY, size: bodySize, font: fontRegular, color: grey });
      line = word;
      lineY -= bodyLineHeight;
    } else {
      line = test;
    }
  }
  if (line) page.drawText(line, { x: leftX, y: lineY, size: bodySize, font: fontRegular, color: grey });

  // ---------------------------------------------------------------------
  // Footer: DATE / SIGNATURE
  // ---------------------------------------------------------------------
  const footerY = fromTop(0.735 * H);
  const drawFooterField = (label, value, x, w) => {
    page.drawLine({ start: { x, y: footerY }, end: { x: x + w, y: footerY }, thickness: 1, color: greyDim });
    if (value) {
      const fw = fontRegular.widthOfTextAtSize(value, 11);
      page.drawText(value, { x: x + (w - fw) / 2, y: footerY + 8, size: 11, font: fontRegular, color: white });
    }
    const lw = fontRegular.widthOfTextAtSize(label, 8);
    page.drawText(label, { x: x + (w - lw) / 2, y: footerY - 16, size: 8, font: fontRegular, color: greyDim });
  };
  drawFooterField("DATE", dateStr, leftX + 40, 130);
  drawFooterField("SIGNATURE", "", leftX + 300, 150);

  const pdfBytes = await pdfDoc.save();

  // Browser-only download helper — safe to call in Node too, guarded.
  if (typeof document !== "undefined" && typeof Blob !== "undefined") {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${studentName.replace(/\s+/g, "_")}_Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return pdfBytes;
}