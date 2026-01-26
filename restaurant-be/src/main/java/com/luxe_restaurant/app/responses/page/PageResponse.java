package com.luxe_restaurant.app.responses.page;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> content;
    private PageCustom<T> page;

    public PageResponse( Page<T> page) {
        this.content = page.getContent();
        this.page = new  PageCustom<T>(page);
    }
}
