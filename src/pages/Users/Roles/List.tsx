import ListLayout from '@layouts/ListLayout';
import { Filters } from '@src/components';
import { ROLE_STATUS } from '@src/constants';
import { RootState } from '@src/store';
import { Button, Form, Input, Modal, Select, Switch } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

const { Option } = Select;
const { useForm } = Form;

export default function RoleList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((rootState: RootState) => rootState.loading.models.user);
  const [form] = useForm();
  const [visible, toggle] = useToggle(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const addRole = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
    } catch (error) {}
  };

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
        <Button type="primary" onClick={toggle}>
          新增角色
        </Button>,
      ]}
    >
      <Modal visible={visible} onCancel={toggle} onOk={addRole} title="新增角色" destroyOnClose={true}>
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
            <Input placeholder="请输入角色名" />
          </Form.Item>
          <Form.Item name="description" label="角色描述">
            <Input.TextArea placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </ListLayout>
  );
}
