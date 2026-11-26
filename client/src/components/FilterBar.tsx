import type { Resource } from '../types'
import type { TimeRange } from '../utils/dates'

interface FilterBarProps {
    resources: Resource[]
    resourceId: number // 0 means all resources
    range: TimeRange
    onResourceChange: (id: number) => void
    onRangeChange: (range: TimeRange) => void
}

const ranges: { value: TimeRange; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Next 7 days' },
    { value: 'all', label: 'All upcoming' },
]

export default function FilterBar({
    resources,
    resourceId,
    range,
    onResourceChange,
    onRangeChange,
}: FilterBarProps) {
    return (
        <div className="filters">
            <select
                aria-label="Filter by resource"
                value={resourceId}
                onChange={(e) => onResourceChange(Number(e.target.value))}
            >
                <option value={0}>All resources</option>
                {resources.map((r) => (
                    <option key={r.resourceId} value={r.resourceId}>
                        {r.resourceName}
                    </option>
                ))}
            </select>

            {ranges.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={range === option.value ? '' : 'secondary'}
                    aria-pressed={range === option.value}
                    onClick={() => onRangeChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}