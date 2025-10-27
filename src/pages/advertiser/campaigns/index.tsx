import { useState, useMemo } from 'react';
import { Card, Table, Tag, Button, Modal, Space, Input, Select, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableColumnType, TableProps } from 'antd';
import { useCampaigns, useDeleteCampaign } from 'features/campaign/api/campaign.api';
import { formatCurrency, formatDate } from 'shared/lib/utils/format';
import { CreateCampaignModal } from './create-campaign-modal';
import type { Campaign } from 'shared/types';
import './campaigns.css';

export const AdvertiserCampaignsPage = () => {
  const { message } = App.useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  
  const { data, isLoading } = useCampaigns({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page: pagination.current,
    limit: pagination.pageSize,
  });
  
  const deleteCampaign = useDeleteCampaign();

  const handleDelete = (campaignId: string) => {
    Modal.confirm({
      title: 'Удалить кампанию?',
      content: 'Это действие нельзя отменить',
      okText: 'Удалить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: () => deleteCampaign.mutate(campaignId),
    });
  };

  const getStatusTag = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      draft: { color: 'default', text: 'Черновик' },
      active: { color: 'success', text: 'Активна' },
      paused: { color: 'warning', text: 'На паузе' },
      completed: { color: 'processing', text: 'Завершена' },
    };
    const cfg = config[status] || { color: 'default', text: status };
    return <Tag color={cfg.color}>{cfg.text}</Tag>;
  };

  // Фильтрация по поисковому тексту
  const filteredData = useMemo(() => {
    if (!data?.campaigns || !searchText) return data?.campaigns || [];
    
    const searchLower = searchText.toLowerCase();
    return data.campaigns.filter((campaign: Campaign) =>
      campaign.title.toLowerCase().includes(searchLower) ||
      campaign.description?.toLowerCase().includes(searchLower)
    );
  }, [data?.campaigns, searchText]);

  const handleTableChange: TableProps<Campaign>['onChange'] = (paginationInfo) => {
    setPagination({
      current: paginationInfo.current || 1,
      pageSize: paginationInfo.pageSize || 10,
    });
  };

  const columns: TableColumnType<Campaign>[] = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
      sorter: (a, b) => a.title.localeCompare(b.title),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'Тип',
      dataIndex: 'campaignType',
      key: 'campaignType',
      sorter: (a, b) => (a.campaignType || '').localeCompare(b.campaignType || ''),
    },
    {
      title: 'Бюджет',
      key: 'budget',
      render: (_: unknown, record: Campaign) => (
        <div>
          <div>{formatCurrency(record.budget?.total || 0)}</div>
          <div style={{ fontSize: '0.75rem', color: '#999' }}>
            Потрачено: {formatCurrency(record.budget?.spent || 0)}
          </div>
        </div>
      ),
      sorter: (a, b) => (a.budget?.total || 0) - (b.budget?.total || 0),
    },
    {
      title: 'Период',
      key: 'period',
      render: (_: unknown, record: Campaign) => (
        <div>
          <div>{formatDate(record.startDate)}</div>
          <div style={{ fontSize: '0.75rem', color: '#999' }}>
            по {formatDate(record.endDate)}
          </div>
        </div>
      ),
      sorter: (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Черновик', value: 'draft' },
        { text: 'Активна', value: 'active' },
        { text: 'На паузе', value: 'paused' },
        { text: 'Завершена', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: Campaign) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => message.info('Редактирование в разработке')}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="campaigns-page">
      <div className="page-header">
        <h1>Кампании</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Создать кампанию
        </Button>
      </div>

      <Card>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
          <Input
            placeholder="Поиск по названию и описанию..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: '300px' }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: '200px' }}
          >
            <Select.Option value="all">Все статусы</Select.Option>
            <Select.Option value="draft">Черновик</Select.Option>
            <Select.Option value="active">Активна</Select.Option>
            <Select.Option value="paused">На паузе</Select.Option>
            <Select.Option value="completed">Завершена</Select.Option>
          </Select>
        </div>

        <Table
          dataSource={filteredData}
          columns={columns}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `Всего ${total} кампаний`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </Card>

      <CreateCampaignModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
