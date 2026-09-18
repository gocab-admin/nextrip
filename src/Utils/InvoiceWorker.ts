// import fs from 'fs';
import PDFDocument from 'pdfkit';
import { parentPort, workerData } from 'worker_threads';
import { Buffer } from 'buffer';
import { Config } from '@abserve/Config/AppConfig';


function generateHeader(document: PDFKit.PDFDocument) {
  document
    .fillColor('#444444')
    .font('Helvetica-Bold')
    .fontSize(40)
    .text(Config.app.appName, 50, 45);
}

function generateTableRow(document: PDFKit.PDFDocument, y: number, item: string, amount: string) {
  document.fontSize(10).text(item, 50, y).text(amount, 0, y, { align: 'right' });
}

function generateHr(document: PDFKit.PDFDocument, y: number) {
  document.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}


function formatBookingDate(dateString: any) {
  const date = new Date(dateString);
  const offsetMilliseconds = (5 * 60 + 30) * 60 * 1000; 
  const adjustedDate = new Date(date.getTime() + offsetMilliseconds);
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return adjustedDate.toLocaleDateString('en-US', options);
}


function generateBasicDetails(document: PDFKit.PDFDocument, invoice: any) {
  const address = invoice.listing.address;
  const addressLine1 = address.address; 
  const addressLine2 = `${address.city}, ${address.state}`; 
  const addressLine3 = `${address.country} ${address.zipcode}`;
  const startDate = formatBookingDate(invoice.startDate);
  const endDate = formatBookingDate(invoice.endDate);

  document
    .fillColor('#444444')
    .fontSize(20)
    .text('Booking No:' + invoice.bookingNo, 50, 160)
    .fontSize(10)
    .text(invoice.createdAt, 200, 160, { align: 'right' })
    .moveDown();

  generateHr(document, 185);

  const customerInformationTop = 200;

  document
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(invoice.listing.name, 50, customerInformationTop)
    .font('Helvetica')
    .text(addressLine1, 50, customerInformationTop + 15) 
    .text(addressLine2, 50, customerInformationTop + 30) 
    .text(addressLine3, 50, customerInformationTop + 45) 
    .moveDown();

  document
    .moveDown()
    .fontSize(10)
    .font('Helvetica')
    .text('Booking Dates: ' + startDate + ' to ' + endDate, 50, customerInformationTop + 60)
    .moveDown();

    const guestAndHostTop = customerInformationTop + 80;
    document
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Guest Name: ' + invoice.userFullname, 50, guestAndHostTop)
      .moveDown()
      .text('Host Name: ' + invoice.providerFullname, 50, guestAndHostTop + 15)
      .moveDown();
  }

  // generateHr(document, 252);

function generateInvoiceTable(document: PDFKit.PDFDocument, invoice: any) {
  const invoiceTableTop = 330;

  document
    .fillColor('#444444')
    .fontSize(20)
    //.text('Booking No:' + invoice.bookingNo, 50, 160);

  document.font('Helvetica-Bold');
  generateTableRow(
    document,
    invoiceTableTop,
    'Total Amount',
    invoice.paymentMode + ' / ' + invoice.currency + ' ' + invoice.totalFare
  );
  generateHr(document, invoiceTableTop + 20);
  document.font('Helvetica');

  invoice.items.forEach((item: { item: string; value: string }, i: number) => {
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(document, position, item.item, invoice.currency + ' ' + item.value);
  });
}

function generateFooter(document: PDFKit.PDFDocument) {
  document
    .fontSize(10)
    .text('Thank you for being our Guest, if any clarification please check in website.', 50, 780, {
      align: 'center',
      width: 500,
    });
}

const generateInvoice = async (): Promise<{ buffer?: Buffer; error?: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const document = new PDFDocument({ size: 'A4', margin: 50 });
      const { invoice = {} } = workerData;
      const buffers: Buffer[] = [];
      document.on('data', (chunk) => buffers.push(chunk));
      document.on('end', () => {
        const buffer = Buffer.concat(buffers);
        resolve({ buffer });
      });

      generateHeader(document);
      generateBasicDetails(document, invoice);
      generateInvoiceTable(document, invoice);
      generateFooter(document);

      document.end();
    } catch (error) {
      reject(new Error(error))
    }
  });
};

generateInvoice()
  .then((result) => {
    parentPort?.postMessage(result);
  })
  .catch((error) => {
    console.error('GENERATEINVOICE_WORKER_ERROR', error);
    parentPort?.postMessage({ error: error.error });
  });
