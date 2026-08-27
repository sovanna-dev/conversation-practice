import { db } from '../services/firebase.js';
import { addScene } from './sceneManager.js';

export const initAdminPanel = (userRole) => {
  const adminArea = document.getElementById('adminControlsArea');
  if (userRole === 'admin' && adminArea) {
    adminArea.style.display = 'block';
    setupAdminEventListeners();
  }
};

const setupAdminEventListeners = () => {
  // Scene Panel Toggle
  document.getElementById('sceneManagerBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('scenePanel');
    if (panel) panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });

  // Add Line Row logic
  document.getElementById('addLineRowBtn')?.addEventListener('click', () => {
    addNewLineRow();
  });

  // Save Scene logic
  document.getElementById('saveSceneBtn')?.addEventListener('click', () => {
    handleSaveScene();
  });

  // User Management Toggle
  document.getElementById('userManagementBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('userPanel');
    if (panel) {
      panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
      if (panel.style.display === 'block') refreshUserList();
    }
  });

  // Import JSON logic
  document.getElementById('importJsonBtn')?.addEventListener('click', () => {
    const jsonStr = document.getElementById('jsonImportArea')?.value;
    if (!jsonStr) return;
    try {
      const data = JSON.parse(jsonStr);
      const importedScenes = Array.isArray(data) ? data : [data];
      importedScenes.forEach(scene => addScene(scene));
      alert('✅ Imported successfully!');
      location.reload();
    } catch (err) {
      console.error('Scene import error:', err);
      alert('⚠ Invalid JSON format or scene structure');
    }
  });
};

const addNewLineRow = (speaker = 'A', en = '', km = '') => {
  const container = document.getElementById('newSceneLines');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'line-row';
  row.innerHTML = `
    <select class="row-speaker">
      <option value="A" ${speaker === 'A' ? 'selected' : ''}>A</option>
      <option value="B" ${speaker === 'B' ? 'selected' : ''}>B</option>
    </select>
    <input type="text" class="row-en" placeholder="English" value="${en}">
    <input type="text" class="row-km" placeholder="Khmer" value="${km}">
    <button class="ghost row-remove">✕</button>
  `;

  row.querySelector('.row-remove').onclick = () => row.remove();
  container.appendChild(row);
};

const handleSaveScene = () => {
  const topic = document.getElementById('newSceneTopic').value.trim();
  const rows = [...document.querySelectorAll('.line-row')];

  const dialogue = rows.map(r => ({
    speaker: r.querySelector('.row-speaker').value,
    text: r.querySelector('.row-en').value.trim(),
    khmer: r.querySelector('.row-km').value.trim()
  })).filter(d => d.text && d.khmer);

  if (topic && dialogue.length > 0) {
    addScene({
      topic,
      lines: dialogue.map(line => ({ speaker: line.speaker, en: line.text, km: line.khmer }))
    });
    alert('✅ Scene added successfully!');
    document.getElementById('newSceneTopic').value = '';
    document.getElementById('newSceneLines').innerHTML = '';
  } else {
    alert('⚠ Please fill in the topic and at least one line.');
  }
};

export const refreshUserList = async () => {
  const container = document.getElementById('userListContainer');
  if (!container) return;

  container.innerHTML = '<p>Loading users...</p>';
  try {
    const snapshot = await db.collection('users').get();
    container.innerHTML = '';
    snapshot.forEach(doc => {
      const user = doc.data();
      const div = document.createElement('div');
      div.className = 'user-list-item';
      div.innerHTML = `
        <span>${user.displayName || user.name || user.email || 'Unknown'} (${user.role || 'user'})</span>
        <button class="ghost role-toggle" data-uid="${doc.id}" data-role="${user.role === 'admin' ? 'user' : 'admin'}">
          Make ${user.role === 'admin' ? 'User' : 'Admin'}
        </button>
      `;
      container.appendChild(div);
      div.querySelector('.role-toggle')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        try {
          const nextRole = button.dataset.role;
          await db.collection('users').doc(button.dataset.uid).update({ role: nextRole });
          await refreshUserList();
        } catch (error) {
          console.error('Role update error:', error);
          alert('Unable to update user role.');
          button.disabled = false;
        }
      });
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading users.</p>';
  }
};
