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
      { id: 2, name: 'Подготовить презентацию', date: nextWeek.toISOString().split('T')[0] },
      { id: 3, name: 'Закончить лабораторную работу', date: lastWeek.toISOString().split('T')[0] },
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

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1>📅 Календарь дедлайнов</h1>

      {/* Форма добавления */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: '#e9ecef' }}>
        <h3>➕ Добавить задание</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            placeholder="Название задания"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            style={{ flex: 2, padding: '8px' }}
          />
          <input
            type="date"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            style={{ padding: '8px' }}
          />
          <button
            onClick={addTask}
            style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Добавить
          </button>
        </div>
      </div>
{/* Фильтры */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '8px 15px', backgroundColor: filter === 'all' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Все задания</button>
        <button onClick={() => setFilter('week')} style={{ padding: '8px 15px', backgroundColor: filter === 'week' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>На этой неделе</button>
        <button onClick={() => setFilter('overdue')} style={{ padding: '8px 15px', backgroundColor: filter === 'overdue' ? '#dc3545' : '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Просроченные</button>
      </div>
      
      {/* Список заданий */}
      {filteredTasks.length === 0 ? (
        <p>Нет заданий</p>
      ) : (
        filteredTasks.map(task => {
          const overdue = isOverdue(task.date);
          const week = isThisWeek(task.date);
          return (
            <div
              key={task.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                background: overdue ? '#f8d7da' : (week ? '#fff3cd' : 'white'),
                borderLeft: overdue ? '5px solid #dc3545' : (week ? '5px solid #ffc107' : '5px solid #28a745')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>{task.name}</h3>
                  <p style={{ margin: 0, color: overdue ? '#dc3545' : '#666' }}>
                    📅 Дедлайн: {new Date(task.date).toLocaleDateString('ru-RU')}
                    {overdue && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>⚠️ ПРОСРОЧЕНО!</span>}
                  </p>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Удалить</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;