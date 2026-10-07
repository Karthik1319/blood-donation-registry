package com.blooddonation.registry.common;

import java.util.List;
import java.util.function.Function;
import org.springframework.data.domain.Page;

/** One page of results, in the shape the frontend expects: { content, totalElements, totalPages }. */
public record PageResponse<T>(List<T> content, long totalElements, int totalPages) {

    public static <E, T> PageResponse<T> from(Page<E> page, Function<E, T> mapper) {
        return new PageResponse<>(page.map(mapper).getContent(), page.getTotalElements(), page.getTotalPages());
    }
}
