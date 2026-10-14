import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Icon from "./Icons";

// Up to `max` photos with previews; parent gets the File list
const PhotoPicker = ({ files, onChange, max = 3, id, label = "Add photos" }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const add = (e) => {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    onChange([...files, ...picked].slice(0, max));
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {previews.map((src, i) => (
          <div key={src} className="relative">
            <img src={src} alt={`Attached photo ${i + 1}`} className="h-20 w-20 rounded-md object-cover" />
            <button
              type="button"
              onClick={() => onChange(files.filter((_, j) => j !== i))}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white"
              aria-label={`Remove photo ${i + 1}`}
            >
              <Icon name="close" className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {files.length < max && (
          <label htmlFor={id} className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-stone-400 text-xs text-stone-600 hover:border-stone-900">
            <Icon name="plus" className="h-5 w-5" />
            {label}
          </label>
        )}
      </div>
      <input id={id} type="file" accept="image/*" multiple onChange={add} className="sr-only" />
      <p className="mt-1 text-xs text-stone-500">Up to {max} photos (JPG, PNG or WebP).</p>
    </div>
  );
};

PhotoPicker.propTypes = {
  files: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  max: PropTypes.number,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default PhotoPicker;
