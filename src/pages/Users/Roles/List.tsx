import { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import ListLayout from '@layouts/ListLayout';
import { Filters, Form } from '@src/components';
import Icon from '@src/components/Icon';
import { ROLE_STATUS } from '@src/constants';
import useDebounceFunc from '@src/hooks/useDebounceFunc';
import { Role } from '@src/models/user';
import { RequestParams } from '@src/services/request';
import { RootState } from '@src/store';
import { Button, Input, message, Modal, Popconfirm, Select, Switch, Tag, Tooltip } from 'antd';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

const { Option } = Select;
const { useForm } = Form;

export default function RoleList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((rootState: RootState) => rootState.loading.models.user);
  const { role } = useSelector((state: RootState) => state.user);
  const [form] = useForm();
  const [visible, toggle] = useToggle(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const paginationRef = useRef({ current: 1, pageSize: 10 });

  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '角色名',
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '角色描述',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (text: string) => {
        const status = ROLE_STATUS.find((status) => status.value === text);
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
      render: (_: any, item: Role) => {
        return (
          <div>
            <Icon>
              <Tooltip title="编辑">
                <EditOutlined
                  onClick={() => {
                    fetchRole(item.id);
                  }}
                />
              </Tooltip>
            </Icon>
            {item.status === 'enabled' && (
              <Icon>
                <Popconfirm
                  title={
                    <div>
                      您确认要停用角色<span className="font-bold mx-1">{item.name}</span>吗？
                    </div>
                  }
                  onConfirm={() => {
                    disableRole(item.id);
                  }}
                >
                  <Tooltip title="停用">
                    <LockOutlined />
                  </Tooltip>
                </Popconfirm>
              </Icon>
            )}
            {item.status === 'disabled' && (
              <Icon>
                <Popconfirm
                  title={
                    <div>
                      您确认要启用角色<span className="font-bold mx-1">{item.name}</span>吗？
                    </div>
                  }
                  onConfirm={() => {
                    enableRole(item.id);
                  }}
                  onCancel={() => {}}
                >
                  <Tooltip title="启用">
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

  const fetchRoles = async () => {
    try {
      const payload: RequestParams = {
        ...paginationRef.current,
      };
      if (name && name.length > 0) {
        payload.name = name;
      }
      if (status && status.length > 0) {
        payload.status = status;
      }
      const res = await dispatch.user.fetchRoles(payload);
      if (res) {
        const { data, total } = res;
        setDataSource(data);
        setPagination({ ...paginationRef.current, total });
      }
    } catch (error) {}
  };

  const initFetchRoles = async () => {
    paginationRef.current = { current: 1, pageSize: 10 };
    await fetchRoles();
  };

  const fetchRole = async (id: string) => {
    const res = await dispatch.user.fetchRole(id);
    if (res) {
      const { status } = res;
      form.setFieldsValue({
        ...res,
        status: status ? 'enabled' : 'disabled',
      });
      toggle();
    }
  };

  const addRole = async () => {
    try {
      const values = await form.validateFields();
      const { status } = values;
      if (status) {
        values.status = status ? 'enabled' : 'disabled';
      }
      const res = await dispatch.user.addRole(values);
      if (res) {
        await initFetchRoles();
        message.success('新增角色成功');
        toggle();
      }
    } catch (error) {}
  };

  const updateRole = async (id: string) => {
    try {
      const values = await form.validateFields();
      const { status } = values;
      if (status) {
        values.status = status ? 'enabled' : 'disabled';
      }
      const res = await dispatch.user.updateRole({ id, payload: values });
      if (res) {
        await initFetchRoles();
        message.success('修改角色成功');
        toggle();
      }
    } catch (error) {}
  };

  const enableRole = async (id: string) => {
    try {
      const res = await dispatch.user.enableRole(id);
      if (res) {
        await initFetchRoles();
        message.success('启用角色成功');
      }
    } catch (error) {}
  };

  const disableRole = async (id: string) => {
    try {
      const res = await dispatch.user.disableRole(id);
      if (res) {
        await initFetchRoles();
        message.success('停用角色成功');
      }
    } catch (error) {}
  };

  useDebounceFunc(
    () => {
      initFetchRoles();
    },
    300,
    [name, status],
  );

  return (
    <ListLayout
      title="角色管理"
      filters={[
        <Filters.Input
          placeholder="请输入姓名"
          onChange={(e) => {
            const value = e.currentTarget.value;
            setName(value);
          }}
        />,
        <Filters.Select
          placeholder="请选择角色状态"
          onChange={(value) => {
            setStatus(value);
          }}
        >
          {ROLE_STATUS.map((status) => {
            const { key, label, value } = status;
            return (
              <Option key={key} value={value}>
                {label}
              </Option>
            );
          })}
        </Filters.Select>,
      ]}
      actions={[
        <Button
          type="primary"
          onClick={async () => {
            await dispatch.user.resetRole();
            toggle();
          }}
        >
          新增角色
        </Button>,
      ]}
      table={{
        columns,
        dataSource,
        pagination: {
          ...pagination,
          onChange: (current: number, pageSize: number) => {
            paginationRef.current = { current, pageSize };
            fetchRoles();
          },
        },
        loading: isLoading,
      }}
    >
      <Modal
        visible={visible}
        onCancel={toggle}
        onOk={() => {
          if (role) {
            updateRole(role.id);
          } else {
            addRole();
          }
        }}
        title="新增角色"
        destroyOnClose={true}
      >
        <Form form={form} preserve={false} labelCol={{ span: 6 }} wrapperCol={{ span: 15, push: 1 }} colon={false}>
          <Form.Item
            name="name"
            label="角色名"
            validateFirst
            rules={[
              { required: true, message: '请输入角色名' },
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
            <Form.Input placeholder="请输入角色名" />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input.TextArea placeholder="请输入角色描述" className="resize-none" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </ListLayout>
  );
}
