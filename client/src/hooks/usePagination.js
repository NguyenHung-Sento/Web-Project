import { useMemo } from 'react'
import { generateRange } from '../ultils/helper'
import { HiDotsHorizontal } from "react-icons/hi";

const usePagination = (totalProductCount, currentPage, siblingCount = 1) => {
    const paginationArray = useMemo(() => {
        let pageSize = +process.env.REACT_APP_LIMIT || 10
        const paginationCount = Math.ceil(totalProductCount / pageSize)
        const totalPaginationItem = siblingCount + 5

        if(paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)

        const isShowDotLeft = currentPage - siblingCount > 2
        const isShowDotRight = currentPage + siblingCount < paginationCount - 1

        if(isShowDotLeft && !isShowDotRight){
            const rightStart = paginationCount - 4
            const rightRange = generateRange(rightStart, paginationCount)
            return [1, <HiDotsHorizontal/>, ...rightRange]
        }

        if(!isShowDotLeft && isShowDotRight){
            const leftRange = generateRange(1,5)
            return [...leftRange, <HiDotsHorizontal/>, paginationCount]

        }

        const siblingLeft = Math.max(currentPage-siblingCount,1)
        const siblingRight = Math.min(currentPage+siblingCount,paginationCount)

        if(isShowDotLeft && isShowDotRight){
            const middleRange = generateRange(siblingLeft,siblingRight)
            return [1, <HiDotsHorizontal/>, ...middleRange, <HiDotsHorizontal/>, paginationCount]
        }

    }, [totalProductCount, currentPage, siblingCount])
    
    
    return paginationArray
}

export default usePagination