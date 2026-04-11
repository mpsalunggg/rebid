import { describe, expect, it } from 'vitest'
import { formatPrice } from '../price'

describe('formatPrice', () => {
  it('formats as Indonesian Rupiah', () => {
    expect(formatPrice(0)).toMatch(/Rp/)
  })

  it('uses no fraction digits for whole amounts', () => {
    const s = formatPrice(1_500_000)
    expect(s).not.toMatch(/,\d{2}\s*$/)
    expect(s).toMatch(/1/)
    expect(s).toMatch(/500/)
  })
})
