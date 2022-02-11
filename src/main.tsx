import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import store from './store';

dayjs.locale('zh-cn');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
