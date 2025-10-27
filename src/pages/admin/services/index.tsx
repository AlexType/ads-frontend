import { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, InputNumber, message, Popconfirm, Select, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useServices, useCreateService, useUpdateService, useDeleteService, Service } from 'features/admin/api/admin.api';

export const AdminServicesPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { data, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const handleCreate = () => {
    setEditingService(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.setFieldsValue(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService.mutateAsync(serviceId);
      message.success('Услуга удалена');
    } catch {
      message.error('Ошибка при удалении');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingService) {
        await updateService.mutateAsync({ serviceId: editingService._id, data: values });
        message.success('Услуга обновлена');
      } else {
        await createService.mutateAsync(values);
        message.success('Услуга создана');
      }
      setIsModalOpen(false);
    } catch {
      // Ошибка уже обработана
    }
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Service, b: Service) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
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
      onFilter: (value: any, record: Service) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по описанию"
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
      onFilter: (value: any, record: Service) => record.description.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
      sorter: (a: Service, b: Service) => a.category.localeCompare(b.category),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по категории"
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
      onFilter: (value: any, record: Service) => record.category.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      render: (price: string | number) => `${price} ₽`,
      sorter: (a: Service, b: Service) => Number(a.price) - Number(b.price),
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Активна' : 'Неактивна'}
        </Tag>
      ),
      sorter: (a: Service, b: Service) => Number(a.isActive) - Number(b.isActive),
      filters: [
        { text: 'Активна', value: true },
        { text: 'Неактивна', value: false },
      ],
      onFilter: (value: any, record: Service) => record.isActive === value,
    },
    {
      title: 'Порядок',
      dataIndex: 'order',
      key: 'order',
      sorter: (a: Service, b: Service) => a.order - b.order,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: any, record: Service) => (
        <Space>
          <Tooltip title="Редактировать">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Удалить услугу?"
            onConfirm={() => handleDelete(record._id)}
            okText="Да"
            cancelText="Нет"
          >
            <Tooltip title="Удалить">
              <Button icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Управление услугами</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Создать услугу
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} услуг`,
        }}
      />

      <Modal
        title={editingService ? 'Редактировать услугу' : 'Создать услугу'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createService.isPending || updateService.isPending}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Цена"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="order"
            label="Порядок отображения"
            initialValue={0}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="Статус"
            initialValue={true}
          >
            <Select>
              <Select.Option value={true}>Активна</Select.Option>
              <Select.Option value={false}>Неактивна</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

