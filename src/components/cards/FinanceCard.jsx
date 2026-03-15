import { formatCurrency } from '../../utils/financialCalculations.js';

export default function FinanceCard({ label, value, icon: Icon, color = 'green', meta, animClass = '' }) {
  const colorMap = { green: 'accent-green', red: 'accent-red', blue: 'accent-blue', purple: 'accent-purple' };
  return (
    <div className={`finance-card ${colorMap[color]} ${animClass}`}>
      <div className="fc-top">
        <span className="fc-label">{label}</span>
        {Icon && (
          <div className={`fc-icon ${color}`}>
            <Icon size={17} />
          </div>
        )}
      </div>
      <div className="fc-value">
        {typeof value === 'number' ? formatCurrency(value) : value}
      </div>
      {meta && <div className="fc-meta">{meta}</div>}
    </div>
  );
}
