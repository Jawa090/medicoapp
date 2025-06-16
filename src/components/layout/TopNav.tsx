import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const TopNav: React.FC = () => {
  const { userProfile } = useAppSelector(state => state.auth);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const username = userProfile?.name || 'User';
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on auth and index/landing pages
  if (location.pathname === '/auth' || location.pathname === '/') {
    return null;
  }

  // Handle initial theme setup
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme || 'light');
  }, [resolvedTheme]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide nav when scrolling down, show when scrolling up
      if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Get time-based greeting and icon
  const getTimeBasedInfo = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { greeting: 'Good morning', Icon: Sun, color: 'text-amber-500' };
    if (hour < 17) return { greeting: 'Good afternoon', Icon: Sun, color: 'text-orange-500' };
    return { greeting: 'Good evening', Icon: Moon, color: 'text-indigo-400' };
  };

  const { greeting, Icon, color } = getTimeBasedInfo();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-4 sm:pt-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ 
            duration: 0.2,
            ease: 'easeOut'
          }}
        >
          <div className="max-w-screen-sm mx-auto">
            <motion.div 
              className="flex items-center justify-between h-12 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm px-4 sm:px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2
              }}
            >
              {/* Left Section - Time-based Greeting */}
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.2
                }}
              >
                <motion.div
                  className={`p-1.5 rounded-xl bg-gray-50/80 dark:bg-gray-700/80 ${color}`}
                  animate={{
                    rotate: 0,
                    scale: 1
                  }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <h1 className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                  {greeting}
                </h1>
              </motion.div>

              {/* Right Section - Hello User + Theme Toggle */}
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  duration: 0.2
                }}
              >
                <motion.div
                  className="flex items-center py-1.5 px-3 rounded-xl bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate max-w-[120px] sm:max-w-none">
                    {username}
                  </p>
                </motion.div>

                {/* Theme Toggle Button */}
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-gray-50/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{
                      rotate: resolvedTheme === 'dark' ? 180 : 0
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: 'easeInOut'
                    }}
                  >
                    {resolvedTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-indigo-400" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-400" />
                    )}
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default TopNav;
