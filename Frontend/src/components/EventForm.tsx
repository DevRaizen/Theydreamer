import  { useState, useEffect } from "react";
import { parseCoord, ddToDMS, validateDD } from "../utils/coordConverter";

interface FormState {
  title: string;
  description: string;
  lat: string;
  lng: string;
}

const EMPTY: FormState = { title: "", description: "", lat: "", lng: "" };

type Errors = Record<string, string | undefined>;

export default function EventForm({ initial, onSubmit, onCancel, loading }: any) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [coordPreview, setCoordPreview] = useState<any>(null);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        lat: String(initial.lat ?? ""),
        lng: String(initial.lng ?? ""),
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
    setCoordPreview(null);
  }, [initial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((err) => ({ ...err, [name]: undefined }));

    // Live coord preview
    if (name === "lat" || name === "lng") {
      try {
        const other = name === "lat" ? form.lng : form.lat;
        const thisDD = parseCoord(value).dd;
        const otherDD = other ? parseCoord(other).dd : null;
        const latDD = name === "lat" ? thisDD : otherDD;
        const lngDD = name === "lng" ? thisDD : otherDD;
        if (latDD !== null && lngDD !== null) {
          setCoordPreview({
            lat: latDD,
            lng: lngDD,
            latDMS: ddToDMS(latDD, "lat"),
            lngDMS: ddToDMS(lngDD, "lng"),
          });
        } else {
          setCoordPreview(null);
        }
      } catch {
        setCoordPreview(null);
      }
    }
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required";

    for (const axis of ["lat", "lng"] as const) {
      const axisKey = axis as keyof FormState;
      if (!form[axisKey].trim()) {
        errs[axis] = "Required";
      } else {
        try {
          const { dd } = parseCoord(form[axisKey]);
          validateDD(dd, axis);
        } catch (e: any) {
          errs[axis] = (e && e.message) || String(e);
        }
      }
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const lat = parseCoord(form.lat).dd;
    const lng = parseCoord(form.lng).dd;

    await onSubmit({ title: form.title.trim(), description: form.description.trim(), lat, lng });
    setForm(EMPTY);
    setCoordPreview(null);
  }

  const inputCls = (field: string) =>
    `w-full px-4 py-2.5 rounded-lg border font-body text-sm bg-parchment
     focus:outline-none focus:ring-2 transition-all
     ${errors[field]
       ? "border-coral ring-coral/30 text-coral"
       : "border-ink/20 focus:border-amber-pin focus:ring-amber-pin/30 text-ink"}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-ink/50 mb-1.5">
          Event Title
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Sunset Picnic at Luneta"
          className={inputCls("title")}
        />
        {errors.title && (
          <p className="text-xs text-coral mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-ink/50 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="What's happening?"
          className={`${inputCls("description")} resize-none`}
        />
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-ink/50 mb-1.5">
            Latitude (DD)
          </label>
          <input
            name="lat"
            value={form.lat}
            onChange={handleChange}
            placeholder={"14.5995 or 14°35'58\"N"}
            className={inputCls("lat")}
          />
          {errors.lat && (
            <p className="text-xs text-coral mt-1">{errors.lat}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-ink/50 mb-1.5">
            Longitude (DD)
          </label>
          <input
            name="lng"
            value={form.lng}
            onChange={handleChange}
            placeholder={"120.9842 or 120°59'3\"E"}
            className={inputCls("lng")}
          />
          {errors.lng && (
            <p className="text-xs text-coral mt-1">{errors.lng}</p>
          )}
        </div>
      </div>

      {/* Coord preview */}
      {coordPreview && (
        <div className="bg-ink/5 rounded-lg px-4 py-3 text-xs font-body space-y-0.5">
          <p className="font-semibold text-ink/60 uppercase tracking-widest mb-1">
            Coordinate Preview
          </p>
          <p>
            <span className="text-ink/40">DD:</span>{" "}
            {coordPreview.lat.toFixed(6)}, {coordPreview.lng.toFixed(6)}
          </p>
          <p>
            <span className="text-ink/40">DMS:</span> {coordPreview.latDMS},{" "}
            {coordPreview.lngDMS}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-ink text-parchment font-semibold py-2.5 rounded-lg
                     hover:bg-ink-soft active:scale-95 transition-all disabled:opacity-50 text-sm"
        >
          {loading ? "Saving…" : initial ? "Update Event" : "Pin Event"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-lg border border-ink/20 text-sm text-ink/60
                       hover:border-ink/50 hover:text-ink transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
