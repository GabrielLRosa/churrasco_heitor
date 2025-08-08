import React from 'react';
import './PageLayout.scss';

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
}) => {
  return (
    <div className={`page-layout ${className}`}>
      <div className="page-layout__container">
        {(title || subtitle || actions) && (
          <header className="page-layout__header">
            <div className="page-layout__header-content">
              {title && (
                <div className="page-layout__title-section">
                  <h1 className="page-layout__title">{title}</h1>
                  {subtitle && (
                    <p className="page-layout__subtitle">{subtitle}</p>
                  )}
                </div>
              )}
              {actions && (
                <div className="page-layout__actions">
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}
        
        <main className="page-layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};