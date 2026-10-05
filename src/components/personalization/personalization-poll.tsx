"use client";

import { useState } from "react";

const visitorTypes = [
  "Recruiter / Hiring Manager",
  "Developer / Technical Professional",
  "Potential Client / Collaborator",
  "Project Supporter / Funder",
  "Student / Learner",
  "Other",
];
const interests = [
  "AI / Machine Learning",
  "Software / Web Applications",
  "Developer Tools",
  "Real-world Applications",
  "Open Source",
  "Other",
];

export function PersonalizationPoll() {
  const [open, setOpen] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("visions-personalization") === null,
  );
  const [visitorType, setVisitorType] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  if (!open) return null;

  const finish = (status: "completed" | "skipped") => {
    window.localStorage.setItem(
      "visions-personalization",
      JSON.stringify({ status, visitorType, interests: selected }),
    );
    setOpen(false);
  };

  return (
    <section className="poll" aria-labelledby="poll-title">
      <p className="eyebrow">Personalize your visit</p>
      <h2 id="poll-title">What brings you here?</h2>
      <label>
        Primary visitor type
        <select value={visitorType} onChange={(event) => setVisitorType(event.target.value)}>
          <option value="">Choose one</option>
          {visitorTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <fieldset>
        <legend>Interests (optional)</legend>
        {interests.map((interest) => (
          <label key={interest}>
            <input
              type="checkbox"
              checked={selected.includes(interest)}
              onChange={() => setSelected((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest])}
            />
            {interest}
          </label>
        ))}
      </fieldset>
      <div className="action-list">
        <button className="button button--primary" disabled={!visitorType} onClick={() => finish("completed")}>Show recommendations</button>
        <button className="button button--secondary" onClick={() => finish("skipped")}>Skip</button>
      </div>
    </section>
  );
}
