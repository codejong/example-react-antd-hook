import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { useRequest } from './request';

export interface ListProps {
  title: string;
}

interface User {
  key: string;
  name: string;
  age: number;
  address: string;
}

const fakeFetch = (url: string) => {
  return new Promise<User[]>((resolve, reject) => {
    setTimeout(() => {
      reject('서버에 연결되지 않습니다.');
      // resolve([
      //   {
      //     key: '1',
      //     name: 'Mike',
      //     age: 32,
      //     address: '10 Downing Street',
      //   },
      //   {
      //     key: '2',
      //     name: 'John',
      //     age: 42,
      //     address: '10 Downing Street',
      //   },
      // ]);
    }, 3000);
  });
};

const useUserListState = () => {
  const [list, setList] = useState<User[]>([]);

  const fetchList = () => {
    return fakeFetch('https://api.com/userlist').then((data) => {
      setList(data);
    });
  };

  return [list, { fetchList }] as const;
};

const List: React.FC<ListProps> = ({ title }) => {
  // dataSource 입력 (부모가 props, hook을 통해 받거나)
  // loading
  const [userList, { fetchList }] = useUserListState();
  const [{ pending, rejected, error }, { run }] = useRequest(fetchList);

  useEffect(() => {
    run();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <div>
      {rejected && error ? <span>{error}</span> : <h1>{title}</h1>}
      <Table loading={pending} dataSource={userList} columns={columns} />
      <Button loading={pending} onClick={run}>
        새로고침
      </Button>
    </div>
  );
};

export default List;
