package com.luxe_restaurant.app.controllers;

import com.luxe_restaurant.app.requests.report.ReportRequest;
import com.luxe_restaurant.app.responses.report.ReportResponse;
import com.luxe_restaurant.domain.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ReportController {
    private final ReportService reportService;

    @PostMapping("/create")
    public ReportResponse createReport(ReportRequest reportRequest) {
        return reportService.createReport(reportRequest);
    }

    @DeleteMapping("/delete")
    public void deleteReport(Long id) {
        reportService.deleteReport(id);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

}
