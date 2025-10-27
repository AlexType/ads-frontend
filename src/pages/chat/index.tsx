import { useState } from 'react';
import { Card, List, Avatar, Input, Button, Empty, App } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import { useChats, useChatMessages, useSendMessage, Chat, Message } from 'features/chat/api/chat.api';
import { useAuth } from 'app/providers/use-auth';
import './chat.css';

export const ChatListPage = () => {
  const { message } = App.useApp();
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState('');
  
  const { data: chats, isLoading } = useChats();
  const { data: messages, isLoading: messagesLoading } = useChatMessages(selectedChat || '');
  const sendMessage = useSendMessage();

  const selectedChatData = chats?.find(c => c._id === selectedChat);
  const otherParticipant = selectedChatData?.participants.find(p => p._id !== user?.id);

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedChat) return;
    
    try {
      await sendMessage.mutateAsync({
        chatId: selectedChat,
        content: messageContent,
      });
      setMessageContent('');
    } catch (error) {
      message.error('Не удалось отправить сообщение');
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-list-container">
        <Card>
          <h3>Чаты</h3>
          <List
            loading={isLoading}
            dataSource={chats}
            renderItem={(chat: Chat) => {
              const otherUser = chat.participants.find(p => p._id !== user?.id);
              const unreadCount = chat.unreadCount?.[user?.id || ''] || 0;
              
              return (
                <List.Item
                  key={chat._id}
                  className={selectedChat === chat._id ? 'active' : ''}
                  onClick={() => setSelectedChat(chat._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={otherUser?.avatar} icon={<UserOutlined />} />}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{otherUser?.firstName} {otherUser?.lastName}</span>
                        {unreadCount > 0 && (
                          <span style={{ backgroundColor: '#1890ff', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '12px' }}>
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    }
                    description={
                      <div style={{ fontSize: '12px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chat.lastMessage?.content || 'Нет сообщений'}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
          {chats?.length === 0 && <Empty description="Нет чатов" />}
        </Card>
      </div>

      <div className="chat-messages-container">
        {selectedChat ? (
          <Card>
            {otherParticipant && (
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                <h3>{otherParticipant.firstName} {otherParticipant.lastName}</h3>
              </div>
            )}
            
            <div className="messages-list">
              {messagesLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>}
              {messages?.map((msg: Message) => (
                <div
                  key={msg._id}
                  className={msg.senderId._id === user?.id ? 'message-right' : 'message-left'}
                >
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {messages?.length === 0 && <Empty description="Начните общение" />}
            </div>

            <div className="message-input">
              <Input.TextArea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Введите сообщение..."
                rows={2}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={sendMessage.isPending}
                disabled={!messageContent.trim()}
              >
                Отправить
              </Button>
            </div>
          </Card>
        ) : (
          <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <Empty description="Выберите чат" />
          </Card>
        )}
      </div>
    </div>
  );
};


