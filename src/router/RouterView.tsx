import React, { useEffect, useState } from 'react';
import { router } from './index';

export const RouterView: React.FC = () => {
  const [, setUpdate] = useState({});

  useEffect(() => {
    return router.subscribe(() => {
      setUpdate({});
    });
  }, []);

  const Component = router.getCurrentComponent();
  return Component ? <Component /> : null;
};
