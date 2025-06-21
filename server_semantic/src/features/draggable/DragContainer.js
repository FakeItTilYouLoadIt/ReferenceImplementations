import React from 'react'

function DragContainer({ children, startingList, isDark }) {

    const renderChild = (child, index, id) => {
        if (child !== undefined) {
            return (
                <child.type
                    {...child.props}
                    index={index}
                    id={id}
                    key={id}
                    isDark={isDark}
                />
            )
        }
    }

    return (
        <div className='Container'>
            {children !== undefined && startingList.map((item, index) => {
                return renderChild(children[children.findIndex(child => child !== undefined && child.key === item)], index, item)
            })}
        </div>
    )
}

export default DragContainer