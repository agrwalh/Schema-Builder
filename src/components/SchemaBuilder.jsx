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
    // If type changes to non-nested, clear children
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
          <div className={`flex gap-4 items-center mb-4${isChildGroup ? " pl-8" : ""}`}>
            <input
              className="border px-4 py-4 rounded h-20 text-xl font-bold flex-1 min-w-[300px]"
              placeholder="Field name"
              value={row.name}
              onChange={e => handleFieldChange(idx, "name", e.target.value)}
            />
            <select
              className="border px-4 py-4 rounded w-80 h-14 text-xl font-bold"
              value={row.type}
              onChange={e => handleFieldChange(idx, "type", e.target.value)}
              required
            >
              <option value="" disabled>Field Type</option>
              {FIELD_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 cursor-pointer select-none h-14">
              <input
                type="checkbox"
                checked={row.required}
                onChange={e => handleFieldChange(idx, "required", e.target.checked)}
                className="w-7 h-7 accent-blue-600 rounded border-gray-400 border-2"
                style={{ minWidth: 28, minHeight: 28 }}
              />
            </label>
            <button
              className="text-3xl text-gray-700 hover:text-red-600 px-4 h-14 w-14 flex items-center justify-center font-bold"
              onClick={() => removeRow(row.id)}
              title="Delete field"
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          {row.type === "nested" && (
            <SchemaRowsEditor
              schemaRows={row.children}
              setSchemaRows={newChildren => setNestedRows(idx, newChildren)}
              isChildGroup={true}
            />
          )}
        </React.Fragment>
      ))}
      <button
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded mt-2 mb-2 text-xl${isChildGroup ? " pl-8" : ""}`}
        style={{ boxShadow: "none", border: "none", height: "40px" }}
        onClick={addRow}
      >
        + Add Item
      </button>
      {!isChildGroup && (
        <button
          className="mt-2 text-xl bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded border font-bold"
          style={{ boxShadow: "none", border: "1px solid #ccc", width: 160, textAlign: "left", height: "40px" }}
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
      <div className="w-[450px] mt-4">
        <pre className="bg-gray-100 p-6 rounded text-base overflow-x-auto w-full" style={{ border: "1px solid #e5e7eb", boxShadow: "none" }}>
          {JSON.stringify(rowsToJson(schemaRows), null, 2)}
        </pre>
      </div>
    </div>
  );
} 