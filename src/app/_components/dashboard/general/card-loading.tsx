import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const CardLoading = () => {
    return (
        <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
                paddingBottom: `calc(100% * 5 / 4 + 96px)`,
                height: 0,
            }}
        >
            <Skeleton className="absolute top-0 left-0 w-full h-full rounded-2xl" />
        </div>
    )
}

export default CardLoading