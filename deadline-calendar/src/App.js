import React, { useState, useEffect } from 'react';

function App() {
  // Загружаем из localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('deadlines');
    if (saved) return JSON.parse(saved);
    // Начальные примеры
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 5);
    
    return [
      { id: 1, name: 'Сдать отчет по React', date: tomorrow.toISOString().split('T')[0] },
      { id: 2, name: 'Сдать лабу Беловой', date: tomorrow.toISOString().split('T')[0] },
      { id: 3, name: 'Подготовить презентацию', date: nextWeek.toISOString().split('T')[0] },
      { id: 4, name: 'Закончить лабораторную работу', date: lastWeek.toISOString().split('T')[0] },
    ];
  });

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [filter, setFilter] = useState('all');

  // Сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem('deadlines', JSON.stringify(tasks));
  }, [tasks]);

  // Текущая дата
  const today = new Date();
  const currentDate = today.toLocaleDateString('ru-RU');

  // Проверка просрочки
  const isOverdue = (dateStr) => {
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return taskDate < todayDate;
  };

  // Проверка на текущей неделе
  const isThisWeek = (dateStr) => {
    const taskDate = new Date(dateStr);
    const todayDate = new Date();
    const startOfWeek = new Date(todayDate);
    startOfWeek.setDate(todayDate.getDate() - todayDate.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };

  // Добавление
  const addTask = () => {
    if (newTaskName.trim() === '') {
      alert('Введите название задания');
      return;
    }
    if (!newTaskDate) {
      alert('Выберите дату дедлайна');
      return;
    }
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      date: newTaskDate,
    };
    setTasks([...tasks, newTask]);
    setNewTaskName('');
    setNewTaskDate('');
  };

  // Удаление
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Сортировка
  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Фильтрация
  let filteredTasks = sortedTasks;
  if (filter === 'week') {
    filteredTasks = sortedTasks.filter(task => isThisWeek(task.date));
  } else if (filter === 'overdue') {
    filteredTasks = sortedTasks.filter(task => isOverdue(task.date));
  }

  // Общий стиль для эффекта жидкого стекла
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Заголовок с эффектом стекла */}
        <h1 style={{
          ...glassStyle,
          textAlign: 'center',
          padding: '20px',
          marginBottom: '20px',
          color: 'white',
          textShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontSize: '2.5rem'
        }}>
          📅 Календарь дедлайнов
        </h1>

        {/* Текущая дата с эффектом стекла */}
        <div style={{
          ...glassStyle,
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          🗓️ Сегодня: <strong>{currentDate}</strong>
        </div>

        {/* Форма добавления с эффектом стекла */}
        <div style={{
          ...glassStyle,
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>➕ Добавить задание</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              placeholder="Название задания"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: '12px 20px',
                backgroundColor: '#5a67d8',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              Добавить
            </button>
          </div>
        </div>

        {/* Фильтры с эффектом стекла */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...glassStyle,
              padding: '10px 20px',
              backgroundColor: filter === 'all' ? 'rgba(90, 103, 216, 0.8)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Все задания
          </button>
          <button
            onClick={() => setFilter('week')}
            style={{
              ...glassStyle,
              padding: '10px 20px',
              backgroundColor: filter === 'week' ? 'rgba(90, 103, 216, 0.8)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            На этой неделе
          </button>
          <button
            onClick={() => setFilter('overdue')}
            style={{
              ...glassStyle,
              padding: '10px 20px',
              backgroundColor: filter === 'overdue' ? 'rgba(220, 53, 69, 0.8)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Просроченные
          </button>
        </div>

        {/* Список заданий с эффектом стекла */}
        {filteredTasks.length === 0 ? (
          <div style={{
            ...glassStyle,
            padding: '40px',
            textAlign: 'center',
            color: 'white',
            fontSize: '18px'
          }}>
            🎉 Нет заданий! Отдыхайте...
          </div>
        ) : (
          filteredTasks.map(task => {
            const overdue = isOverdue(task.date);
            const week = isThisWeek(task.date);
            return (
              <div
                key={task.id}
                style={{
                  ...glassStyle,
                  padding: '15px',
                  marginBottom: '10px',
                  background: overdue 
                    ? 'rgba(220, 53, 69, 0.3)' 
                    : (week ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 255, 255, 0.2)'),
                  borderLeft: overdue 
                    ? '4px solid #dc3545' 
                    : (week ? '4px solid #ffc107' : '4px solid #28a745'),
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'white' }}>{task.name}</h3>
                    <p style={{ margin: 0, color: overdue ? '#ffcccc' : '#e0e0e0' }}>
                      📅 Дедлайн: {new Date(task.date).toLocaleDateString('ru-RU')}
                      {overdue && <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#ff9999' }}>⚠️ ПРОСРОЧЕНО!</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      backgroundColor: 'rgba(220, 53, 69, 0.8)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      backdropFilter: 'blur(5px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(220, 53, 69, 1)';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(220, 53, 69, 0.8)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;