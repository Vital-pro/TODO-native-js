const tasks = [
  {
    _id: '1',
    completed: true,
    body: '111Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, velit blanditiis. Atque sint culpa rerum. Error adipisci, explicabo possimus animi quae perferendis aliquam quibusdam, nulla a dolore doloremque dolorum ipsam.\r\n',
    title: '111 Lorem ipsum dolor sit amet consectetur',
  },
  {
    _id: '2',
    completed: false,
    body: '222Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, velit blanditiis. Atque sint culpa rerum. Error adipisci, explicabo possimus animi quae perferendis aliquam quibusdam, nulla a dolore doloremque dolorum ipsam.\r\n',
    title: '222 dolor sit amet consectetur dolor sit amet consectetur Lorem ipsum dolor sit amet consectetur',
  },
  {
    _id: '3',
    completed: true,
    body: '333Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores, velit blanditiis. Atque sint culpa rerum. Error adipisci, explicabo possimus animi quae perferendis aliquam quibusdam, nulla a dolore doloremque dolorum ipsam.\r\n',
    title: '333 Lorem ipsum dolor sit amet consectetur',
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  //! Themes
  const themes = {
    default: {
      '--bs-body-bg': '#ffffffe6',
      '--bs-primary-rgb': '16,226,253',
      '--bg-green': '#4caf50c7',
      '--bg-red': '#dc359bbd',
      
    },
    dark: {
      '--bs-body-bg': '#cecece',
      '--bs-primary-rgb': '63,65,78',
      '--bg-green': '#2b662b',
      '--bg-red': '#9c27b0',


    },
    light: {
      '--bs-body-bg': '#fff',
      '--bs-primary-rgb': '255,235,59',
      '--bg-green': 'lightgreen',
      '--bg-red': '#dc359b4f',

    },
  };
  // let lastSelectedTheme = 'default';
  let lastSelectedTheme = localStorage.getItem('app_theme') || 'default';
  console.log(lastSelectedTheme);
  


  // *  Elements UI
  const listContainer = document.querySelector(
    '.tasks-list-section .list-group'
  );
  const form = document.forms['addTask']
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  //* select для выбора темы
  const themeSelect = document.getElementById('themeSelect');


  // *  Здесь сделаем вызовы всех ф-ций и подпишемся на все будущие события, которые будут здесь происходить, а ф-ции будут идти ниже
  // * Events
  setTheme(lastSelectedTheme)
  renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  //* обработчик события выбора темы? вешаем на select
  themeSelect.addEventListener('change', onThemeSelectHandler);


  // * Выводим задачи на страницу (помещаем в DOM)
  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач');
      return;
    }

    // т.к. модификация DOM задача ресурсозатратная, создадим фрагмент, чтобы не добавлять элементы по отдельности
    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  //* ф-ция для добавления новой задачи в DOM
  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2'
    );
    li.setAttribute('data-task-id', _id);
    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'm-xl-6', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.appendChild(article);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;
    if (!titleValue || !bodyValue) {
      alert('Заполните все поля');
      return;
    }

    const task = createNewTasks(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement('afterbegin',listItem);
    form.reset();

  }

  function createNewTasks(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.round(Math.random() * 10 + 1)}`,
    }
    objOfTasks[newTask._id] = newTask;
    return {...newTask}
  }

  function deleteTask(id) {
    const {title} = objOfTasks[id];
    const isConfirm = confirm(`Вы действительно хотите удалить задачу ${title}?`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function deletTaskFromHtml(confirmed, el) {
    if(!confirmed) return;
    el.remove();
  }

  function onDeleteHandler({ target } ) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deletTaskFromHtml(confirmed, parent);
    }
  }

  //* Обработчики события изменения select-a
  function onThemeSelectHandler(e) {
    const selectedTheme = themeSelect.value;
    const isConfirmed = confirm(`Вы действительно хотите изменить тему: ${selectedTheme}?`);
    if(!isConfirmed) {
      themeSelect.value = lastSelectedTheme;
      return
    };
    setTheme(selectedTheme);
    lastSelectedTheme = selectedTheme;
    localStorage.setItem('app_theme', selectedTheme);
  }

  //* Ф-ция для непосредственной установки темы (вдруг понадобится установить тему, приходящую с сервера)
  function setTheme(name) {
    const selectedThemeObj = themes[name];
    // console.log(selectedThemeObj);
    Object.entries(selectedThemeObj).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }




})(tasks);
