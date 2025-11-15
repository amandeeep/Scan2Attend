import React, { useState } from "react";
import TagInput from "../components/TagInput";

export default function Basic() {
  const [tags, setTags] = useState([]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Reusable DaisyUI Tag Input</h2>
      <TagInput
        label="Add Emails or Tags"
        onChange={(values) => setTags(values)}
      />

      <div className="mt-4">
        <p className="text-sm text-gray-600">
          <strong>Tags array:</strong> [{tags.map((t) => `"${t}"`).join(", ")}]
        </p>
      </div>
    </div>
  );
}
