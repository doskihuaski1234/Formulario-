import { useState } from "react";

type Gender = "male" | "female" | "not sure";

type FormData = {
  firstName: string;
  lastName: string;
  favoriteSport: string;
  gender: Gender;
  stateResident: string;
  is21OrOlder: boolean;
  carModelsOwned: string[];
};

const initialData: FormData = {
  firstName: "Bruce",
  lastName: "Phillips",
  favoriteSport: "basketball",
  gender: "male",
  stateResident: "Kansas",
  is21OrOlder: true,
  carModelsOwned: ["Ford", "Toyota"]
};

const STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida",
  "Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
  "Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska",
  "Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
  "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
];

const CARS = ["Ford", "Chrysler", "Toyota", "Nissan"] as const;

export default function App() {
  const [data, setData] = useState<FormData>(initialData);
  const [status, setStatus] = useState<{ok:boolean; msg:string} | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleCar = (brand: string) => {
    onChange(
      "carModelsOwned",
      data.carModelsOwned.includes(brand)
        ? data.carModelsOwned.filter(b => b !== brand)
        : [...data.carModelsOwned, brand]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("http://localhost:4000/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.ok) {
        setStatus({ ok: true, msg: "✅ Guardado en Excel correctamente." });
      } else {
        setStatus({ ok: false, msg: json.message || "Error al guardar." });
      }
    } catch (err) {
      setStatus({ ok: false, msg: "No se pudo conectar con el servidor." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => setData(initialData);

  return (
    <div className="container">
      <h1>Update Information</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label>First name:</label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Last name:</label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Favorite sport:</label>
            <input
              type="text"
              value={data.favoriteSport}
              onChange={(e) => onChange("favoriteSport", e.target.value)}
            />
          </div>
          <div className="field">
            <label>State resident:</label>
            <select
              value={data.stateResident}
              onChange={(e) => onChange("stateResident", e.target.value)}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label>Gender:</label>
          <div className="radio-row">
            <label><input type="radio" name="gender" checked={data.gender==="male"} onChange={() => onChange("gender", "male")} /> male</label>
            <label><input type="radio" name="gender" checked={data.gender==="female"} onChange={() => onChange("gender", "female")} /> female</label>
            <label><input type="radio" name="gender" checked={data.gender==="not sure"} onChange={() => onChange("gender", "not sure")} /> not sure</label>
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <div className="check-row">
            <label><input type="checkbox" checked={data.is21OrOlder} onChange={(e)=>onChange("is21OrOlder", e.target.checked)} /> 21 or older</label>
          </div>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label>Car models owned:</label>
          <div className="check-row">
            {CARS.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={data.carModelsOwned.includes(brand)}
                  onChange={() => toggleCar(brand)}
                />{" "}{brand}
              </label>
            ))}
          </div>
        </div>

        <div className="actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
          </button>
          <button type="button" onClick={handleReset} className="secondary">Reset</button>
          <a href="http://localhost:4000/api/export">
            <button type="button" className="secondary">Descargar Excel</button>
          </a>
        </div>

        {status && (
          <div className={status.ok ? "success" : "error"}>{status.msg}</div>
        )}
      </form>
    </div>
  );
}
