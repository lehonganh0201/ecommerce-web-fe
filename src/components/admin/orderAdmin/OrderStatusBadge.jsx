import React from "react";

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PROCESSING",
    label: "Đang xử lý",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "SHIPPED",
    label: "Đang vận chuyển",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "DELIVERED",
    label: "Đã giao",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "PENDING_ASSIGNMENT",
    label: "Chờ phân công",
    color: "bg-purple-100 text-purple-800",
  },
  { value: "CANCELED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
];

function getStatusColor(status) {
  const found = STATUS_OPTIONS.find((opt) => opt.value === status);
  return found ? found.color : "bg-gray-100 text-gray-800";
}

const OrderStatusBadge = ({ value, onChange, useFixedMenu = false }) => {
  const [open, setOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ left: 0, top: 0, width: 0 });
  const buttonRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const selected = STATUS_OPTIONS.find((o) => o.value === value);

  const handleSelect = (val) => {
    onChange?.({ target: { value: val } });
    setOpen(false);
  };

  React.useEffect(() => {
    if (open && useFixedMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({ left: rect.left, top: rect.bottom + 4, width: rect.width });
    }
  }, [open, useFixedMenu]);

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!buttonRef.current) return;
      // Ignore clicks on the button or inside the menu
      if (buttonRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className="relative inline-block text-xs" style={{ minWidth: 140 }}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        ref={buttonRef}
        className={`w-full text-left px-2 py-1 pr-6 rounded-full border cursor-pointer ${getStatusColor(
          value
        )}`}
      >
        {selected?.label || value}
      </button>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
        &#9662;
      </span>

      {open && !useFixedMenu && (
        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-1 w-full bg-white border rounded-md shadow-lg z-50"
        >
          <ul className="max-h-56 overflow-auto py-1">
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.value} className="px-1 py-1">
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-2 py-1 rounded-full ${opt.color} hover:opacity-90`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {open && useFixedMenu && (
        <div
          ref={menuRef}
          className="fixed bg-white border rounded-md shadow-lg z-50"
          style={{ left: menuPos.left, top: menuPos.top, width: menuPos.width }}
        >
          <ul className="max-h-56 overflow-auto py-1">
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.value} className="px-1 py-1">
                <button
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-2 py-1 rounded-full ${opt.color} hover:opacity-90`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderStatusBadge;
