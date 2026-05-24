import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('deadlines');
    if (saved) return JSON.parse(saved);
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

  useEffect(() => {
    localStorage.setItem('deadlines', JSON.stringify(tasks));
  }, [tasks]);

  const todayDate = new Date();
  const currentDate = todayDate.toLocaleDateString('ru-RU');

  const isOverdue = (dateStr) => {
    const taskDate = new Date(dateStr);
    taskDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const isThisWeek = (dateStr) => {
    const taskDate = new Date(dateStr);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return taskDate >= startOfWeek && taskDate <= endOfWeek;
  };

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

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const sortedTasks = [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));

  let filteredTasks = sortedTasks;
  if (filter === 'week') {
    filteredTasks = sortedTasks.filter(task => isThisWeek(task.date));
  } else if (filter === 'overdue') {
    filteredTasks = sortedTasks.filter(task => isOverdue(task.date));
  }

  // 🔥 УСИЛЕННЫЙ ЭФФЕКТ ЖИДКОГО СТЕКЛА (как на iPhone)
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(15px) saturate(180%)',
    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px',
      backgroundImage: 'url("/фон2.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        {/* Заголовок */}
        <h1 style={{
          ...glassStyle,
          textAlign: 'center',
          padding: '24px 20px',
          marginBottom: '24px',
          color: 'white',
          textShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontSize: '2.2rem',
          letterSpacing: '-0.5px',
          fontWeight: '600'
        }}>
          📅 Календарь дедлайнов
        </h1>

        {/* Текущая дата */}
        <div style={{
          ...glassStyle,
          padding: '18px',
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: '500',
          color: 'white',
          background: 'rgba(255, 255, 255, 0.15)',
        }}>
          🗓️ Сегодня: <strong style={{ fontWeight: '600' }}>{currentDate}</strong>
        </div>

        {/* Форма добавления */}
        <div style={{
          ...glassStyle,
          padding: '24px',
          marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '1.3rem', fontWeight: '500' }}>➕ Добавить задание</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              placeholder="Название задания"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              style={{
                flex: 2,
                padding: '14px 16px',
                borderRadius: '24px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            />
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
              style={{
                padding: '14px 16px',
                borderRadius: '24px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            <button
              onClick={addTask}
              style={{
                padding: '14px 28px',
                background: 'rgba(90, 103, 216, 0.9)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '32px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.background = 'rgba(90, 103, 216, 1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(90, 103, 216, 0.9)';
              }}
            >
              Добавить
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'all', label: 'Все задания', color: '90, 103, 216' },
            { key: 'week', label: 'На этой неделе', color: '90, 103, 216' },
            { key: 'overdue', label: 'Просроченные', color: '220, 53, 69' }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              style={{
                ...glassStyle,
                padding: '12px 24px',
                background: filter === btn.key 
                  ? `rgba(${btn.color}, 0.75)` 
                  : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '40px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.2s',
                backdropFilter: filter === btn.key ? 'blur(8px)' : 'blur(12px)'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Список заданий */}
        {filteredTasks.length === 0 ? (
          <div style={{
            ...glassStyle,
            padding: '48px 24px',
            textAlign: 'center',
            color: 'white',
            fontSize: '18px',
            background: 'rgba(255,255,255,0.15)'
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
                  padding: '18px 20px',
                  marginBottom: '12px',
                  background: overdue 
                    ? 'rgba(220, 53, 69, 0.35)' 
                    : (week ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 255, 255, 0.2)'),
                  borderLeft: overdue 
                    ? '4px solid #ff6b6b' 
                    : (week ? '4px solid #ffd966' : '4px solid #6fcf97'),
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>{task.name}</h3>
                    <p style={{ margin: 0, color: overdue ? '#ffe0e0' : '#f0f0f0', fontSize: '0.9rem' }}>
                      📅 Дедлайн: {new Date(task.date).toLocaleDateString('ru-RU')}
                      {overdue && <span style={{ marginLeft: '12px', fontWeight: 'bold', color: '#ffb3b3' }}>⚠️ ПРОСРОЧЕНО!</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{
                      background: 'rgba(220, 53, 69, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      padding: '8px 22px',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(220, 53, 69, 1)';
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(220, 53, 69, 0.85)';
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