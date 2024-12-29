import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';
import InfoPage from './InfoPage';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="*" element={<Page.Error />} />
      <Route path="/:entity_id" element={<InfoPage />} />
      <Route path="/create" element={<InfoPage />} />
    </Routes>
  );
};

export { App };
