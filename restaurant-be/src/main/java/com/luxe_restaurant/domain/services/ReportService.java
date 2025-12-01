package com.luxe_restaurant.domain.services;

import com.luxe_restaurant.app.requests.report.ReportRequest;
import com.luxe_restaurant.app.responses.report.ReportResponse;

import java.util.List;

public interface ReportService {
    ReportResponse createReport(ReportRequest reportRequest);
    void deleteReport(Long id);
    List<ReportResponse> getAllReports();
}
