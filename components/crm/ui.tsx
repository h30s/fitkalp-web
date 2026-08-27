/**
 * Minimal UI component stubs for the /ops internal support panel.
 * These are simple pass-through components — replace with a proper
 * design system if the ops panel is productionised.
 */
import React from 'react';

type Color = 'green' | 'orange' | 'red' | 'blue' | 'gray';

export function AlertBanner({
  type,
  children,
  onClose,
}: {
  type: 'error' | 'success';
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        marginBottom: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: type === 'error' ? '#fef2f2' : '#f0fdf4',
        border: `1px solid ${type === 'error' ? '#fca5a5' : '#86efac'}`,
        color: type === 'error' ? '#991b1b' : '#166534',
      }}
    >
      <span>{children}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 12 }}>
          ✕
        </button>
      )}
    </div>
  );
}

export function Badge({ color, children }: { color: Color; children: React.ReactNode }) {
  const bg: Record<Color, string> = {
    green: '#dcfce7', orange: '#ffedd5', red: '#fee2e2', blue: '#dbeafe', gray: '#f1f5f9',
  };
  const fg: Record<Color, string> = {
    green: '#166534', orange: '#9a3412', red: '#991b1b', blue: '#1e40af', gray: '#475569',
  };
  return (
    <span style={{ padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: bg[color], color: fg[color] }}>
      {children}
    </span>
  );
}

export function Btn({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size,
  icon,
  disabled,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm';
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const bg: Record<string, string> = { primary: '#2B9361', secondary: '#f1f5f9', danger: '#ef4444' };
  const fg: Record<string, string> = { primary: '#fff', secondary: '#1A1D1F', danger: '#fff' };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: size === 'sm' ? '4px 12px' : '8px 16px',
        fontSize: size === 'sm' ? 12 : 14,
        fontWeight: 600,
        background: disabled ? '#e2e8f0' : bg[variant],
        color: disabled ? '#94a3b8' : fg[variant],
        border: 'none',
        borderRadius: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {icon}
      {children}
    </button>
  );
}

export function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      {title && <h3 style={{ margin: '0 0 4px', fontSize: 16 }}>{title}</h3>}
      {subtitle && <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>{subtitle}</p>}
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>{subtitle}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#fff' }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function StatCard({
  title,
  value,
  icon,
  alert,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div style={{ border: `1px solid ${alert ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#64748b', fontSize: 13 }}>
        {icon} {title}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: alert ? '#dc2626' : '#1A1D1F' }}>{value}</div>
    </div>
  );
}

export function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #e2e8f0', fontWeight: 600, color: '#475569' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
