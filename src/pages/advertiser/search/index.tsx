import { useState } from 'react';
import { Card, Select, Slider, Button, Row, Col, Spin, Tag, Empty, App } from 'antd';
import { StarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useSearchBloggers } from 'features/search/api/search.api';
import { formatNumber, formatCurrency } from 'shared/lib/utils/format';
import { motion } from 'framer-motion';
import './search.css';

const { Option } = Select;

interface SearchFilters {
  category?: string;
  minFollowers?: number;
  maxFollowers?: number;
  platforms?: string;
  languages?: string;
  location?: string;
  minEngagementRate?: number;
  maxPrice?: number;
  sortBy: 'rating' | 'followers' | 'price';
  order: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const AdvertiserSearchPage = () => {
  const { message } = App.useApp();
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'rating',
    order: 'desc',
  });

  const { data, isLoading } = useSearchBloggers(filters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'rating',
      order: 'desc',
    });
    message.success('Фильтры сброшены');
  };

  const BloggerCard = ({ blogger }: { blogger: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="blogger-card" hoverable>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <div className="blogger-avatar">
              <img
                src={blogger.userId?.avatar || `https://ui-avatars.com/api/?name=${blogger.userId?.firstName}+${blogger.userId?.lastName}&background=1890ff&color=fff`}
                alt={`${blogger.userId?.firstName} ${blogger.userId?.lastName}`}
              />
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className="blogger-info">
              <h3>{blogger.userId?.firstName} {blogger.userId?.lastName}</h3>
              <div className="blogger-tags">
                {blogger.categories?.slice(0, 3).map((cat: string) => (
                  <Tag key={cat} color="blue">{cat}</Tag>
                ))}
              </div>
              <div className="blogger-stats">
                <div className="stat-item">
                  <EyeOutlined /> {formatNumber(blogger.audienceStats?.totalFollowers || 0)} подписчиков
                </div>
                <div className="stat-item">
                  <StarOutlined /> {(blogger.rating || 0).toFixed(1)}
                </div>
                <div className="stat-item">
                  <UserOutlined /> {((blogger.engagement?.engagementRate || 0) * 100).toFixed(1)}% вовлеченность
                </div>
              </div>
              <div className="blogger-pricing">
                <div className="price-item">
                  <span>Пост:</span> {formatCurrency(blogger.pricing?.post || 0)}
                </div>
                <div className="price-item">
                  <span>Story:</span> {formatCurrency(blogger.pricing?.story || 0)}
                </div>
                <div className="price-item">
                  <span>Reel:</span> {formatCurrency(blogger.pricing?.reel || 0)}
                </div>
              </div>
              <Button
                type="primary"
                block
                onClick={() => window.location.href = `/bloggers/${blogger.bloggerId}`}
                style={{ marginTop: '1rem' }}
              >
                Смотреть профиль
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </motion.div>
  );

  return (
    <div className="search-page">
      <h1 className="page-title">Поиск блогеров</h1>

      <Row gutter={24}>
        {/* Фильтры */}
        <Col xs={24} lg={6}>
          <Card className="filters-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Фильтры</h3>
              <Button size="small" onClick={clearFilters}>Сбросить</Button>
            </div>

            <div className="filter-group">
              <label>Категории</label>
              <Select
                placeholder="Выберите категорию"
                style={{ width: '100%' }}
                allowClear
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
              >
                <Option value="lifestyle">Lifestyle</Option>
                <Option value="tech">Tech</Option>
                <Option value="food">Food</Option>
                <Option value="fashion">Fashion</Option>
                <Option value="fitness">Fitness</Option>
                <Option value="beauty">Beauty</Option>
                <Option value="travel">Travel</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Платформы</label>
              <Select
                placeholder="Выберите платформу"
                style={{ width: '100%' }}
                allowClear
                value={filters.platforms}
                onChange={(value) => handleFilterChange('platforms', value)}
              >
                <Option value="vk">VK</Option>
                <Option value="telegram">Telegram</Option>
                <Option value="youtube">YouTube</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Подписчики: {filters.minFollowers ? formatNumber(filters.minFollowers) : '0'} - {filters.maxFollowers ? formatNumber(filters.maxFollowers) : '∞'}</label>
              <Slider
                range
                min={1000}
                max={1000000}
                step={1000}
                value={[filters.minFollowers || 1000, filters.maxFollowers || 1000000]}
                onChange={([min, max]) => {
                  handleFilterChange('minFollowers', min);
                  handleFilterChange('maxFollowers', max);
                }}
              />
            </div>

            <div className="filter-group">
              <label>Языки</label>
              <Select
                placeholder="Выберите язык"
                style={{ width: '100%' }}
                allowClear
                value={filters.languages}
                onChange={(value) => handleFilterChange('languages', value)}
              >
                <Option value="ru">Русский</Option>
                <Option value="en">Английский</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Сортировка</label>
              <Select
                style={{ width: '100%' }}
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
              >
                <Option value="rating">По рейтингу</Option>
                <Option value="followers">По подписчикам</Option>
                <Option value="price">По цене</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Порядок</label>
              <Select
                style={{ width: '100%' }}
                value={filters.order}
                onChange={(value) => handleFilterChange('order', value)}
              >
                <Option value="desc">По убыванию</Option>
                <Option value="asc">По возрастанию</Option>
              </Select>
            </div>
          </Card>
        </Col>

        {/* Результаты поиска */}
        <Col xs={24} lg={18}>
          <div className="search-results">
            <div className="results-header">
              <h2>Найдено блогеров: {data?.pagination?.totalItems || data?.total || 0}</h2>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Spin size="large" />
              </div>
            ) : !data?.bloggers || data.bloggers.length === 0 ? (
              <Empty 
                description="Блогеры не найдены"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="bloggers-grid">
                {data.bloggers.map((blogger: any, index: number) => (
                  <BloggerCard key={blogger.userId?.id || index} blogger={blogger} />
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
