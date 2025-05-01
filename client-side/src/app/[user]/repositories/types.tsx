// src/components/repository/types.ts
export interface SortOptions {
    value: 'name-asc' | 'name-desc' | 'newest' | 'oldest'
    label: string
    icon: React.ComponentType
}