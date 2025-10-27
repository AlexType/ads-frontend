import { Button, Card, Row, Col, Typography, Collapse } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from 'shared/api/axios';
import { ParallaxParticles } from '../../components/ParallaxParticles';
import './landing.css';

const { Title, Paragraph } = Typography;

interface LandingData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage?: string;
    videoUrl?: string;
  };
  features?: Array<{
    title: string;
    description: string;
    icon: string;
    link: string;
  }>;
  stats?: {
    totalBloggers: number;
    totalAdvertisers: number;
    totalOrders: number;
    totalRevenue: number;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
}

export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Fetch landing data
  const { data: landingData } = useQuery({
    queryKey: ['landing-data'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/public/landing');
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/public/services');
      return data.data;
    },
    refetchOnWindowFocus: false,
  });

  const handleRegister = (role: 'blogger' | 'advertiser') => {
    navigate(`/register?role=${role}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Default data if API returns empty
  const defaultFeatures = [
    {
      title: 'AI-Подбор блогеров',
      description: 'Умный алгоритм подбирает идеальных инфлюенсеров для вашего бренда на основе аудитории и ниши',
      icon: '🤖',
    },
    {
      title: 'Интеграция с соцсетями',
      description: 'Подключение VK, Telegram и TikTok. Синхронизация статистики в реальном времени',
      icon: '📱',
    },
    {
      title: 'Безопасные платежи',
      description: 'Эскроу система защищает обе стороны. Оплата только после выполнения заказа',
      icon: '🔒',
    },
    {
      title: 'Детальная аналитика',
      description: 'Точные метрики охвата, вовлеченности и ROI для каждой кампании',
      icon: '📊',
    },
  ];

  const defaultStats = {
    totalBloggers: 5000,
    totalAdvertisers: 1500,
    totalOrders: 10000,
    totalRevenue: 50000000,
  };

  const defaultFAQ = [
    {
      question: 'Как найти подходящего блогера?',
      answer: 'Используйте расширенные фильтры по категории, аудитории, геолокации и бюджету. Наш AI-алгоритм также предложит идеальные варианты.',
    },
    {
      question: 'Как работает оплата?',
      answer: 'Деньги замораживаются на нашем эскроу-счете до выполнения заказа. После проверки контента рекламодателем происходит автоматическая оплата блогеру.',
    },
    {
      question: 'Нужно ли платить комиссию?',
      answer: 'Да, платформа берет небольшую комиссию с каждой успешной сделки. Для блогеров и рекламодателей комиссия составляет 10% с обеих сторон.',
    },
    {
      question: 'Как подключить свои соцсети?',
      answer: 'В личном кабинете есть раздел "Социальные аккаунты". Нажмите "Подключить" и следуйте инструкциям для VK, Telegram или TikTok.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Parallax Background Particles */}
      <ParallaxParticles />
      
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header-content"
          >
            <div className="logo-section">
              <div className="logo-icon">🌟</div>
              <span className="logo-text">InfluencerHub</span>
            </div>
            <nav className="header-nav">
              <Button 
                type="text" 
                className="nav-link"
                onClick={() => window.scrollTo({ top: (document.getElementById('features')?.offsetTop || 0) - 70, behavior: 'smooth' })}
              >
                Возможности
              </Button>
              <Button 
                type="text" 
                className="nav-link"
                onClick={() => window.scrollTo({ top: (document.getElementById('faq')?.offsetTop || 0) - 70, behavior: 'smooth' })}
              >
                FAQ
              </Button>
              <Button 
                type="text" 
                className="nav-link"
                onClick={() => navigate('/login')}
              >
                Войти
              </Button>
              <Button 
                type="primary" 
                className="nav-button-primary"
                onClick={() => navigate('/register')}
              >
                Регистрация
              </Button>
          </nav>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-gradient" />
        <motion.div 
          className="hero-parallax-bg"
          style={{ y: heroY, opacity: heroOpacity }}
        />
        
        {/* Floating декоративные элементы */}
        <div className="hero-decoration">
          <motion.div 
            className="hero-orb hero-orb-1"
            animate={{ 
              y: [0, 30, 0],
              x: [0, 20, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="hero-orb hero-orb-2"
            animate={{ 
              y: [0, -25, 0],
              x: [0, -15, 0],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div 
            className="hero-orb hero-orb-3"
            animate={{ 
              y: [0, 35, 0],
              x: [0, -25, 0],
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>

        {/* Градиентные кольца */}
        <div className="hero-rings">
          <motion.div 
            className="hero-ring hero-ring-1"
            animate={{ 
              rotate: 360,
            }}
            transition={{ 
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="hero-ring hero-ring-2"
            animate={{ 
              rotate: -360,
            }}
            transition={{ 
              duration: 60,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hero-badge"
            >
              <span>✨ Новые возможности уже доступны</span>
            </motion.div>

            <Title className="hero-title">
              {(landingData as LandingData)?.hero?.title || 'Найдите идеального блогера для вашего бренда'}
            </Title>
            <Paragraph className="hero-subtitle">
              {(landingData as LandingData)?.hero?.subtitle || 'Платформа для поиска и сотрудничества с инфлюенсерами. Быстро, просто, эффективно.'}
            </Paragraph>
            
            <div className="hero-cta">
              <Button
                type="primary"
                size="large"
                className="cta-button primary"
                onClick={() => handleRegister('advertiser')}
                icon={<ArrowRightOutlined />}
              >
                Для рекламодателей
              </Button>
              <Button
                type="default"
                size="large"
                className="cta-button"
                onClick={() => handleRegister('blogger')}
              >
                Для блогеров
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics */}
      <section className="statistics-section">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="stats-grid"
          >
            {[
              { 
                icon: '📱', 
                label: 'Активных блогеров', 
                value: landingData?.stats?.totalBloggers || defaultStats.totalBloggers, 
                suffix: '+' 
              },
              { 
                icon: '💼', 
                label: 'Рекламодателей', 
                value: landingData?.stats?.totalAdvertisers || defaultStats.totalAdvertisers, 
                suffix: '+' 
              },
              { 
                icon: '✅', 
                label: 'Завершено заказов', 
                value: landingData?.stats?.totalOrders || defaultStats.totalOrders, 
                suffix: '+' 
              },
              { 
                icon: '💰', 
                label: 'Выплачено блогерам', 
                value: Math.round((landingData?.stats?.totalRevenue || defaultStats.totalRevenue) / 1000000), 
                suffix: ' млн ₽' 
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="stat-card"
              >
                <div className="stat-card-content">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.value}{stat.suffix}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <Title level={2} className="section-title">
              Почему выбирают нас?
            </Title>
            <Paragraph className="section-subtitle">
              Современные инструменты для эффективного сотрудничества блогеров и рекламодателей
            </Paragraph>
          </motion.div>

          <Row gutter={[24, 24]} className="features-grid">
            {(landingData as LandingData)?.features?.map((feature, index) => (
              <Col xs={24} sm={12} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                      <Card className="feature-card" bordered={false}>
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon-reel">
                        {feature.icon || '✨'}
                      </div>
                    </div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="feature-description">{feature.description}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            )) || defaultFeatures.map((feature, index) => (
              <Col xs={24} sm={12} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="feature-card" bordered={false}>
                    <div className="feature-icon-wrapper">
                      <div className="feature-icon-reel">
                        {feature.icon}
                      </div>
                    </div>
                    <Title level={4}>{feature.title}</Title>
                    <Paragraph className="feature-description">{feature.description}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Services */}
      {services && services.length > 0 && (
        <section className="services-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-header"
            >
              <Title level={2} className="section-title">
                Наши услуги
              </Title>
              <Paragraph className="section-subtitle">
                Выберите подходящий тариф для вашего бизнеса
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="services-grid">
              {services.map((service: { name: string; price: number; period: string; description?: string; features?: string[]; targetRole?: string }, index: number) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -10 }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                  >
                    <Card 
                      className={`service-card ${index === Math.floor(services.length / 2) ? 'service-card-featured' : ''}`}
                      bordered={false}
                    >
                      {index === Math.floor(services.length / 2) && (
                        <div className="service-badge">
                          <span>Популярно</span>
                        </div>
                      )}
                      
                      <div className="service-header">
                        <div className="service-icon-wrapper">
                          <div className="service-icon">✨</div>
                        </div>
                        <Title level={3} className="service-title">{service.name}</Title>
                        <Paragraph className="service-description">
                          {service.description || `Идеально подходит для ${service.name.toLowerCase()}`}
                        </Paragraph>
                      </div>

                      <div className="service-pricing">
                        <div className="service-price-main">
                          <span className="service-price-amount">{service.price}</span>
                          <span className="service-price-currency">₽</span>
                        </div>
                        <span className="service-period">{service.period}</span>
                      </div>

                      <div className="service-features-container">
                        <ul className="service-features">
                          {service.features?.map((feature: string, idx: number) => (
                            <li key={idx} className="service-feature-item">
                              <CheckCircleOutlined className="service-feature-icon" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        type="primary" 
                        block 
                        size="large" 
                        className="service-button"
                        onClick={() => navigate(`/register?role=${service.targetRole || 'advertiser'}`)}
                      >
                        Выбрать план
                      </Button>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <Title level={2} className="section-title">
              Часто задаваемые вопросы
            </Title>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="faq-content"
          >
            <Collapse
              items={(landingData as LandingData)?.faq?.map((item, index) => ({
                key: String(index),
                label: item.question,
                children: <Paragraph>{item.answer}</Paragraph>,
              })) || defaultFAQ.map((item, index) => ({
                key: String(index),
                label: item.question,
                children: <Paragraph>{item.answer}</Paragraph>,
              }))}
              className="faq-accordion"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <Title level={2} className="cta-title">
              Готовы начать?
            </Title>
            <Paragraph className="cta-subtitle">
              Присоединяйтесь к тысячам пользователей уже сегодня
            </Paragraph>
            <div className="cta-buttons">
              <Button
                type="primary"
                size="large"
                className="cta-button primary"
                onClick={() => navigate('/register')}
              >
                Создать аккаунт
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo-section">
                <div className="footer-logo-icon">🌟</div>
                <span className="footer-logo-text">InfluencerHub</span>
              </div>
              <Paragraph className="footer-description">
                Платформа для эффективного сотрудничества блогеров и рекламодателей. 
                Находим идеальное совпадение для вашего бизнеса.
              </Paragraph>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="ВКонтакте">📱</a>
                <a href="#" className="social-link" aria-label="Telegram">✈️</a>
                <a href="#" className="social-link" aria-label="Instagram">📸</a>
              </div>
            </div>
            
            <div className="footer-column">
              <Title level={5} className="footer-column-title">Платформа</Title>
              <div className="footer-links-list">
                <a href="#features" className="footer-link">Возможности</a>
                <a href="#faq" className="footer-link">FAQ</a>
                <a href="/register?role=blogger" className="footer-link">Для блогеров</a>
                <a href="/register?role=advertiser" className="footer-link">Для рекламодателей</a>
              </div>
            </div>

            <div className="footer-column">
              <Title level={5} className="footer-column-title">Ресурсы</Title>
              <div className="footer-links-list">
                <a href="#" className="footer-link">Документация</a>
                <a href="#" className="footer-link">API</a>
                <a href="#" className="footer-link">Блог</a>
                <a href="#" className="footer-link">Поддержка</a>
              </div>
            </div>

            <div className="footer-column">
              <Title level={5} className="footer-column-title">Контакты</Title>
              <div className="footer-links-list">
                <a href="mailto:info@influencerhub.ru" className="footer-link">
                  📧 info@influencerhub.ru
                </a>
                <a href="tel:+79991234567" className="footer-link">
                  📞 +7 (999) 123-45-67
                </a>
                <span className="footer-link" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  🕐 Ежедневно с 9:00 до 21:00
                </span>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <Paragraph className="footer-copyright">
                © 2025 InfluencerHub. Все права защищены.
              </Paragraph>
              <div className="footer-legal">
                <a href="#" className="footer-legal-link">Политика конфиденциальности</a>
                <a href="#" className="footer-legal-link">Условия использования</a>
                <a href="#" className="footer-legal-link">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
