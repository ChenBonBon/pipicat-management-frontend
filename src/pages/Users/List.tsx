import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import ListLayout from '@layouts/ListLayout';
import { Filters } from '@src/components';
import Icon from '@src/components/Icon';
import { GENDERS, USER_STATUS } from '@src/constants';
import useDebounceFunc from '@src/hooks/useDebounceFunc';
import { RequestParams } from '@src/services/request';
import { RootState } from '@src/store';
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select } from 'antd';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

const { Option } = Select;
const { useForm } = Form;
const { RangePicker } = DatePicker;

interface User {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  birthday?: string;
  mobile?: string;
  email?: string;
  status: 'enabled' | 'disabled';
}

export default function UserList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((rootState: RootState) => rootState.loading.models.user);
  const [form] = useForm();
  const [visible, toggle] = useToggle(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const paginationRef = useRef({ current: 1, pageSize: 10 });

  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '姓名',
    },
    {
      key: 'gender',
      dataIndex: 'gender',
      title: '性别',
    },
    {
      key: 'birthday',
      dataIndex: 'birthday',
      title: '出生日期',
    },
    {
      key: 'mobile',
      dataIndex: 'mobile',
      title: '手机号',
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: '邮箱',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (text: string) => {
        return USER_STATUS.find((status) => status.value === text)?.label;
      },
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: any, item: User) => {
        return (
          <div>
            <Icon>
              <EditOutlined onClick={toggle} />
            </Icon>
            <Icon>
              <Popconfirm
                title={
                  <div>
                    您确认要删除用户<span className="font-bold mx-1">{item.name}</span>吗？
                  </div>
                }
                onConfirm={() => {
                  deleteUser(item.id);
                }}
                onCancel={() => {}}
              >
                <DeleteOutlined />
              </Popconfirm>
            </Icon>
            {item.status === 'enabled' && (
              <Icon>
                <Popconfirm
                  title={
                    <div>
                      您确认要锁定用户<span className="font-bold mx-1">{item.name}</span>吗？
                    </div>
                  }
                  onConfirm={() => {
                    lockUser(item.id);
                  }}
                  onCancel={() => {}}
                >
                  <LockOutlined />
                </Popconfirm>
              </Icon>
            )}
            {item.status === 'disabled' && (
              <Icon>
                <Popconfirm
                  title={
                    <div>
                      您确认要解锁用户<span className="font-bold mx-1">{item.name}</span>吗？
                    </div>
                  }
                  onConfirm={() => {
                    unLockUser(item.id);
                  }}
                  onCancel={() => {}}
                >
                  <UnlockOutlined />
                </Popconfirm>
              </Icon>
            )}
          </div>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    try {
      const payload: RequestParams = {
        ...paginationRef.current,
      };
      if (name && name.length > 0) {
        payload.name = name;
      }
      if (gender && gender.length > 0) {
        payload.gender = gender;
      }
      if (status && status.length > 0) {
        payload.status = status;
      }
      const res = await dispatch.user.fetchUsers(payload);
      if (res) {
        const { data, total } = res;
        setDataSource(data);
        setPagination({ ...paginationRef.current, total });
      }
    } catch (error) {}
  };

  const addUser = async () => {
    try {
      const values = await form.validateFields();
      const res = await dispatch.user.addUser(values);
      if (res) {
        await fetchUsers();
        message.success('新增用户成功');
        toggle();
      }
    } catch (error) {}
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await dispatch.user.deleteUser(id);
      if (res) {
        await fetchUsers();
        message.success('删除用户成功');
      }
    } catch (error) {}
  };

  const lockUser = async (id: string) => {};
  const unLockUser = async (id: string) => {};

  useDebounceFunc(
    () => {
      fetchUsers();
    },
    300,
    [name, gender, status],
  );

  return (
    <ListLayout
      title="用户管理"
      filters={[
        <Filters.Input
          placeholder="请输入姓名"
          onChange={(e) => {
            const value = e.currentTarget.value;
            setName(value);
          }}
        />,
        <Select
          dropdownMatchSelectWidth={false}
          placeholder="请选择性别"
          allowClear
          className="w-full"
          onChange={(value) => {
            setGender(value);
          }}
        >
          {GENDERS.map((gender) => {
            const { key, label, value } = gender;
            return (
              <Option key={key} value={value}>
                {label}
              </Option>
            );
          })}
        </Select>,
        <Select
          dropdownMatchSelectWidth={false}
          placeholder="请选择用户状态"
          allowClear
          className="w-full"
          onChange={(value) => {
            setStatus(value);
          }}
        >
          {USER_STATUS.map((status) => {
            const { key, label, value } = status;
            return (
              <Option key={key} value={value}>
                {label}
              </Option>
            );
          })}
        </Select>,
        <RangePicker />,
      ]}
      actions={[
        <Button type="primary" onClick={toggle}>
          新增用户
        </Button>,
      ]}
      table={{
        columns,
        dataSource,
        pagination: {
          ...pagination,
          onChange: (current: number, pageSize: number) => {
            paginationRef.current = { current, pageSize };
            fetchUsers();
          },
        },
        loading: isLoading,
      }}
    >
      <Modal visible={visible} onCancel={toggle} onOk={addUser} title="新增用户" destroyOnClose={true}>
        <Form form={form} preserve={false} labelCol={{ span: 6 }} wrapperCol={{ span: 15, push: 1 }} colon={false}>
          <Form.Item
            name="name"
            label="姓名"
            validateFirst
            rules={[
              { required: true, message: '请输入姓名' },
              {
                validator: (_, value) => {
                  if (value.length > 0 && value.length <= 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入1-10个字符'));
                },
              },
            ]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select dropdownMatchSelectWidth={false} placeholder="请选择性别" allowClear>
              {GENDERS.map((gender) => {
                const { key, label, value } = gender;
                return (
                  <Option key={key} value={value}>
                    {label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item name="birthday" label="出生日期">
            <DatePicker className="w-full" placeholder="请选择出生日期" />
          </Form.Item>
          <Form.Item name="mobile" label="手机号">
            <Input placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </ListLayout>
  );
}
