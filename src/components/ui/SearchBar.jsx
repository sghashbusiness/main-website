/**
 * SGHASH UI — SearchBar
 * Architecture Spec §4.1: "<GlobalSearch>: A rapid IMEI/SKU lookup."
 * Prompt Spec: "Include a search bar with a shortcut hint (e.g., ⌘+F)"
 */

import { Search } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  shortcutHint = '⌘K',
  className = '',
}) {
  return (
    <div className={`search-bar ${className}`}>
      <Search size={18} className="search-bar__icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-bar__input"
      />
      {shortcutHint && <kbd className="search-bar__shortcut">{shortcutHint}</kbd>}
    </div>
  );
}
