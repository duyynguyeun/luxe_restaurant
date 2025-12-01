package com.luxe_restaurant.domain.services.impl;

import com.luxe_restaurant.app.requests.report.ReportRequest;
import com.luxe_restaurant.app.responses.report.ReportResponse;
import com.luxe_restaurant.domain.entities.Report;
import com.luxe_restaurant.domain.entities.User;
import com.luxe_restaurant.domain.repositories.ReportRepository;
import com.luxe_restaurant.domain.repositories.UserRepository;
import com.luxe_restaurant.domain.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    @Override
    public ReportResponse createReport(ReportRequest reportRequest) {

        User user = userRepository.findById(reportRequest.getUserId()).orElseThrow(()-> new RuntimeException("user not found"));

        Report report = Report.builder()
                .text(reportRequest.getText())
                .imageUrl(reportRequest.getImageUrl())
                .date(reportRequest.getDate())
                .user(user)
                .build();

        Report save = reportRepository.save(report);
        return ReportResponse.builder()
                .text(save.getText())
                .imageUrl(save.getImageUrl())
                .date(save.getDate())
                .user(user)
                .build();
    }

    @Override
    public void deleteReport(Long id) {
        reportRepository.deleteById(id);
    }

    @Override
    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll()
                .stream()
                .map(report -> ReportResponse.builder()
                        .id(report.getId())
                        .text(report.getText())
                        .imageUrl(report.getImageUrl())
                        .date(report.getDate())
                        .user(report.getUser())     // nếu muốn trả thông tin user
                        .build()
                )
                .toList();
    }

}
