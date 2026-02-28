$files = @(
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\AdminController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\AIController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\BudgetController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\DashboardController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\ExportController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\GdprController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\InvestmentController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\SavingsGoalController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\controller\TransactionController.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\AdminStatsDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\AnomalyDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\BudgetAdviceDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\BudgetDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\CategorizationRequestDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\CategorizationSuggestionDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\CategoryBreakdownDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\ContributionRequest.java",
   "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\DashboardSummaryDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\ExportRequest.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\InvestmentDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\MonthlyTrendDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\PortfolioSummaryDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\PostDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\PredictionDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\SavingsGoalDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\dto\TransactionDto.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\AuditLog.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\Bill.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\Budget.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\Comment.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\Investment.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\SavingsGoal.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\ScheduledReport.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\entity\Transaction.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\AdminService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\AnomalyDetectionService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\BudgetAdvisorService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\BudgetService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\CategorizationService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\ChartGeneratorService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\DashboardService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\DropboxService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\ExcelReportGenerator.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\ExportService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\InvestmentService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\PdfReportGenerator.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\PredictionService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\SavingsGoalService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\TransactionService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\UserService.java",
    "C:\Aerofisc tracker\backend\src\main\java\com\Aerofisc\service\WebSocketService.java"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        # Remove all Lombok imports
        $content = $content -replace "import\s+lombok\.[^;]+;[\r\n]+", ""
        # Remove @RequiredArgsConstructor annotation
        $content = $content -replace "@RequiredArgsConstructor[\r\n]+", ""
        # Remove @Data annotation
        $content = $content -replace "@Data[\r\n]+", ""
        # Remove @Builder annotation
        $content = $content -replace "@Builder[\r\n]+", ""
        # Remove @AllArgsConstructor annotation
        $content = $content -replace "@AllArgsConstructor[\r\n]+", ""
        # Remove @NoArgsConstructor annotation
        $content = $content -replace "@NoArgsConstructor[\r\n]+", ""
        # Remove @Getter annotation
        $content = $content -replace "@Getter[\r\n]+", ""
        # Remove @Setter annotation
        $content = $content -replace "@Setter[\r\n]+", ""
        # Save back
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Processed: $file"
    }
}
Write-Host "Lombok removal complete!"

