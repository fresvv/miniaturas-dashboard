import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Sample data to demonstrate the dashboard. Each object represents
// a design task or miniatura. In a real deployment you would
// fetch data from your Google Sheets API endpoint instead of
// hard‑coding sample data. The `fecha` field should be in ISO
// format (YYYY‑MM‑DD) so it can be parsed reliably.
const sampleData = [
  {
    fecha: '2025-09-01',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 1',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=XD1GCWJPVfw',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-08',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 2',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=_ejBlSDA75Y',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-10',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 3',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=0hmnkWXACCU',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-15',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 4',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=65vtziRyUI8',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-15',
    canal: 'PopInt',
    servicio: 'Miniatura 5',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=N4euWxg5Ljc',
    cambios: 1,
    tipoCambio: 'live',
    honorarioBase: 20,
    honorarioCambio: 5,
    observaciones: '',
  },
  {
    fecha: '2025-09-15',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 6',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=XD1GCWJPVfw',
    cambios: 1,
    tipoCambio: 'post live',
    honorarioBase: 20,
    honorarioCambio: 5,
    observaciones: '',
  },
  {
    fecha: '2025-09-17',
    canal: 'PopInt',
    servicio: 'Miniatura 7',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=CPWQ1ky6uo0',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-22',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 8',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=DiMj1Z5NlHo',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-22',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 9',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=V5kfX5zkVrY&t=90s',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-22',
    canal: 'PopInt',
    servicio: 'Miniatura 10',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=N4euWxg5Ljc',
    cambios: 1,
    tipoCambio: 'post live',
    honorarioBase: 20,
    honorarioCambio: 5,
    observaciones: '',
  },
  {
    fecha: '2025-09-24',
    canal: 'PopInt',
    servicio: 'Miniatura 11',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=YiZwM3rMTdA',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
  {
    fecha: '2025-09-01',
    canal: 'R. Miranda',
    servicio: 'Miniatura 12',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=YiZwM3rMTdA',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: '',
  },
];

// Utility to extract a YYYY‑MM string from a date. If the date
// cannot be parsed, return an empty string.
function toMonth(dateStr) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  } catch {
    return '';
  }
}

const App = () => {
  // State for the selected month filter. Default to the most recent
  // month in the dataset.
  const uniqueMonths = useMemo(() => {
    const set = new Set();
    sampleData.forEach((d) => {
      const m = toMonth(d.fecha);
      if (m) set.add(m);
    });
    return Array.from(set).sort().reverse();
  }, []);
  const [month, setMonth] = useState(uniqueMonths[0] || '');
  // State for the selected canal filter. 'Todos' means no filter.
  const uniqueChannels = useMemo(() => {
    const set = new Set();
    sampleData.forEach((d) => set.add(d.canal));
    return Array.from(set).sort();
  }, []);
  const [canal, setCanal] = useState('Todos');
  // Editable amount to charge. This does not affect any other
  // calculations but is displayed as a reference.
  const [monto, setMonto] = useState(800);

  // Filter the sample data based on selected month and canal.
  const filtered = useMemo(() => {
    return sampleData.filter((d) => {
      const matchesMonth = month ? toMonth(d.fecha) === month : true;
      const matchesChannel = canal === 'Todos' ? true : d.canal === canal;
      return matchesMonth && matchesChannel;
    });
  }, [month, canal]);

  // Compute KPI values: total videos, total miniaturas, total cambios.
  const kpis = useMemo(() => {
    const links = new Set();
    let totalMini = 0;
    let totalCambios = 0;
    filtered.forEach((d) => {
      links.add(d.enlace);
      totalMini += d.cant + d.cambios;
      totalCambios += d.cambios;
    });
    return {
      videos: links.size,
      miniaturas: totalMini,
      cambios: totalCambios,
    };
  }, [filtered]);

  // Aggregate data per canal for charts. Each entry has
  // name: canal, value: sum(cant + cambios).
  const chartData = useMemo(() => {
    const agg = {};
    filtered.forEach((d) => {
      const key = d.canal;
      const val = d.cant + d.cambios;
      agg[key] = (agg[key] || 0) + val;
    });
    return Object.keys(agg).map((key) => ({ name: key, value: agg[key] }));
  }, [filtered]);

  // Helper to format numbers with thousands separators.
  const fmt = (n) => n.toLocaleString();

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem' }}>Dashboard de Miniaturas</h1>
      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label>
            Mes:&nbsp;
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {uniqueMonths.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Canal:&nbsp;
            <select value={canal} onChange={(e) => setCanal(e.target.value)}>
              <option value="Todos">Todos</option>
              {uniqueChannels.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Monto a cobrar ($):&nbsp;
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              style={{ width: '100px' }}
            />
          </label>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ flex: '1 1 200px', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong>Videos</strong>
            <div style={{ fontSize: '1.5rem' }}>{fmt(kpis.videos)}</div>
          </div>
          <div style={{ flex: '1 1 200px', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong>Miniaturas</strong>
            <div style={{ fontSize: '1.5rem' }}>{fmt(kpis.miniaturas)}</div>
          </div>
          <div style={{ flex: '1 1 200px', padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <strong>Cambios</strong>
            <div style={{ fontSize: '1.5rem' }}>{fmt(kpis.cambios)}</div>
          </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 400px', height: '300px', background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>Miniaturas por canal</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: '1 1 400px', height: '300px', background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3>Distribución de miniaturas (torta)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Records table */}
      <div style={{ background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Registros</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Fecha</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Canal</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Servicio</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Cant</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Enlace</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Cambios</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Tipo de cambio</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '0.5rem' }}>{d.fecha}</td>
                  <td style={{ padding: '0.5rem' }}>{d.canal}</td>
                  <td style={{ padding: '0.5rem' }}>{d.servicio}</td>
                  <td style={{ padding: '0.5rem' }}>{d.cant}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <a href={d.enlace} target="_blank" rel="noopener noreferrer">
                      enlace
                    </a>
                  </td>
                  <td style={{ padding: '0.5rem' }}>{d.cambios}</td>
                  <td style={{ padding: '0.5rem' }}>{d.tipoCambio}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '0.5rem', textAlign: 'center' }}>
                    No hay registros para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;