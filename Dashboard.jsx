import React, { useState, useMemo, useEffect } from 'react';
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
  Cell
} from 'recharts';

// Sample data; in production you would load this from Google Sheets or an API
const sampleData = [
  {
    fecha: '2025-09-01',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 1',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=XD1GCWJPvFw',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: ''
  },
  {
    fecha: '2025-09-08',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 2',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=_ejBISDA75Y',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: ''
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
    observaciones: ''
  },
  {
    fecha: '2025-09-15',
    canal: 'Ismael Cala',
    servicio: 'Miniatura 4',
    cant: 1,
    enlace: 'https://www.youtube.com/watch?v=65tvziRyUl8',
    cambios: 0,
    tipoCambio: '',
    honorarioBase: 20,
    honorarioCambio: 0,
    observaciones: ''
  }
];

const LS_KEYS = {
  PAID: 'mini_dash_paid_'
};

const currency = (n) =>
  Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const toMonth = (iso) => (iso || '').slice(0, 7);

function fmtDateShort(iso) {
  try {
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: '2-digit'
    });
    return fmt.format(d).replace(',', '').replace(/\//g, '-');
  } catch (e) {
    return iso;
  }
}

function ytId(url) {
  if (!url) return '';
  const m = url.match(/(?:v=|be\/)([\w-]{6,11})/);
  return m ? m[1] : '';
}

const COLORS = [
  '#0ea5e9',
  '#f97316',
  '#22c55e',
  '#ef4444',
  '#a78bfa',
  '#14b8a6',
  '#f59e0b',
  '#e879f9',
  '#60a5fa'
];
const colorFor = (i) => COLORS[i % COLORS.length];

function Dashboard() {
  const [data] = useState(sampleData);
  const [month, setMonth] = useState(() => {
    const first = data[0]?.fecha || new Date().toISOString();
    return toMonth(first);
  });
  const [client, setClient] = useState('Todos');
  const [charge, setCharge] = useState(800);

  const months = useMemo(() => {
    const setM = new Set();
    data.forEach((r) => setM.add(toMonth(r.fecha)));
    return Array.from(setM).sort();
  }, [data]);

  const clients = useMemo(() => {
    const setC = new Set();
    data.forEach((r) => setC.add(r.canal));
    return Array.from(setC).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      const m = toMonth(r.fecha);
      const okMonth = !month || m === month;
      const okClient = client === 'Todos' || r.canal === client;
      return okMonth && okClient;
    });
  }, [data, month, client]);

  const kpis = useMemo(() => {
    const videoSet = new Set(filtered.map((r) => r.enlace));
    const miniaturas = filtered.reduce((sum, r) => sum + (Number(r.cant) || 1), 0);
    const cambios = filtered.reduce((sum, r) => sum + (Number(r.cambios) || 0), 0);
    return {
      videos: videoSet.size,
      miniaturas,
      cambios,
      total: miniaturas + cambios
    };
  }, [filtered]);

  const byClient = useMemo(() => {
    const map = {};
    filtered.forEach((r) => {
      const key = r.canal;
      if (!map[key]) {
        map[key] = { cliente: key, miniaturas: 0, cambios: 0, totalUnits: 0 };
      }
      map[key].miniaturas += Number(r.cant) || 1;
      map[key].cambios += Number(r.cambios) || 0;
      map[key].totalUnits = map[key].miniaturas + map[key].cambios;
    });
    return Object.values(map).sort((a, b) => b.totalUnits - a.totalUnits);
  }, [filtered]);

  const monthAmounts = useMemo(() => {
    const base = filtered.reduce((s, r) => s + Number(r.honorarioBase || 0), 0);
    const chg = filtered.reduce(
      (s, r) => s + Number(r.honorarioCambio || 0) * Number(r.cambios || 0),
      0
    );
    return { base, cambios: chg, total: base + chg };
  }, [filtered]);

  const monthIsPast = useMemo(() => {
    if (!month) return false;
    const todayMonth = toMonth(new Date().toISOString());
    return month < todayMonth;
  }, [month]);

  const paidKey = `${LS_KEYS.PAID}${month}`;
  const [isPaid, setIsPaid] = useState(false);
  useEffect(() => {
    setIsPaid(localStorage.getItem(paidKey) === '1');
  }, [paidKey]);

  const togglePaid = () => {
    const next = !isPaid;
    setIsPaid(next);
    if (next) {
      localStorage.setItem(paidKey, '1');
    } else {
      localStorage.removeItem(paidKey);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1>Dashboard de Miniaturas</h1>
      <div className="flex flex-wrap gap-4 items-center">
        <label>
          Mes:
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border ml-2 p-1"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Canal:
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="border ml-2 p-1"
          >
            <option value="Todos">Todos</option>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Monto a cobrar ($):
          <input
            type="number"
            value={charge}
            onChange={(e) => setCharge(e.target.value)}
            className="border ml-2 p-1 w-24"
          />
        </label>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Videos</div>
          <div className="text-2xl">{kpis.videos}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Miniaturas</div>
          <div className="text-2xl">{kpis.miniaturas}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Cambios</div>
          <div className="text-2xl">{kpis.cambios}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl">{kpis.total}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Honorarios por miniaturas</div>
          <div className="text-xl font-semibold">{currency(monthAmounts.base)}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-xs text-gray-500">Honorarios por cambios</div>
          <div className="text-xl font-semibold">{currency(monthAmounts.cambios)}</div>
        </div>
        <div className="p-4 bg-white rounded shadow flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">
              {monthIsPast || isPaid ? 'Monto cobrado' : 'Monto a cobrar'}
            </div>
            <div className="text-xl font-semibold">{currency(monthAmounts.total)}</div>
          </div>
          <button
            onClick={togglePaid}
            className={`rounded-xl px-3 py-2 text-sm shadow-sm border ${
              isPaid ? 'bg-green-600 text-white' : 'bg-white'
            }`}
          >
            {isPaid ? '✅ Marcar como NO cobrado' : 'Marcar como COBRADO'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3>Miniaturas por canal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byClient}>
              <XAxis dataKey="cliente" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="miniaturas">
                {byClient.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorFor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3>Distribución de miniaturas (torta)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={byClient}
                dataKey="totalUnits"
                nameKey="cliente"
                outerRadius={80}
                label
              >
                {byClient.map((entry, index) => (
                  <Cell key={`slice-${index}`} fill={colorFor(index)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h3>Registros</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Fecha</th>
              <th className="p-2">Canal</th>
              <th className="p-2">Servicio</th>
              <th className="p-2">Enlace</th>
              <th className="p-2">Cant</th>
              <th className="p-2">Cambios</th>
              <th className="p-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{fmtDateShort(r.fecha)}</td>
                <td className="p-2">{r.canal}</td>
                <td className="p-2">{r.servicio}</td>
                <td className="p-2">
                  {r.enlace ? (
                    <a
                      href={r.enlace}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-2"
                    >
                      {ytId(r.enlace) ? (
                        <img
                          src={`https://img.youtube.com/vi/${ytId(r.enlace)}/default.jpg`}
                          alt="thumb"
                          className="h-8 w-12 rounded object-cover"
                        />
                      ) : null}
                      ver
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-2">{r.cant ?? 1}</td>
                <td className="p-2">{r.cambios ?? 0}</td>
                <td className="p-2">{r.tipoCambio || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
