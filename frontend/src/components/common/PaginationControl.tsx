import PaginationCustom from './PaginationCustom'
import { useQueryParams } from '@/hooks/useQueryParams'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useCallback } from 'react'

interface PaginationControlProps {
  totalPages?: number
  currentPage?: number
}

export default function PaginationControl({
  totalPages,
  currentPage,
}: PaginationControlProps) {
  const { setParams, setParam, getParam } = useQueryParams()
  const limit = getParam('limit', '5')

  const handleChangeLimit = useCallback(
    (value: string) => {
      setParams({
        page: 1,
        limit: value,
      })
    },
    [setParams],
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="p-2 bg-card rounded-xl border shadow-none">
        <Select value={limit} onValueChange={handleChangeLimit}>
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PaginationCustom
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(next) => setParam('page', next)}
      />
    </div>
  )
}
