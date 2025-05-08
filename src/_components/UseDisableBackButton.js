import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDisableBackButton = () => {
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event) => {
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);
};

export default useDisableBackButton;