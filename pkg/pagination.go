package pkg

import (
	"fmt"
	"net/url"
	"strconv"
)

type Pagination struct {
	Page       int   `json:"page"`
	Limit      int   `json:"limit"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

type PaginationQuery struct {
	Page  int `json:"page"`
	Limit int `json:"limit"`
}

const (
	DefaultPage  = 1
	DefaultLimit = 10
	MaxLimit     = 100
)

func ParsePaginationQuery(q url.Values) (page, limit int, err error) {
	page = DefaultPage
	limit = DefaultLimit

	if p := q.Get("page"); p != "" {
		i, e := strconv.Atoi(p)
		if e != nil || i < 1 {
			return 0, 0, fmt.Errorf("invalid page")
		}
		page = i
	}

	if l := q.Get("limit"); l != "" {
		i, e := strconv.Atoi(l)
		if e != nil || i < 1 {
			return 0, 0, fmt.Errorf("invalid limit")
		}
		if i > MaxLimit {
			limit = MaxLimit
		}
		limit = i
	}

	return page, limit, nil
}

func PaginationOffset(page, limit int) int {
	return (page - 1) * limit
}

func PaginationTotalPages(total int64, limit int) int {
	if limit <= 0 {
		return 0
	}
	l := int64(limit)
	return int((total + l - 1) / l)
}

func NewPagination(page, limit int, total int64) Pagination {
	return Pagination{
		Page:       page,
		Limit:      limit,
		Total:      total,
		TotalPages: PaginationTotalPages(total, limit),
	}
}
