import { rtdb } from './firebase.js';
import { ref, push, onValue, set, remove, update } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

const form = document.getElementById('task-form');
const list = document.getElementById('tasks-list');
const titleInput = document.getElementById('title');
const deadlineInput = document.getElementById('deadline');
const filterBtns = document.querySelectorAll('.filter');
const alarmBtn = document.getElementById('alarm-permission-btn');

window.addEventListener('DOMContentLoaded', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  deadlineInput.value = tomorrow.toISOString().split('T')[0];
  loadTasks();
});

let curFilter = 'all';

function loadTasks() {
  onValue(ref(rtdb, 'tasks'), snapshot => {
    list.innerHTML = '';
    const data = snapshot.val() || {};
    Object.entries(data).forEach(([id, t]) => {
      if (curFilter === 'active' && t.done) return;
      if (curFilter === 'done' && !t.done) return;
      const li = document.createElement('li');
      li.className = t.done ? 'done' : 'active';
      const soon = !t.done && (new Date(t.deadline) - Date.now())/86400000 < 2;
      li.innerHTML = `
        <span class="task-title">
          ${t.done ? '✔️' : soon ? '⏰' : '📝'} 
          ${t.title} 
          <span class="${soon ? 'deadline-soon' : ''}">(${t.deadline})</span>
        </span>
        <span class="task-actions">
          <button onclick="toggleDone('${id}', ${!t.done})">${t.done ? '↩️ 복원' : '✅ 완료'}</button>
          <button onclick="editTask('${id}', '${t.title}', '${t.deadline}')">✏️ 수정</button>
          <button onclick="deleteTask('${id}')">🗑️ 삭제</button>
        </span>
      `;
      list.appendChild(li);
    });
    showPushAlarm(data);
  });
}

form.onsubmit = async e => {
  e.preventDefault();
  const todo = {
    title: titleInput.value,
    deadline: deadlineInput.value || tomorrowDate(),
    done: false
  };
  await push(ref(rtdb, 'tasks'), todo);
  form.reset();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  deadlineInput.value = tomorrow.toISOString().split('T')[0];
};
function tomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

filterBtns.forEach(btn => {
  btn.onclick = () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    curFilter = btn.dataset.status;
    loadTasks();
  };
});
filterBtns[0].classList.add('active');

window.toggleDone = (id, newDone) => {
  update(ref(rtdb, 'tasks/' + id), { done: newDone });
};
window.deleteTask = id => {
  remove(ref(rtdb, 'tasks/' + id));
};
window.editTask = (id, title, deadline) => {
  const newTitle = prompt('수정할 할일', title);
  const newDeadline = prompt('수정할 날짜', deadline);
  if (newTitle && newDeadline)
    update(ref(rtdb, 'tasks/' + id), { title: newTitle, deadline: newDeadline });
};

// ----------- 알림/푸시 기능 ------------------
function showPushAlarm(data) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  Object.entries(data || {}).forEach(([id, t]) => {
    const soon = !t.done && (new Date(t.deadline) - Date.now())/86400000 < 1 && (new Date(t.deadline) - Date.now()) > 0;
    if (soon) {
      if (!localStorage.getItem('notified-' + id)) {
        new Notification('[마감 임박] ' + t.title, {
          body: `할일: ${t.title}\n마감: ${t.deadline}`
        });
        localStorage.setItem('notified-' + id, 'Y');
      }
    } else {
      localStorage.removeItem('notified-' + id);
    }
  });
}
if ('Notification' in window) {
  alarmBtn.onclick = function() {
    Notification.requestPermission().then(function(permission) {
      if(permission === 'granted') {
        alert('브라우저 알림이 활성화되었습니다!');
      } else {
        alert('알림이 거부됨');
      }
    });
  };
}
