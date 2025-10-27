import { Modal, Form, Input, InputNumber, DatePicker, Select, Row, Col, Button } from 'antd';
import { useCreateCampaign } from 'features/campaign/api/campaign.api';

interface CreateCampaignModalProps {
  open: boolean;
  onClose: () => void;
}

export const CreateCampaignModal = ({ open, onClose }: CreateCampaignModalProps) => {
  const [form] = Form.useForm();
  const createCampaign = useCreateCampaign();

  const handleSubmit = async (values: any) => {
    await createCampaign.mutateAsync({
      title: values.title,
      campaignType: values.campaignType,
      description: values.description,
      budget: {
        total: values.budget,
      },
      targetAudience: {
        demographics: {},
        interests: values.interests || [],
        location: values.location,
      },
      startDate: values.dateRange[0].toISOString().split('T')[0],
      endDate: values.dateRange[1].toISOString().split('T')[0],
      categories: values.categories || [],
    });

    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Создать кампанию"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label="Название кампании"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Название кампании" />
        </Form.Item>

        <Form.Item
          name="campaignType"
          label="Тип кампании"
          rules={[{ required: true, message: 'Выберите тип' }]}
        >
          <Select placeholder="Выберите тип">
            <Select.Option value="awareness">Охват</Select.Option>
            <Select.Option value="engagement">Вовлеченность</Select.Option>
            <Select.Option value="sales">Продажи</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
        >
          <Input.TextArea rows={4} placeholder="Описание кампании" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateRange"
              label="Период"
              rules={[{ required: true, message: 'Выберите период' }]}
            >
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="budget"
              label="Бюджет (₽)"
              rules={[{ required: true, message: 'Введите бюджет' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Бюджет"
                min={0}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="categories"
          label="Категории"
        >
          <Select mode="multiple" placeholder="Выберите категории">
            <Select.Option value="lifestyle">Lifestyle</Select.Option>
            <Select.Option value="tech">Tech</Select.Option>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="fashion">Fashion</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="interests"
          label="Интересы"
        >
          <Select mode="tags" placeholder="Добавьте интересы" />
        </Form.Item>

        <Form.Item
          name="location"
          label="Геолокация"
        >
          <Input placeholder="Например: Москва" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={createCampaign.isPending}>
              Создать кампанию
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

