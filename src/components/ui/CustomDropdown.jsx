import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './CustomDropdown.css';

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div 
      className={`custom-dropdown ${isOpen ? 'custom-dropdown--open' : ''} ${className}`} 
      ref={dropdownRef}
    >
      <button 
        type="button"
        className="custom-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} className="custom-dropdown__icon" />
      </button>

      <ul 
        className="custom-dropdown__menu"
        role="listbox"
      >
        {options.map((opt) => (
          <li 
            key={opt.value}
            role="option"
            aria-selected={value === opt.value}
            className={`custom-dropdown__item ${value === opt.value ? 'custom-dropdown__item--selected' : ''}`}
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
