/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

package com.budgetwise.service;

import com.budgetwise.dto.PredictionDto;
import com.budgetwise.entity.Budget;
import com.budgetwise.entity.SavingsGoal;
import com.budgetwise.entity.Transaction;
import com.budgetwise.repository.CategoryRepository;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class PdfReportGenerator {

    private final ChartGeneratorService chartGenerator;
    private final DashboardService dashboardService;
    private final CategoryRepository categoryRepository;

    public PdfReportGenerator(ChartGeneratorService chartGenerator, DashboardService dashboardService,
            CategoryRepository categoryRepository) {
        this.chartGenerator = chartGenerator;
        this.dashboardService = dashboardService;
        this.categoryRepository = categoryRepository;
    }

    public byte[] generateDashboardPdf(Long userId, List<Transaction> transactions, List<Budget> budgets,
            List<SavingsGoal> goals) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4, false);
            document.setMargins(40, 40, 40, 40);

            addCoverPage(document, "Dashboard Report");
            document.add(new AreaBreak());

            addSectionHeader(document, "Executive Summary");
            addSummaryTable(document, transactions);

            addSectionHeader(document, "Financial Trends");
            try {
                var monthlyTrends = dashboardService.getMonthlyTrends(userId, 6);
                if (!monthlyTrends.isEmpty()) {
                    BufferedImage trendChart = chartGenerator.generateTrendChart(monthlyTrends, 800, 400);
                    addChartImage(document, trendChart);
                }
            } catch (Exception e) {
                System.err.println("Error generating trend chart: " + e.getMessage());
            }

            addSectionHeader(document, "Expense Breakdown");
            try {
                var categoryBreakdown = dashboardService.getCategoryBreakdown(userId, 6);
                if (!categoryBreakdown.isEmpty()) {
                    BufferedImage pieChart = chartGenerator.generateCategoryPieChart(categoryBreakdown, 600, 400);
                    addChartImage(document, pieChart);
                }
            } catch (Exception e) {
                System.err.println("Error generating category chart: " + e.getMessage());
            }

            addSectionHeader(document, "Budget Performance");
            addBudgetsTable(document, budgets);

            addSectionHeader(document, "Savings Goals");
            addGoalsTable(document, goals);

            addSectionHeader(document, "Recent Transactions (Last 10)");
            addTransactionsTable(document, transactions.stream().limit(10).toList());

            addFooter(document, pdf);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println("ERROR generating Dashboard PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate Dashboard PDF", e);
        }
    }

    public byte[] generateAnalyticsPdf(Long userId, List<Transaction> transactions, String timeRange,
            List<PredictionDto> predictions) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4, false);
            document.setMargins(40, 40, 40, 40);

            addCoverPage(document, "Analytics Report (" + timeRange + ")");
            document.add(new AreaBreak());

            int months = parseTimeRangeToMonths(timeRange);

            addSectionHeader(document, "Trend Analysis");
            try {
                var monthlyTrends = dashboardService.getMonthlyTrends(userId, months);
                if (!monthlyTrends.isEmpty()) {
                    BufferedImage trendChart = chartGenerator.generateTrendChart(monthlyTrends, 800, 400);
                    addChartImage(document, trendChart);
                }
            } catch (Exception e) {
                System.err.println("Error generating trend chart: " + e.getMessage());
            }

            addSectionHeader(document, "Category Breakdown");
            try {
                var categoryBreakdown = dashboardService.getCategoryBreakdown(userId, months);
                if (!categoryBreakdown.isEmpty()) {
                    BufferedImage pieChart = chartGenerator.generateCategoryPieChart(categoryBreakdown, 600, 400);
                    addChartImage(document, pieChart);
                }
            } catch (Exception e) {
                System.err.println("Error generating category chart: " + e.getMessage());
            }

            addSectionHeader(document, "AI Expense Predictions (Next Month)");
            addPredictionsTable(document, predictions);

            addSectionHeader(document, "Detailed Transactions");
            addTransactionsTable(document, transactions);

            addFooter(document, pdf);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println("ERROR generating Analytics PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate Analytics PDF", e);
        }
    }

    public byte[] generateTransactionsPdf(Long userId, List<Transaction> transactions, String dateRange) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4, false);
            document.setMargins(40, 40, 40, 40);

            addCoverPage(document, "Transactions Report");
            document.add(new Paragraph("Date Range: " + dateRange)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ReportStyle.TEXT_COLOR)
                    .setMarginBottom(20));
            document.add(new AreaBreak());

            addSectionHeader(document, "Transactions List");
            addTransactionsTable(document, transactions);

            addFooter(document, pdf);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println("ERROR generating Transactions PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate Transactions PDF", e);
        }
    }

    public byte[] generateGoalsPdf(Long userId, List<SavingsGoal> goals) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(outputStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4, false);
            document.setMargins(40, 40, 40, 40);

            addCoverPage(document, "Savings Goals Report");
            document.add(new AreaBreak());

            addSectionHeader(document, "Your Savings Goals");
            addGoalsTable(document, goals);

            // Add summary statistics
            addSectionHeader(document, "Summary");
            double totalTarget = goals.stream()
                    .mapToDouble(g -> g.getTargetAmount().doubleValue()).sum();
            double totalSaved = goals.stream()
                    .mapToDouble(g -> g.getCurrentAmount().doubleValue()).sum();
            double overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

            Table summaryTable = new Table(UnitValue.createPercentArray(new float[] { 1, 1 })).useAllAvailableWidth();
            summaryTable.addCell(createCell("Total Goals", true));
            summaryTable.addCell(createCell(String.valueOf(goals.size()), false));
            summaryTable.addCell(createCell("Total Target Amount", true));
            summaryTable.addCell(createCell(String.format("₹%.2f", totalTarget), false));
            summaryTable.addCell(createCell("Total Saved", true));
            summaryTable.addCell(createCell(String.format("₹%.2f", totalSaved), false));
            summaryTable.addCell(createCell("Overall Progress", true));
            summaryTable.addCell(createCell(String.format("%.1f%%", overallProgress), false));
            document.add(summaryTable);

            addFooter(document, pdf);
            document.close();
            return outputStream.toByteArray();
        } catch (Exception e) {
            System.err.println("ERROR generating Goals PDF: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate Goals PDF", e);
        }
    }

    private void addCoverPage(Document document, String title) {
        document.add(new Paragraph("\n\n\n\n"));
        Paragraph titlePara = new Paragraph(title)
                .setFontSize(ReportStyle.FONT_SIZE_TITLE)
                .setBold()
                .setFontColor(ReportStyle.PRIMARY_COLOR)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(titlePara);

        Paragraph subtitle = new Paragraph("BudgetWise Tracker Professional Report")
                .setFontSize(ReportStyle.FONT_SIZE_SUBHEADER)
                .setFontColor(ReportStyle.TEXT_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(10);
        document.add(subtitle);

        Paragraph date = new Paragraph(
                "Generated on: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")))
                .setFontSize(ReportStyle.FONT_SIZE_BODY)
                .setFontColor(ReportStyle.TEXT_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(20);
        document.add(date);
    }

    private void addSectionHeader(Document document, String title) {
        Paragraph p = new Paragraph(title)
                .setFontSize(ReportStyle.FONT_SIZE_HEADER)
                .setBold()
                .setFontColor(ReportStyle.PRIMARY_COLOR)
                .setMarginTop(20)
                .setMarginBottom(10)
                .setBorderBottom(new SolidBorder(ReportStyle.PRIMARY_COLOR, 1f));
        document.add(p);
    }

    private void addSummaryTable(Document document, List<Transaction> transactions) {
        double income = transactions.stream().filter(t -> t.getType().toString().equals("INCOME"))
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();
        double expense = transactions.stream().filter(t -> t.getType().toString().equals("EXPENSE"))
                .mapToDouble(t -> t.getAmount().doubleValue()).sum();

        Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 1 })).useAllAvailableWidth();
        table.addCell(createCell("Total Income", true));
        table.addCell(createCell(String.format("₹%.2f", income), false));
        table.addCell(createCell("Total Expenses", true));
        table.addCell(createCell(String.format("₹%.2f", expense), false));
        table.addCell(createCell("Net Savings", true));
        table.addCell(createCell(String.format("₹%.2f", income - expense), false));

        document.add(table);
    }

    private void addTransactionsTable(Document document, List<Transaction> transactions) {
        Table table = new Table(UnitValue.createPercentArray(new float[] { 2, 2, 2, 3 })).useAllAvailableWidth();
        addHeaderCell(table, "Date");
        addHeaderCell(table, "Type");
        addHeaderCell(table, "Amount");
        addHeaderCell(table, "Category");

        boolean isOdd = true;
        for (Transaction t : transactions) {
            addBodyCell(table, t.getTransactionDate().toString(), isOdd);
            addBodyCell(table, t.getType().toString(), isOdd);
            addBodyCell(table, String.format("₹%.2f", t.getAmount()), isOdd);
            addBodyCell(table, getCategoryName(t.getCategoryId()), isOdd);
            isOdd = !isOdd;
        }
        document.add(table);
    }

    private void addBudgetsTable(Document document, List<Budget> budgets) {
        Table table = new Table(UnitValue.createPercentArray(new float[] { 3, 2, 2, 2 })).useAllAvailableWidth();
        addHeaderCell(table, "Category");
        addHeaderCell(table, "Limit");
        addHeaderCell(table, "Spent");
        addHeaderCell(table, "Remaining");

        boolean isOdd = true;
        for (Budget b : budgets) {
            addBodyCell(table, getCategoryName(b.getCategoryId()), isOdd);
            addBodyCell(table, String.format("₹%.2f", b.getAmount()), isOdd);
            addBodyCell(table, String.format("₹%.2f", b.getSpent()), isOdd);
            addBodyCell(table, String.format("₹%.2f", b.getAmount().subtract(b.getSpent())), isOdd);
            isOdd = !isOdd;
        }
        document.add(table);
    }

    private void addGoalsTable(Document document, List<SavingsGoal> goals) {
        Table table = new Table(UnitValue.createPercentArray(new float[] { 3, 2, 2, 2 })).useAllAvailableWidth();
        addHeaderCell(table, "Goal Name");
        addHeaderCell(table, "Target");
        addHeaderCell(table, "Saved");
        addHeaderCell(table, "Progress");

        boolean isOdd = true;
        for (SavingsGoal g : goals) {
            addBodyCell(table, g.getName(), isOdd);
            addBodyCell(table, String.format("₹%.2f", g.getTargetAmount()), isOdd);
            addBodyCell(table, String.format("₹%.2f", g.getCurrentAmount()), isOdd);

            double progress = 0;
            if (g.getTargetAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
                progress = g.getCurrentAmount().divide(g.getTargetAmount(), 4, java.math.RoundingMode.HALF_UP)
                        .multiply(java.math.BigDecimal.valueOf(100)).doubleValue();
            }
            addBodyCell(table, String.format("%.1f%%", progress), isOdd);
            isOdd = !isOdd;
        }
        document.add(table);
    }

    private void addPredictionsTable(Document document, List<PredictionDto> predictions) {
        if (predictions == null || predictions.isEmpty()) {
            document.add(new Paragraph("No predictions available.").setFontColor(ReportStyle.TEXT_COLOR));
            return;
        }

        Table table = new Table(UnitValue.createPercentArray(new float[] { 3, 2, 2, 2 })).useAllAvailableWidth();
        addHeaderCell(table, "Category");
        addHeaderCell(table, "Predicted");
        addHeaderCell(table, "Trend");
        addHeaderCell(table, "Confidence");

        boolean isOdd = true;
        for (PredictionDto p : predictions) {
            addBodyCell(table, p.getCategoryName(), isOdd);
            addBodyCell(table, String.format("₹%.2f", p.getPredictedAmount()), isOdd);

            String trendSymbol = "STABLE".equals(p.getTrend()) ? "→" : ("INCREASING".equals(p.getTrend()) ? "↑" : "↓");
            addBodyCell(table, p.getTrend() + " " + trendSymbol, isOdd);

            addBodyCell(table, String.format("%.0f%%", p.getConfidenceScore() * 100), isOdd);
            isOdd = !isOdd;
        }
        document.add(table);
    }

    private void addHeaderCell(Table table, String text) {
        Cell cell = new Cell().add(new Paragraph(text).setBold().setFontColor(ReportStyle.WHITE));
        cell.setBackgroundColor(ReportStyle.PRIMARY_COLOR);
        cell.setPadding(5);
        cell.setTextAlignment(TextAlignment.CENTER);
        table.addHeaderCell(cell);
    }

    private void addBodyCell(Table table, String text, boolean isOdd) {
        Cell cell = new Cell().add(new Paragraph(text).setFontSize(ReportStyle.FONT_SIZE_BODY));
        cell.setBackgroundColor(isOdd ? ReportStyle.LIGHT_BG_COLOR : ReportStyle.WHITE);
        cell.setPadding(5);
        cell.setBorder(Border.NO_BORDER);
        table.addCell(cell);
    }

    private Cell createCell(String text, boolean isHeader) {
        Cell cell = new Cell().add(new Paragraph(text).setBold());
        if (isHeader) {
            cell.setBackgroundColor(ReportStyle.PRIMARY_COLOR);
            cell.setFontColor(ReportStyle.WHITE);
        } else {
            cell.setBackgroundColor(ReportStyle.LIGHT_BG_COLOR);
        }
        cell.setPadding(8);
        return cell;
    }

    private void addFooter(Document document, PdfDocument pdf) {
        int n = pdf.getNumberOfPages();
        for (int i = 1; i <= n; i++) {
            document.showTextAligned(new Paragraph(String.format("Page %d of %d", i, n)),
                    559, 20, i, TextAlignment.RIGHT, VerticalAlignment.BOTTOM, 0);
        }
    }

    private String getCategoryName(Long categoryId) {
        if (categoryId == null)
            return "Uncategorized";
        return categoryRepository.findById(categoryId).map(c -> c.getName()).orElse("Uncategorized");
    }

    /**
     * Add a BufferedImage chart to the PDF document
     */
    private void addChartImage(Document document, BufferedImage chartImage) {
        try {
            if (chartImage == null)
                return;

            // Convert BufferedImage to byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(chartImage, "PNG", baos);
            byte[] imageBytes = baos.toByteArray();

            // Create iText Image from bytes
            Image pdfImage = new Image(ImageDataFactory.create(imageBytes));
            pdfImage.setAutoScale(true);
            pdfImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
            pdfImage.setMarginBottom(20);

            document.add(pdfImage);
        } catch (Exception e) {
            System.err.println("Error adding chart image: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Parse time range string to number of months
     */
    private int parseTimeRangeToMonths(String timeRange) {
        if (timeRange == null)
            return 6;

        switch (timeRange.toLowerCase()) {
            case "3m":
            case "3months":
                return 3;
            case "6m":
            case "6months":
                return 6;
            case "1y":
            case "1year":
            case "12m":
            case "12months":
                return 12;
            default:
                return 6; // Default to 6 months
        }
    }
}
