import React, { useState, useRef, useEffect } from "react";

export default function TagInput({
  label = "Add Tags",
  placeholder = "Type and press Space, Enter or Comma...",
  value = [],       
  onChange,
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const addTag = (val) => {
    const trimmed = val.trim();
    if (trimmed !== "" && !value.includes(trimmed)) {
      onChange?.([...value, trimmed]);
    }
  };

  const removeTag = (tagToRemove) => {
    onChange?.(value.filter((tag) => tag !== tagToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if ([" ", "Enter", ","].includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="w-full max-w-md">
      {label && (
        <label className="label mb-1">
          <span className="label-text font-semibold text-base-content/80">
            {label}
          </span>
        </label>
      )}
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl border border-base-content/20 bg-base-100 p-2 shadow-sm transition-all focus-within:shadow-md focus-within:border-primary hover:border-base-content/40"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="badge badge-primary badge-lg flex items-center gap-2 px-3 py-3 text-sm font-medium"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-xs font-bold hover:text-error transition-colors"
              onClick={() => removeTag(tag)}
            >
              ✕
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="input input-sm flex-1 border-none focus:outline-none bg-transparent placeholder:text-base-content/40"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
