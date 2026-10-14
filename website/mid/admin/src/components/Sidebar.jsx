import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 border-y border-l border-r-0 px-3 py-2.5 rounded-l transition-colors ${
      isActive
        ? "bg-gold-500/12 border-gold-500 text-gold-300"
        : "border-gold-500/15 text-ivory-300 hover:bg-gold-500/5 hover:text-gold-300"
    }`;

  return (
    <div className='w-[18%] min-h-screen bg-ink-900 border-r border-gold-500/15'>
        <div className='flex flex-col gap-4 pt-8 pl-[20%] text-[15px]'>
            <p className='hidden md:block eyebrow-gold text-[11px] mb-1'>MENU</p>

            <NavLink className={linkClass} to="/" end>
            <img className='icon-luxury w-5 h-5' src={assets.order_icon} alt="dashboard_icon" />
            <p className='hidden md:block'>Dashboard</p>
            </NavLink>

            <NavLink className={linkClass} to="/add">
            <img className='icon-luxury w-5 h-5' src={assets.add_icon} alt="add_icon" />
            <p className='hidden md:block'>Add Items</p>
            </NavLink>

             <NavLink className={linkClass} to="/list">
            <img className='icon-luxury w-5 h-5' src={assets.order_icon} alt="add_icon" />
            <p className='hidden md:block'>List Items</p>
            </NavLink>


             <NavLink className={linkClass} to="/orders">
            <img className='icon-luxury w-5 h-5' src={assets.order_icon} alt="add_icon" />
            <p className='hidden md:block'>Orders</p>
            </NavLink>

             <NavLink className={linkClass} to="/customers">
            <img className='icon-luxury w-5 h-5' src={assets.order_icon} alt="customers_icon" />
            <p className='hidden md:block'>Customers</p>
            </NavLink>

        </div>
    </div>
  )
}


export default Sidebar
