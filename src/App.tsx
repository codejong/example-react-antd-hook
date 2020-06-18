import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './List';
import { Button, Table } from 'antd';

const App: React.FC = () => {
  return (
    <div className="App">
      <List title={'사용자 목록'} />
    </div>
  );
};

export default App;
