import type { Category } from './types'

export const CATEGORY_LABELS: Record<Category, string> = {
  operations: 'Operations',
  construction: 'Construction',
  electrical_power: 'Electrical / Power',
  cooling_mechanical: 'Cooling / Mechanical',
  networking: 'Networking',
}

export const CATEGORY_LIST: Category[] = [
  'operations',
  'construction',
  'electrical_power',
  'cooling_mechanical',
  'networking',
]

export const PRICE_MIN = 5
export const PRICE_MAX = 500
export const PRICE_DEFAULT = 99
