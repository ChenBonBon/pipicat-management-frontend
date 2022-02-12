import { DeleteOutlined, EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import ListLayout from '@layouts/ListLayout';
import { Filters, Form } from '@src/components';
import Icon from '@src/components/Icon';
import { DATE_FORMAT, GENDERS, USER_STATUS } from '@src/constants';
import useDebounceFunc from '@src/hooks/useDebounceFunc';
import { User } from '@src/models/user';
import { RequestParams } from '@src/services/request';
import { RootState } from '@src/store';
import { Button, DatePicker, Input, message, Modal, Popconfirm, Select, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

const { Option } = Select;
const { useForm } = Form;
const { RangePicker } = DatePicker;

export default function UserList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.models.user);
  const { user, roleOptions } = useSelector((state: RootState) => state.user);
  const [form] = useForm();
  const [visible, toggle] = useToggle(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [birthday, setBirthday] = useState({ start: '', end: '' });
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
      render: (text: string) => {
        return GENDERS.find((gender) => gender.value === text)?.label;
      },
    },
    {
      key: 'birthday',
      dataIndex: 'birthday',
      title: '出生日期',
      render: (text: string) => {
        return dayjs(text).format(DATE_FORMAT);
      },
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
      key: 'roleId',
      dataIndex: 'roleId',
      title: '角色',
      render: (text: string) => {
        return roleOptions.find((role) => role.id === text)?.name;
      },
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (text: string) => {
        const status = USER_STATUS.find((status) => status.value === text);
        if (text === 'enabled') {
          return <Tag color="success">{status?.label}</Tag>;
        } else {
          return <Tag color="error">{status?.label}</Tag>;
        }
      },
    },
    {
      key: 'actions',
      title: '操作',
      render: (_: any, item: User) => {
        return (
          <div>
            <Icon>
              <Tooltip title="编辑">
                <EditOutlined
                  onClick={() => {
                    fetchUser(item.id);
                  }}
                />
              </Tooltip>
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
              >
                <Tooltip title="删除">
                  <DeleteOutlined />
                </Tooltip>
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
                  <Tooltip title="锁定">
                    <LockOutlined />
                  </Tooltip>
                </Popconfirm>
              </Icon>
            )}
            {item.status === 'locked' && (
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
                  <Tooltip title="解锁">
                    <UnlockOutlined />
                  </Tooltip>
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
      if (birthday && birthday.start && birthday.start.length > 0) {
        payload.startDate = birthday.start;
      }
      if (birthday && birthday.end && birthday.end.length > 0) {
        payload.endDate = birthday.end;
      }
      const res = await dispatch.user.fetchUsers(payload);
      if (res) {
        const { data, total } = res;
        setDataSource(data);
        setPagination({ ...paginationRef.current, total });
      }
    } catch (error) {}
  };

  const initFetchUsers = async () => {
    paginationRef.current = { current: 1, pageSize: 10 };
    await fetchUsers();
  };

  const fetchRoleOptions = async () => {
    await dispatch.user.fetchRoleOptions();
  };

  const fetchUser = async (id: string) => {
    const res = await dispatch.user.fetchUser(id);
    if (res) {
      const { birthday } = res;
      form.setFieldsValue({
        ...res,
        birthday: dayjs(birthday),
      });
      toggle();
    }
  };

  const addUser = async () => {
    try {
      const values = await form.validateFields();
      const { birthday } = values;
      if (birthday) {
        values.birthday = new Date(birthday.format('YYYY/MM/DD'));
      }
      const res = await dispatch.user.addUser(values);
      if (res) {
        await initFetchUsers();
        message.success('新增用户成功');
        toggle();
      }
    } catch (error) {}
  };

  const updateUser = async (id: string) => {
    try {
      const values = await form.validateFields();
      const { birthday } = values;
      if (birthday) {
        values.birthday = new Date(birthday.format('YYYY/MM/DD'));
      }
      const res = await dispatch.user.updateUser({ id, payload: values });
      if (res) {
        await initFetchUsers();
        message.success('修改用户成功');
        toggle();
      }
    } catch (error) {}
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await dispatch.user.deleteUser(id);
      if (res) {
        await initFetchUsers();
        message.success('删除用户成功');
      }
    } catch (error) {}
  };

  const lockUser = async (id: string) => {
    try {
      const res = await dispatch.user.lockUser(id);
      if (res) {
        await initFetchUsers();
        message.success('锁定用户成功');
      }
    } catch (error) {}
  };

  const unLockUser = async (id: string) => {
    try {
      const res = await dispatch.user.unLockUser(id);
      if (res) {
        await initFetchUsers();
        message.success('解锁用户成功');
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchRoleOptions();
  }, []);

  useDebounceFunc(
    () => {
      initFetchUsers();
    },
    300,
    [name, gender, status, birthday],
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
        <Filters.Select
          placeholder="请选择性别"
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
        </Filters.Select>,
        <Filters.Select
          placeholder="请选择用户状态"
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
        </Filters.Select>,
        <RangePicker
          separator={null}
          onChange={(values) => {
            if (values) {
              const start = dayjs(values[0]?.format('YYYY/MM/DD')).toISOString();
              const end = dayjs(values[1]?.add(1, 'd')?.format('YYYY/MM/DD')).toISOString();
              setBirthday({ start, end });
            } else {
              setBirthday({ start: '', end: '' });
            }
          }}
          format={DATE_FORMAT}
        />,
      ]}
      actions={[
        <Button
          type="primary"
          onClick={async () => {
            await dispatch.user.resetUser();
            toggle();
          }}
        >
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
      <Modal
        visible={visible}
        onCancel={toggle}
        onOk={() => {
          if (user) {
            updateUser(user.id);
          } else {
            addUser();
          }
        }}
        title={user?.id ? '修改用户' : '新增用户'}
        destroyOnClose={true}
      >
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
            <Form.Input placeholder="请输入姓名" />
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
            <DatePicker className="w-full" placeholder="请选择出生日期" format={DATE_FORMAT} />
          </Form.Item>
          <Form.Item name="mobile" label="手机号">
            <Input placeholder="请输入手机号" type="tel" />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" type="email" />
          </Form.Item>
          <Form.Item name="roleId" label="角色">
            <Select dropdownMatchSelectWidth={false} placeholder="请选择角色" allowClear>
              {roleOptions.map((role) => {
                const { id, name } = role;
                return (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ListLayout>
  );
}
