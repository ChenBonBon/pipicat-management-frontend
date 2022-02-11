import { Spin } from 'antd';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Nav from './components/Nav';
import menus from './menus';
import routes from './routes';

function App() {
  return (
    <div>
      <Nav menus={menus} />
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-96">
            <Spin spinning />
          </div>
        }
      >
        <Routes>
          {routes.map((route) => {
            const { element, ...rest } = route;
            return <Route {...rest} element={element} />;
          })}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
