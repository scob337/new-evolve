import React from 'react';

// Input Field Component
export const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  className = '',
  ...props 
}) => (
  <div className={`${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Textarea Component
export const TextareaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false,
  rows = 4,
  className = '' 
}) => (
  <div className={`${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder={placeholder}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Radio Group Component
export const RadioGroup = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  error, 
  required = false,
  className = '' 
}) => (
  <div className={`${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
          />
          <span className="ml-3 text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Checkbox Component
// تحديث CheckboxField لدعم RTL
export const CheckboxField = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  error, 
  className = '' 
}) => (
  <div className={`${className}`}>
    <label className="flex items-start cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-1 ml-3"
      />
      <span className="flex-1 text-gray-700 leading-relaxed">{label}</span>
    </label>
    {error && <p className="text-red-500 text-sm mt-1 mr-8">{error}</p>}
  </div>
);

// Section Header Component
export const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-gray-900 mb-2 border-b-2 border-orange-500 pb-2">
      {title}
    </h3>
    {subtitle && <p className="text-gray-600">{subtitle}</p>}
  </div>
);