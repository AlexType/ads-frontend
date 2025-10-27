import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './error.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-content">
          <div className="error-number">
            <span className="number">4</span>
            <div className="box">
              <div className="shadow"></div>
              <div className="glow"></div>
            </div>
            <span className="number">4</span>
          </div>
          
          <h1 className="error-title">Упс! Страница не найдена</h1>
          <p className="error-description">
            Похоже, что страница, которую вы ищете, не существует или была перемещена.
            <br />
            Не волнуйтесь, давайте вернемся на главную!
          </p>
          
          <div className="error-actions">
            <Button 
              type="primary" 
              size="large"
              onClick={() => navigate('/')}
              className="home-button"
            >
              Вернуться на главную
            </Button>
            <Button 
              size="large"
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Назад
            </Button>
          </div>
          
          <div className="error-illustration">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

