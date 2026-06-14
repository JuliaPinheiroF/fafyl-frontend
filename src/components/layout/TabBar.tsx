import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { IoHome, IoBulbOutline, IoSearch, IoPeople } from 'react-icons/io5';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/home', icon: IoHome, label: 'Home' },
  { to: '/quiz-info', icon: IoBulbOutline, label: 'Quiz' },
  { to: '/busca', icon: IoSearch, label: 'Busca' },
  { to: '/sobre', icon: IoPeople, label: 'Sobre' },
];

function TabIndicator({ activeIndex }: { activeIndex: number }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-9 bg-white/10 rounded-xl"
      layoutId="tab-indicator"
      initial={false}
      animate={{
        left: `calc(${activeIndex * 25}% + 6px)`,
        width: `calc(25% - 12px)`,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  );
}

export default function TabLayout() {
  const location = useLocation();
  const activeIndex = tabs.findIndex((t) => t.to === location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background bg-radial-gradient">
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <nav className="relative glass-dark h-16 flex items-center justify-around px-2 shrink-0 shadow-[var(--shadow-header)]">
        <TabIndicator activeIndex={activeIndex >= 0 ? activeIndex : 0} />
        {tabs.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 no-underline relative z-10 px-3 py-1 rounded-xl active:scale-90 transition-all duration-200"
            >
              <Icon
                size={20}
                color={isActive ? '#FFDE59' : 'rgba(255,255,255,0.5)'}
                className="transition-colors duration-200"
              />
              <span
                className="text-[10px] font-semibold tracking-wide uppercase"
                style={{
                  color: isActive ? '#FFDE59' : 'rgba(255,255,255,0.5)',
                }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
