/**
 * Tracker v6 — Health Integration Module
 * Handles:
 * - Apple Health XML import
 * - Prescription medication auto-loading
 * - Health data syncing to server
 * - Service Worker notifications for medication reminders
 */

/**
 * APPLE HEALTH IMPORT
 */
function openAppleHealthImportDialog() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'appleHealthImportModal';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2>Importar pesos desde Apple Health</h2>
        <button type="button" class="modal-close" onclick="closeModal('appleHealthImportModal')">✕</button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 1rem;">Selecciona el archivo export.xml de tu exportación de Apple Health.</p>
        <input type="file" id="appleHealthFile" accept=".xml" style="margin-bottom: 1rem; display: block; width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: var(--radius-md);">
        <div id="importStatus" style="margin: 1rem 0; padding: 1rem; border-radius: var(--radius-md); display: none;"></div>
        <button type="button" class="btn primary" onclick="importAppleHealthFile()" style="width: 100%;">Importar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal('appleHealthImportModal');
  });
}

function importAppleHealthFile() {
  const fileInput = document.getElementById('appleHealthFile');
  const file = fileInput?.files?.[0];

  if (!file) {
    showImportStatus('Por favor, selecciona un archivo.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    const xmlData = e.target?.result;
    if (!xmlData) {
      showImportStatus('Error al leer el archivo.', 'error');
      return;
    }

    showImportStatus('Importando...', 'info');

    try {
      const response = await fetch('/api/tracker/import-apple-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xmlData })
      });

      const data = await response.json();

      if (!response.ok) {
        showImportStatus(`Error: ${data.error}`, 'error');
        return;
      }

      showImportStatus(
        `✓ Importados: ${data.imported} pesos<br>` +
        `Duplicados ignorados: ${data.duplicates}<br>` +
        `Errores: ${data.errors.length}`,
        'success'
      );

      // Reload health data
      setTimeout(() => {
        closeModal('appleHealthImportModal');
        loadHealthDataAndRender();
      }, 1500);
    } catch (error) {
      showImportStatus(`Error de conexión: ${error.message}`, 'error');
    }
  };

  reader.readAsText(file);
}

function showImportStatus(message, type) {
  const statusEl = document.getElementById('importStatus');
  if (!statusEl) return;

  statusEl.style.display = 'block';
  statusEl.innerHTML = message;
  statusEl.className = `banner ${type}`;
}

/**
 * AUTO-LOAD PRESCRIPTION MEDICATIONS
 */
async function autoLoadPrescriptionMedications() {
  try {
    // Check if medications already loaded for today
    const today = new Date().toISOString().split('T')[0];
    const todayRec = state.records[today];

    if (todayRec?.medications && todayRec.medications.length > 0) {
      console.log('[tracker-health] Medications already loaded for today');
      return;
    }

    // Query API for medications
    const response = await fetch('/api/tracker/preset-medications');
    if (!response.ok) return;

    const data = await response.json();
    const medications = data.medications || [];

    if (medications.length === 0) {
      console.log('[tracker-health] No medications to load');
      return;
    }

    // Sync medications to local state
    if (!state.records[today]) {
      state.records[today] = blank(today);
    }

    state.records[today].medications = medications.map(med => ({
      medicationId: med.id,
      nombre: med.name,
      dosis: `${med.doseMg}${med.unit}`,
      via: 'oral',
      horarios: med.scheduledTimes || [],
      estado: med.isActive ? 'activo' : 'inactivo',
      fecha_inicio: med.startDate,
      fecha_fin: med.endDate || null
    }));

    save();
    console.log(`[tracker-health] Loaded ${medications.length} medications`);
  } catch (error) {
    console.error('[tracker-health] Failed to load prescription medications:', error);
  }
}

/**
 * LOAD HEALTH DATA (WEIGHTS + MEDICATIONS)
 */
async function loadHealthDataAndRender() {
  try {
    const date = currentDate || today();
    const response = await fetch(`/api/tracker/health-sync?date=${encodeURIComponent(date)}`);

    if (!response.ok) {
      console.warn('[tracker-health] Failed to load health data');
      return;
    }

    const data = await response.json();

    // Update state with weights
    if (data.weights && data.weights.length > 0) {
      if (!state.records[date]) {
        state.records[date] = blank(date);
      }
      state.records[date].weights = data.weights;
    }

    // Update state with medications
    if (data.medications && data.medications.length > 0) {
      if (!state.records[date]) {
        state.records[date] = blank(date);
      }
      state.records[date].medications = data.medications.map(med => ({
        medicationId: med.id,
        nombre: med.name,
        dosis: `${med.doseMg}${med.unit}`,
        via: 'oral',
        horarios: med.scheduledTimes || [],
        estado: med.isActive ? 'activo' : 'inactivo'
      }));
    }

    save();
    render();
  } catch (error) {
    console.error('[tracker-health] Error loading health data:', error);
  }
}

/**
 * RECORD MEDICATION DOSE
 */
async function recordMedicationDose(doseId, taken) {
  try {
    const response = await fetch('/api/tracker/medication-doses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doseId,
        taken,
        takenAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('[tracker-health] Failed to record dose');
      return;
    }

    const data = await response.json();
    console.log('[tracker-health] Dose recorded:', data.dose);

    // Sync to local state and save
    save();
  } catch (error) {
    console.error('[tracker-health] Error recording dose:', error);
  }
}

/**
 * HEALTH SYNC TO SERVER
 */
async function syncHealthData() {
  try {
    const date = currentDate || today();
    const day = state.records[date];

    const weightsToSync = day.weights || [];
    const dosesToSync = (day.medications || []).flatMap(med =>
      (med.horarios || []).map(time => ({
        time,
        taken: med.estado === 'tomado'
      }))
    );

    const response = await fetch('/api/tracker/health-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weights: weightsToSync.map(w => ({
          date: date,
          weightKg: w.value || w.weightKg,
          notes: w.notes
        })),
        doseTaken: dosesToSync
      })
    });

    if (!response.ok) {
      console.warn('[tracker-health] Health sync failed');
      return;
    }

    const data = await response.json();
    console.log('[tracker-health] Health sync successful:', data);
  } catch (error) {
    console.warn('[tracker-health] Error syncing health data:', error);
  }
}

/**
 * SERVICE WORKER MEDICATION NOTIFICATIONS
 */
function setupMedicationNotifications() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      // Request permission
      if (Notification.permission === 'granted') {
        registerMedicationReminders();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            registerMedicationReminders();
          }
        });
      }
    });
  }
}

function registerMedicationReminders() {
  // Schedule reminders for each medication dose today
  const today = new Date().toISOString().split('T')[0];
  const medications = state.records[today]?.medications || [];

  medications.forEach(med => {
    (med.horarios || []).forEach(time => {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const doseTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (doseTime > now) {
        const delay = doseTime.getTime() - now.getTime();
        setTimeout(() => {
          showMedicationNotification(med.nombre, time);
        }, delay);
      }
    });
  });
}

function showMedicationNotification(medicationName, time) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      title: `Toma medicamento: ${medicationName}`,
      body: `Hora: ${time}`,
      tag: `med-${medicationName}-${time}`,
      requireInteraction: true
    });
  }
}

/**
 * INIT HEALTH INTEGRATION
 * Call this after the main app initialization
 */
async function initHealthIntegration() {
  console.log('[tracker-health] Initializing health integration...');

  // Try to load prescription medications
  await autoLoadPrescriptionMedications();

  // Load health data for current date
  await loadHealthDataAndRender();

  // Setup medication notifications
  setupMedicationNotifications();

  console.log('[tracker-health] Health integration ready');
}

// Export for use in app
window.openAppleHealthImportDialog = openAppleHealthImportDialog;
window.importAppleHealthFile = importAppleHealthFile;
window.autoLoadPrescriptionMedications = autoLoadPrescriptionMedications;
window.loadHealthDataAndRender = loadHealthDataAndRender;
window.recordMedicationDose = recordMedicationDose;
window.syncHealthData = syncHealthData;
window.initHealthIntegration = initHealthIntegration;
