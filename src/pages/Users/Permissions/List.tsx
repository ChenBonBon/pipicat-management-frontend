import Icon, { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import ListLayout from '@layouts/ListLayout';
import { Filters } from '@src/components';
import { PERMISSION_STATUS } from '@src/constants';
import useDebounceFunc from '@src/hooks/useDebounceFunc';
import { Permission } from '@src/models/permission';
import { RequestParams } from '@src/services/request';
import { fetchRole } from '@src/services/role';
import { RootState } from '@src/store';
import { Button, Popconfirm, Select, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

const { Option } = Select;

export default function PermissionList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((rootState: RootState) => rootState.loading.models.user);
  const { role } = useSelector((state: RootState) => state.role);
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
      title: '权限名',
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: '权限描述',
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态',
      render: (text: string) => {
        const status = PERMISSION_STATUS.find((status) => status.value === text);
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
      render: (_: any, item: Permission) => {
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
                      您确认要停用权限<span className="font-bold mx-1">{item.name}</span>吗？
                    </div>
                  }
                  onConfirm={() => {
                    disablePermission(item.id);
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
                    enablePermission(item.id);
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

  const fetchPermissions = async () => {
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
      const res = await dispatch.permission.fetchPermissions(payload);
      if (res) {
        const { data, total } = res;
        setDataSource(data);
        setPagination({ ...paginationRef.current, total });
      }
    } catch (error) {}
  };

  const initFetchPermissions = async () => {
    paginationRef.current = { current: 1, pageSize: 10 };
    await fetchPermissions();
  };

  const disablePermission = async (id: string) => {};
  const enablePermission = async (id: string) => {};

  useDebounceFunc(
    () => {
      initFetchPermissions();
    },
    300,
    [name, status],
  );

  return (
    <ListLayout
      title="权限管理"
      filters={[
        <Filters.Input
          placeholder="请输入姓名"
          onChange={(e) => {
            const value = e.currentTarget.value;
            setName(value);
          }}
        />,
        <Filters.Select
          placeholder="请选择权限状态"
          onChange={(value) => {
            setStatus(value);
          }}
        >
          {PERMISSION_STATUS.map((status) => {
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
            await dispatch.permission.resetPermission();
            toggle();
          }}
        >
          新增权限
        </Button>,
      ]}
      table={{
        columns,
        dataSource,
        pagination: {
          ...pagination,
          onChange: (current: number, pageSize: number) => {
            paginationRef.current = { current, pageSize };
            fetchPermissions();
          },
        },
        loading: isLoading,
      }}
    />
  );
}
