import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './CustomDropdown.css';

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...",
  className = '',
  searchable = true
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const lower = searchTerm.toLowerCase();
    return options.filter(opt => opt.label.toLowerCase().includes(lower));
  }, [options, searchable, searchTerm]);

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
        <span className="custom-dropdown__selected-text">
          {selectedOption && selectedOption.label ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className="custom-dropdown__icon" />
      </button>

      <div className="custom-dropdown__menu">
        {searchable && (
          <div className="custom-dropdown__search-container">
            <Search size={14} className="custom-dropdown__search-icon" />
            <input 
              ref={searchInputRef}
              type="text"
              className="custom-dropdown__search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <ul role="listbox" className="custom-dropdown__list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <li 
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                className={`custom-dropdown__item ${value === opt.value ? 'custom-dropdown__item--selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {opt.label}
              </li>
            ))
          ) : (
            <li className="custom-dropdown__item custom-dropdown__item--empty">No results found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
