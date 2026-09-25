import { jsPDF } from 'jspdf';

/**
 * Generate a professional CampusHub event admission ticket PDF.
 * @param {Object} ticketData - Registration + event + student data from backend
 * @param {HTMLCanvasElement|string} qrCanvas - Canvas element or Data URL containing the QR code
 */
export function generateTicketPDF(ticketData, qrCanvas) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primary = [79, 70, 229];     // indigo-600
  const darkGray = [31, 41, 55];     // gray-800
  const medGray = [107, 114, 128];   // gray-500
  const lightBg = [249, 250, 251];   // gray-50

  const cardTop = 10;
  let y = cardTop + 12;

  // ── CampusHub Branding ──
  doc.setFillColor(...primary);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CampusHub', pageWidth / 2, y + 12, { align: 'center' });
  y += 24;

  // ── Ticket Title ──
  doc.setTextColor(...darkGray);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EVENT ADMISSION TICKET', pageWidth / 2, y, { align: 'center' });
  y += 5;

  // ── Decorative line ──
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.8);
  doc.line(margin + 30, y, pageWidth - margin - 30, y);
  y += 9;

  // ── Ticket ID (prominent) ──
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + 20, y - 4, contentWidth - 40, 13, 2, 2, 'F');
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 20, y - 4, contentWidth - 40, 13, 2, 2, 'S');
  doc.setTextColor(...primary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Ticket ID: ${ticketData.ticket_id || 'N/A'}`, pageWidth / 2, y + 4.5, { align: 'center' });
  y += 16;

  // ── Event Information Section ──
  doc.setTextColor(...primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EVENT INFORMATION', margin + 2, y);
  y += 2;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  const addField = (label, value, x = margin + 2) => {
    doc.setTextColor(...medGray);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y);
    doc.setTextColor(...darkGray);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    // Handle long text with wrapping
    const maxWidth = contentWidth - 10;
    const lines = doc.splitTextToSize(String(value || 'N/A'), maxWidth);
    doc.text(lines, x, y + 4.5);
    y += 4.5 + (lines.length * 4.5);
  };

  addField('Event Title', ticketData.event_title);
  if (ticketData.event_category) {
    addField('Category', ticketData.event_category);
  }
  
  const eventDate = ticketData.event_date ? new Date(ticketData.event_date) : null;
  if (eventDate) {
    addField('Date', eventDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    addField('Time', eventDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
  }
  addField('Location', ticketData.event_location);

  y += 4;

  // ── Student Information Section ──
  doc.setTextColor(...primary);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTENDEE INFORMATION', margin + 2, y);
  y += 2;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  addField('Name', ticketData.student_name);
  addField('Email', ticketData.student_email);
  addField('Student ID', `USR-${String(ticketData.user_id || 1).padStart(4, '0')}`);
  if (ticketData.student_department) {
    addField('Department', ticketData.student_department);
  }
  
  const regDate = ticketData.registered_at ? new Date(ticketData.registered_at) : new Date();
  addField('Registration Date', regDate.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }));

  y += 4;

  // ── QR Code Section ──
  if (qrCanvas) {
    const qrSize = 36;
    const qrX = pageWidth / 2 - qrSize / 2;
    try {
      const qrDataUrl = typeof qrCanvas === 'string' ? qrCanvas : (qrCanvas.toDataURL ? qrCanvas.toDataURL('image/png') : qrCanvas);
      
      // QR background box
      doc.setFillColor(...lightBg);
      doc.roundedRect(qrX - 5, y - 2, qrSize + 10, qrSize + 15, 2, 2, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.roundedRect(qrX - 5, y - 2, qrSize + 10, qrSize + 15, 2, 2, 'S');
      
      doc.addImage(qrDataUrl, 'PNG', qrX, y, qrSize, qrSize);
      
      doc.setTextColor(...medGray);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Scan for verification', pageWidth / 2, y + qrSize + 5.5, { align: 'center' });
      y += qrSize + 18;
    } catch (e) {
      console.error('QR code render error:', e);
      y += 5;
    }
  }

  // ── Footer Instruction ──
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.4);
  doc.line(margin + 10, y, pageWidth - margin - 10, y);
  y += 5.5;
  doc.setTextColor(...medGray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('Please present this ticket and QR code at the event entrance for admission.', pageWidth / 2, y, { align: 'center' });
  y += 4.5;
  doc.text('This ticket is non-transferable and valid for one time entry only.', pageWidth / 2, y, { align: 'center' });
  y += 4.5;

  // ── Dynamic Container Heights & Borders ──
  const bottomPadding = 12; // Generous bottom padding inside rounded border
  const minCardHeight = 240;
  const calculatedHeight = (y + bottomPadding) - cardTop;
  const ticketHeight = Math.max(calculatedHeight, minCardHeight);

  // Outer border (primary color)
  doc.setDrawColor(...primary);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin - 5, cardTop, contentWidth + 10, ticketHeight, 4, 4);

  // Inner border (light gray)
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin - 2, cardTop + 3, contentWidth + 4, ticketHeight - 6, 3, 3);

  // ── Save or Return ──
  const fileName = `CampusHub-Ticket-${ticketData.ticket_id || ticketData.id}.pdf`;
  if (typeof window !== 'undefined' && doc.save) {
    doc.save(fileName);
  }
  return doc;
}
