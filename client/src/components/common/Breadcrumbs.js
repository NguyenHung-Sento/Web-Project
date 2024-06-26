import React, {memo} from 'react'
import useBreadcrumbs from "use-react-router-breadcrumbs"
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';


const Breadcrumbs = ({ title, category }) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title, },
    ];
    const breadcrumbs = useBreadcrumbs(routes)
    return (
        <div className='text-sm flex items-center gap-2'>
            {breadcrumbs.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link className='flex items-center hover:text-cyan-600' key={match.pathname} to={match.pathname}>
                    <span>{breadcrumb}</span>
                    {index !== self.length-1 && <IoIosArrowForward />}
                </Link>
            ))}
        </div>
    )
}

export default memo(Breadcrumbs)