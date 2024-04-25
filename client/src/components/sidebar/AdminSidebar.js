import React, { memo, Fragment, useState } from 'react'
import logo from '../../assets/logo.png'
import { adminSidebar } from '../../ultils/constants'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { AiOutlineCaretDown, AiOutlineCaretRight} from 'react-icons/ai'

const activedStyle = 'px-4 py-2 flex items-center gap-2 bg-cyan-400 rounded-xl'
const notActivedStyle = 'px-4 py-2 flex items-center gap-2 hover:bg-cyan-300 rounded-xl'

const AdminSidebar = () => {
    const [actived, setActived] = useState([])
    const handleShowTab = (tabId) => {
        if(actived.some(el => el === tabId)) setActived(prev => prev.filter(el => el !== tabId))
        else setActived(prev => [...prev, tabId])
    }
    return (
        <div className='p-4 bg-gray-100 h-full py-4'>
            <div className='flex flex-col justify-center items-center p-4 gap-2'>
                <img src={logo} alt='logo' className='w-[200px] object-contain' />
                <small>Admin Workspace</small>
            </div>
            <div>
                {adminSidebar.map(el => (
                    <Fragment key={el.id}>
                        {el.type === 'SINGLE' && <NavLink
                            to={el.path}
                            className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle)}
                        >
                            <span>{el.icon}</span>
                            <span>{el.text}</span>
                        </NavLink>}
                        {el.type === 'PARENT' && <div onClick={() => handleShowTab(el.id)} className='flex flex-col'>
                            <div className='flex items-center justify-between px-4 py-2 hover:bg-cyan-300 cursor-pointer rounded-xl'>
                                <div className='flex items-center gap-2'>
                                    <span>{el.icon}</span>
                                    <span>{el.text}</span>
                                </div>
                                {actived.some(id => id === el.id) ? <AiOutlineCaretRight /> : <AiOutlineCaretDown /> }
                            </div>
                            {actived.some(id => id === el.id) && <div className='flex flex-col'>
                                {el.submenu.map(item => (
                                    <NavLink
                                    key={item.text}
                                    to={item.path}
                                    onClick={e => e.stopPropagation()}
                                    className={({isActive}) => clsx(isActive && activedStyle, !isActive && notActivedStyle, 'pl-10')}
                                    >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>}
                        </div>}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}

export default memo(AdminSidebar)