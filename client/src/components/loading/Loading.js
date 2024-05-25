import React, { memo } from 'react'

const Loading = ({ size }) => {
    return (
        <div className="w-[50%]  flex items-center justify-center h-10">
            <div
                style={{ width: `${size}px`, height: `${size}px` }}
                className="animate-spin">
                <div className="h-full w-full border-4 border-t-cyan-500 border-b-cyan-700 rounded-[50%]">
                </div>
            </div>
        </div>
    )
}

export default memo(Loading)