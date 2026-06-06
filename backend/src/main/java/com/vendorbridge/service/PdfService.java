package com.vendorbridge.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.vendorbridge.entity.Invoice;
import com.vendorbridge.entity.InvoiceItem;
import com.vendorbridge.entity.PoItem;
import com.vendorbridge.entity.PurchaseOrder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public byte[] generatePoPdf(PurchaseOrder po) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("PURCHASE ORDER", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            // Info
            document.add(new Paragraph("PO Number: " + po.getPoNumber()));
            document.add(new Paragraph("Date: " + po.getPoDate()));
            document.add(new Paragraph("Vendor: " + po.getVendor().getCompanyName()));
            document.add(Chunk.NEWLINE);

            // Items Table
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.addCell("Item");
            table.addCell("Description");
            table.addCell("Qty");
            table.addCell("Unit Price");
            table.addCell("Total");

            for (PoItem item : po.getItems()) {
                table.addCell(item.getItemName());
                table.addCell(""); // No description in PoItem
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(item.getUnitPrice().toString());
                table.addCell(item.getTotalPrice().toString());
            }
            document.add(table);
            document.add(Chunk.NEWLINE);

            // Totals
            Paragraph totals = new Paragraph();
            totals.setAlignment(Element.ALIGN_RIGHT);
            totals.add("Subtotal: " + po.getSubtotal() + "\n");
            totals.add("Tax: " + po.getTaxAmount() + "\n");
            totals.add("Grand Total: " + po.getGrandTotal());
            document.add(totals);

            document.close();
            return baos.toByteArray();
        }
    }

    public byte[] generateInvoicePdf(Invoice invoice) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph("Invoice Number: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));
            document.add(new Paragraph("Due Date: " + invoice.getDueDate()));
            document.add(new Paragraph("Vendor: " + invoice.getVendor().getCompanyName()));
            document.add(new Paragraph("PO Number: " + invoice.getPurchaseOrder().getPoNumber()));
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.addCell("Item");
            table.addCell("Qty");
            table.addCell("Unit Price");
            table.addCell("Total");

            for (InvoiceItem item : invoice.getItems()) {
                table.addCell(item.getItemName());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(item.getUnitPrice().toString());
                table.addCell(item.getTotalPrice().toString());
            }
            document.add(table);
            document.add(Chunk.NEWLINE);

            Paragraph totals = new Paragraph();
            totals.setAlignment(Element.ALIGN_RIGHT);
            totals.add("Subtotal: " + invoice.getSubtotal() + "\n");
            totals.add("IGST: " + invoice.getIgst() + "\n");
            totals.add("Grand Total: " + invoice.getGrandTotal());
            document.add(totals);

            document.close();
            return baos.toByteArray();
        }
    }
}
