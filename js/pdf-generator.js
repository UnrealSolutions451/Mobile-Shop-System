// js/pdf-generator.js
export function generateSalePDF(saleData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });

  const W = 148, margin = 14;
  let y = 0;

  // Header background
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, W, 32, 'F');

  // Shop name
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.text('MAX MOBILE SHOP', W/2, 12, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica','normal');
  doc.text('Smart Second-Hand Mobile Store', W/2, 20, { align: 'center' });
  y = 32;

  // Bill info strip
  doc.setFillColor(238, 242, 255);
  doc.rect(0, y, W, 18, 'F');
  doc.setTextColor(79,70,229);
  doc.setFont('helvetica','bold');
  doc.setFontSize(10);
  doc.text(`Bill No: ${saleData.billNumber}`, margin, y+8);
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.text(`Date: ${saleData.dateTime}`, margin, y+14);
  doc.setFont('helvetica','bold');
  doc.text(`PAID`, W-margin, y+8, { align: 'right' });
  doc.setTextColor(16,185,129);
  doc.setFontSize(11);
  doc.text('✓', W-margin-8, y+8);
  y += 22;

  // Customer details
  doc.setTextColor(30,41,59);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('CUSTOMER DETAILS', margin, y);
  y += 5;
  doc.setDrawColor(200,200,200);
  doc.line(margin, y, W-margin, y);
  y += 5;
  doc.setFont('helvetica','normal');
  doc.setFontSize(9);
  doc.text(`Name:   ${saleData.customerName}`, margin, y); y += 6;
  doc.text(`Mobile: ${saleData.customerMobile}`, margin, y); y += 8;

  // Phone details
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('PRODUCT DETAILS', margin, y); y += 5;
  doc.line(margin, y, W-margin, y); y += 5;

  const details = [
    ['Brand & Model', `${saleData.brand} ${saleData.model}`],
    ['IMEI Number', saleData.imei],
    ['RAM / Storage', `${saleData.ram} / ${saleData.storage}`],
    ['Color', saleData.color || '—'],
  ];
  doc.setFont('helvetica','normal');
  details.forEach(([k,v]) => {
    doc.setFont('helvetica','bold'); doc.text(k + ':', margin, y);
    doc.setFont('helvetica','normal'); doc.text(v, margin+38, y);
    y += 6;
  });
  y += 4;

  // Payment breakdown
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('PAYMENT BREAKDOWN', margin, y); y += 5;
  doc.line(margin, y, W-margin, y); y += 5;

  doc.setFont('helvetica','normal');
  if (saleData.payments.cash > 0) {
    doc.text('Cash:', margin, y);
    doc.text(formatINR(saleData.payments.cash), W-margin, y, { align:'right' }); y+=6;
  }
  if (saleData.payments.upi > 0) {
    doc.text('UPI/Online:', margin, y);
    doc.text(formatINR(saleData.payments.upi), W-margin, y, { align:'right' }); y+=6;
  }
  if (saleData.payments.card > 0) {
    doc.text('Card:', margin, y);
    doc.text(formatINR(saleData.payments.card), W-margin, y, { align:'right' }); y+=6;
  }

  // Exchange
  if (saleData.exchange && saleData.exchange.value > 0) {
    y += 2;
    doc.setFillColor(254, 243, 199);
    doc.rect(margin-2, y-4, W-margin*2+4, 20, 'F');
    doc.setTextColor(146,64,14);
    doc.setFont('helvetica','bold');
    doc.text('Exchange Phone:', margin, y); y+=6;
    doc.setFont('helvetica','normal');
    doc.text(`${saleData.exchange.brand} ${saleData.exchange.model} (${saleData.exchange.imei})`, margin, y); y+=6;
    doc.text('Exchange Value:', margin, y);
    doc.text(`- ${formatINR(saleData.exchange.value)}`, W-margin, y, { align:'right' }); y+=8;
    doc.setTextColor(30,41,59);
  }
  y += 2;

  // Total box
  doc.setFillColor(79,70,229);
  doc.rect(margin-2, y-4, W-margin*2+4, 16, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(11);
  doc.text('TOTAL AMOUNT PAID', margin, y+3);
  doc.text(formatINR(saleData.totalPaid), W-margin, y+3, { align:'right' });
  y += 18;

  // Footer
  doc.setTextColor(150,150,150);
  doc.setFont('helvetica','italic');
  doc.setFontSize(8);
  doc.text('Thank you for shopping at Max Mobile Shop!', W/2, y+6, { align:'center' });
  doc.text('All sales are final. Warranty as per terms.', W/2, y+12, { align:'center' });

  doc.save(`Bill-${saleData.billNumber}.pdf`);
}

function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}