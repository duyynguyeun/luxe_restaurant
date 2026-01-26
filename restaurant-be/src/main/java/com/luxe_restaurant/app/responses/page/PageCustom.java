package com.luxe_restaurant.app.responses.page;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.Page;

@Data
@AllArgsConstructor
@Builder
public class PageCustom<T> {
    private long totalElements;
    private int totalPages;
    private int pageNumber;
    private int pageSize;

    public PageCustom(Page<T> page) {
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
    }
}
