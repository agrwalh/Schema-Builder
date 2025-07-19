import React, { useState } from "react";

const FIELD_TYPES = [
  { label: "String", value: "string" },
  { label: "Number", value: "number" },
  { label: "Nested", value: "nested" },
  { label: "ObjectId", value: "objectId" },
  { label: "Float", value: "float" },
  { label: "Boolean", value: "boolean" },
];

function makeNewRow() {
  return {
    id: Date.now() + Math.random(),
    name: "",
    type: "",
    required: false,
    children: [],
  };
}

function rowsToJson(schemaRows) {
  const obj = {};
  for (const row of schemaRows) {
    if (!row.name || !row.type) continue;
    if (row.type === "nested") {
      obj[row.name] = rowsToJson(row.children);
    } else if (row.type === "string") {
      obj[row.name] = row.required ? "STRING" : "string";
    } else if (row.type === "number") {
      obj[row.name] = row.required ? 0 : "number";
    } else if (row.type === "objectId") {
      obj[row.name] = row.required ? "OBJECTID" : "objectId";
    } else if (row.type === "float") {
      obj[row.name] = row.required ? 0.0 : "float";
    } else if (row.type === "boolean") {
      obj[row.name] = row.required ? true : "boolean";
    }
  }
  return obj;
}

function SchemaRowsEditor({ schemaRows, setSchemaRows, isChildGroup }) {
  const addRow = () => {
    setSchemaRows([...schemaRows, makeNewRow()]);
  };

  const removeRow = (id) => {
    setSchemaRows(schemaRows.filter((row) => row.id !== id));
  };

  function handleFieldChange(idx, key, value) {
    const newRows = [...schemaRows];
    newRows[idx][key] = value;
    if (key === "type" && value !== "nested") {
      newRows[idx].children = [];
    }
    setSchemaRows(newRows);
  }

  function setNestedRows(idx, newChildren) {
    const newRows = [...schemaRows];
    newRows[idx].children = newChildren;
    setSchemaRows(newRows);
  }

  return (
    <div className={isChildGroup ? "" : "w-full max-w-4xl"}>
      {schemaRows.map((row, idx) => (
        <React.Fragment key={row.id}>
          <div className={`flex gap-4 items-center mb-6${isChildGroup ? " pl-8" : ""}`}>
            <input
              className="border border-gray-300 bg-white px-5 py-3 rounded-2xl h-14 text-lg font-medium flex-1 min-w-[300px] shadow-sm focus:outline-blue-400 placeholder-gray-400"
              placeholder="Field name"
              value={row.name}
              onChange={e => handleFieldChange(idx, "name", e.target.value)}
            />
            <select
              className="border border-gray-300 bg-white px-5 py-3 rounded-2xl w-80 h-14 text-lg font-medium shadow-sm focus:outline-blue-400"
              value={row.type}
              onChange={e => handleFieldChange(idx, "type", e.target.value)}
              required
            >
              <option value="" disabled>Field Type</option>
              {FIELD_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Standard checkbox for required */}
            <div className="flex items-center gap-2 h-14">
              <input
                type="checkbox"
                checked={row.required}
                onChange={e => handleFieldChange(idx, "required", e.target.checked)}
                className="w-6 h-6 accent-blue-600 rounded border-gray-400 border-2"
                id={`required-${row.id}`}
              />
              <label htmlFor={`required-${row.id}`} className="text-base font-medium text-gray-700 select-none">
                
              </label>
            </div>
            <button
              className="text-3xl text-gray-700 hover:text-red-600 h-14 w-14 flex items-center justify-center font-bold rounded-2xl bg-white border border-gray-200 shadow-sm"
              onClick={() => removeRow(row.id)}
              title="Delete field"
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          {row.type === "nested" && (
            <div className="border-l-4 border-gray-200 pl-8 ml-2 bg-gray-50 rounded-2xl">
              <SchemaRowsEditor
                schemaRows={row.children}
                setSchemaRows={newChildren => setNestedRows(idx, newChildren)}
                isChildGroup={true}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      <button
        className={`w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-3 rounded-2xl mt-2 mb-4 text-lg shadow-sm transition-colors${isChildGroup ? " pl-8" : ""}`}
        style={{ boxShadow: "none", border: "none", height: "48px" }}
        onClick={addRow}
      >
        + Add Item
      </button>
      {!isChildGroup && (
        <button
          className="mt-2 text-lg bg-white border border-gray-300 text-gray-800 px-8 py-4 rounded-2xl font-semibold shadow-sm"
          style={{ boxShadow: "none", width: 160, textAlign: "left", height: "56px" }}
          onClick={() => alert("Submitted! (You can handle form submission here)")}
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default function SchemaEditor() {
  const [schemaRows, setSchemaRows] = useState([]);

  return (
    <div className="flex gap-8 p-8 bg-white min-h-screen justify-start">
      <div className="flex-1 max-w-4xl flex flex-col items-start">
        <SchemaRowsEditor schemaRows={schemaRows} setSchemaRows={setSchemaRows} />
      </div>
      <div className="w-[500px] mt-4">
        <pre className="bg-gray-100 p-8 rounded-2xl text-lg overflow-x-auto w-full border border-gray-200 shadow-sm" style={{ minHeight: 120 }}>
          {JSON.stringify(rowsToJson(schemaRows), null, 2)}
        </pre>
      </div>
    </div>
  );
} 