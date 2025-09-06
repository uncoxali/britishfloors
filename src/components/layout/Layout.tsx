import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  // Enable or disable the standard page container
  useContainer?: boolean;
  // Override container classes when needed
  containerClassName?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  useContainer = true,
  containerClassName = 'w-full px-4 sm:px-6 lg:px-8',
}) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 pt-28'>
        {useContainer ? <div className={containerClassName}>{children}</div> : children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
