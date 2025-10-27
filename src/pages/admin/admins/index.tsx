import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, message, Popconfirm, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAdmins, useCreateAdmin, useUpdateAdmin, useDeleteAdmin, Admin } from 'features/admin/api/admin.api';
import { useAuth } from 'app/providers/use-auth';

export const AdminAdminsPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const { data, isLoading } = useAdmins();
  const { user } = useAuth();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  const handleCreate = () => {
    setEditingAdmin(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    form.setFieldsValue(admin);
    setIsModalOpen(true);
  };

  const handleDelete = async (adminId: string) => {
    try {
      await deleteAdmin.mutateAsync(adminId);
      message.success('Администратор удален');
    } catch {
      message.error('Ошибка при удалении');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingAdmin) {
        await updateAdmin.mutateAsync({ adminId: editingAdmin._id, data: values });
        message.success('Администратор обновлен');
      } else {
        await createAdmin.mutateAsync(values);
        message.success('Администратор создан');
      }
      setIsModalOpen(false);
    } catch {
      // Ошибка уже обработана
    }
  };

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a: Admin, b: Admin) => a.firstName.localeCompare(b.firstName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по имени"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              Поиск
            </Button>
            <Button size="small" onClick={() => clearFilters && clearFilters()}>
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: Admin) => record.firstName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a: Admin, b: Admin) => a.lastName.localeCompare(b.lastName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по фамилии"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              Поиск
            </Button>
            <Button size="small" onClick={() => clearFilters && clearFilters()}>
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: Admin) => record.lastName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: Admin, b: Admin) => a.email.localeCompare(b.email),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по email"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button type="primary" size="small" onClick={() => confirm()}>
              Поиск
            </Button>
            <Button size="small" onClick={() => clearFilters && clearFilters()}>
              Сбросить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: Admin) => record.email.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активен' : 'Неактивен'}
        </Tag>
      ),
      sorter: (a: Admin, b: Admin) => Number(a.isActive) - Number(b.isActive),
      filters: [
        { text: 'Активен', value: true },
        { text: 'Неактивен', value: false },
      ],
      onFilter: (value: any, record: Admin) => record.isActive === value,
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU'),
      sorter: (a: Admin, b: Admin) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Admin) => {
        const isCurrentUser = user?.id === record._id;
        return (
          <Space>
            <Tooltip title="Редактировать">
              <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            </Tooltip>
            <Popconfirm
              title="Удалить администратора?"
              onConfirm={() => handleDelete(record._id)}
              okText="Да"
              cancelText="Нет"
              disabled={isCurrentUser}
            >
              <Tooltip title={isCurrentUser ? 'Вы не можете удалить себя' : 'Удалить'}>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  disabled={isCurrentUser}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Управление администраторами</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Создать администратора
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.admins}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} администраторов`,
        }}
      />

      <Modal
        title={editingAdmin ? 'Редактировать администратора' : 'Создать администратора'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createAdmin.isPending || updateAdmin.isPending}
      >
        <Form form={form} layout="vertical">
          {!editingAdmin && (
            <>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Пароль"
                rules={[{ required: true, min: 8 }]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="firstName"
            label="Имя"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Фамилия"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Телефон"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Статус"
            initialValue={true}
          >
            <Select>
              <Select.Option value={true}>Активен</Select.Option>
              <Select.Option value={false}>Неактивен</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

