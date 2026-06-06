// Reusable Button component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card wrapper component
export const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    {children}
  </div>
);

// Form input component
export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="form-label">{label}</label>}
    <input className={`form-input ${error ? 'border-danger' : ''}`} {...props} />
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
);

// Select dropdown component
export const Select = ({ label, options = [], error, ...props }) => (
  <div className="mb-4">
    {label && <label className="form-label">{label}</label>}
    <select className={`form-select ${error ? 'border-danger' : ''}`} {...props}>
      <option value="">-- Select --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
);

// Badge component
export const Badge = ({ children, variant = 'info', className = '', ...props }) => {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };
  return (
    <span className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Status badge component
export const StatusBadge = ({ status }) => {
  const statusConfig = {
    'Active': 'success',
    'Inactive': 'danger',
    'Pending': 'warning',
    'Open': 'info',
    'Closed': 'danger',
    'Submitted': 'info',
    'Approved': 'success',
    'Rejected': 'danger',
    'Confirmed': 'success',
    'Received': 'success',
    'Paid': 'success',
  };
  return <Badge variant={statusConfig[status] || 'info'}>{status}</Badge>;
};

// Table component
export const Table = ({ columns, data, actions }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="table-header">
              {col.label}
            </th>
          ))}
          {actions && <th className="table-header">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={row.id || idx} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="table-cell">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
            {actions && (
              <td className="table-cell">
                <div className="flex gap-2">
                  {actions(row)}
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Modal component
export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card-bg rounded-lg shadow-lg z-50 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl leading-none">
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 p-6 border-t border-border">{footer}</div>}
      </div>
    </>
  );
};

// Alert component
export const Alert = ({ type = 'info', children, onClose }) => {
  const typeClasses = {
    success: 'bg-green-100 text-green-800 border-green-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border rounded-lg p-4 flex justify-between items-center ${typeClasses[type]}`}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold text-lg">
          ×
        </button>
      )}
    </div>
  );
};

// Spinner component
export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`} />
  );
};
