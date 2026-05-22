import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Palette, Database, Trash2, Download, ChevronRight, Info } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import { storage } from '../services/storage';
import { getSampleTasks } from '../data/sampleData';

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="label px-5 md:px-8 mb-2">{title}</p>
      <div className="mx-5 md:mx-8 card overflow-hidden divide-y divide-warm-100">
        {children}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, sub, children, onClick, iconColor = 'text-warm-400' }) {
  const El = onClick ? 'button' : 'div';
  return (
    <El
      className={`flex items-center gap-3 px-4 py-3.5 w-full text-left
                  ${onClick ? 'hover:bg-warm-50 transition-colors active:bg-warm-100' : ''}`}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-xl bg-warm-100 flex items-center justify-center shrink-0 ${iconColor}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-warm-800">{label}</p>
        {sub && <p className="text-xs text-warm-400 mt-0.5">{sub}</p>}
      </div>
      {children || (onClick && <ChevronRight size={16} className="text-warm-300 shrink-0" />)}
    </El>
  );
}

export default function Settings() {
  const { settings, updateSetting, updateSettings, resetSettings, tasks, addTask, deleteTask } = useApp();
  const [exportDone, setExportDone] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    const data = { tasks, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hogar-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.tasks && Array.isArray(data.tasks)) {
            storage.set('tasks', data.tasks);
            window.location.reload();
          }
        } catch {
          alert('Archivo no válido');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleResetData = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    storage.clear();
    window.location.reload();
  };

  const handleLoadSamples = () => {
    const samples = getSampleTasks();
    samples.forEach(t => addTask(t));
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-8 pb-6 md:px-8 md:pt-10">
        <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">Ajustes</h1>
      </div>

      {/* Personal */}
      <Section title="Personal">
        <Row icon={User} label="Nombre del hogar" sub={settings.userName}>
          <input
            type="text"
            value={settings.userName}
            onChange={e => updateSetting('userName', e.target.value)}
            className="text-sm text-right text-warm-700 bg-transparent outline-none w-32 font-medium"
            placeholder="Mi Hogar"
          />
        </Row>
      </Section>

      {/* Appearance */}
      <Section title="Apariencia">
        <Row icon={Palette} label="Modo compacto" sub="Tareas más pequeñas">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={e => updateSetting('compactMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-warm-200 peer-checked:bg-sage-500 rounded-full
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                            after:bg-white after:rounded-full after:h-5 after:w-5
                            after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </Row>
        <Row icon={Info} label="Mensajes motivacionales" sub="Frases de ánimo en el inicio">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showMotivation}
              onChange={e => updateSetting('showMotivation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-warm-200 peer-checked:bg-sage-500 rounded-full
                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                            after:bg-white after:rounded-full after:h-5 after:w-5
                            after:transition-all peer-checked:after:translate-x-4" />
          </label>
        </Row>
      </Section>

      {/* Defaults */}
      <Section title="Valores por defecto">
        <Row icon={Database} label="Duración por defecto" sub="Minutos al crear una tarea">
          <input
            type="number"
            min="5"
            max="480"
            step="5"
            value={settings.defaultDuration}
            onChange={e => updateSetting('defaultDuration', parseInt(e.target.value) || 15)}
            className="text-sm text-right text-warm-700 bg-transparent outline-none w-14 font-medium"
          />
        </Row>
        <Row icon={Database} label="Semana empieza el" sub="">
          <select
            value={settings.weekStartsOn}
            onChange={e => updateSetting('weekStartsOn', parseInt(e.target.value))}
            className="text-sm text-warm-700 bg-transparent outline-none font-medium text-right"
          >
            <option value={1}>Lunes</option>
            <option value={0}>Domingo</option>
          </select>
        </Row>
      </Section>

      {/* Data */}
      <Section title="Datos">
        <Row icon={Download} label="Exportar datos" sub="Descarga backup en JSON" onClick={handleExport}>
          {exportDone && <span className="text-xs text-sage-600 font-medium">✓ Exportado</span>}
        </Row>
        <Row icon={Download} label="Importar datos" sub="Carga un backup anterior" onClick={handleImport} />
        <Row icon={Database} label="Cargar tareas de ejemplo" sub="Añade tareas de demo" onClick={handleLoadSamples} />
      </Section>

      {/* Danger zone */}
      <Section title="Zona peligrosa">
        <Row
          icon={Trash2}
          label={confirmReset ? '¿Confirmar? Toca de nuevo' : 'Borrar todos los datos'}
          sub="Esta acción no se puede deshacer"
          onClick={handleResetData}
          iconColor="text-red-400"
        >
          <span className={`text-xs font-medium ${confirmReset ? 'text-red-600' : 'text-warm-300'}`}>
            {confirmReset ? 'Confirmar' : ''}
          </span>
        </Row>
      </Section>

      {/* About */}
      <div className="px-5 md:px-8 pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 bg-sage-500 rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-white text-base">🏡</span>
          </div>
          <span className="font-semibold text-warm-900">Hogar</span>
        </div>
        <p className="text-xs text-warm-400">
          v1.0.0 · Solo para uso personal<br />
          Datos guardados localmente en tu dispositivo
        </p>
        <p className="text-xs text-warm-300 mt-3">
          {tasks.length} tareas · Almacenamiento local activo
        </p>
      </div>
    </motion.div>
  );
}
