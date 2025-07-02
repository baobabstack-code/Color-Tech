import React, { useState } from 'react';

interface QuoteRequestFormProps {
  onSubmit?: (data: any) => void;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    vehicle: '',
    description: '',
    photos: [] as File[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev) => ({ ...prev, photos: Array.from(e.target.files) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSuccess(true);
      setForm({ name: '', contact: '', vehicle: '', description: '', photos: [] });
      if (onSubmit) onSubmit(form);
    } catch (err) {
      setError('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 max-w-lg mx-auto p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">Request a Free Quote</h2>
      {success && <div className="p-2 bg-green-100 text-green-700 rounded">Thank you! Your request has been submitted.</div>}
      {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="contact"
        placeholder="Phone or Email"
        value={form.contact}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="vehicle"
        placeholder="Vehicle Info (Make, Model, Year)"
        value={form.vehicle}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Describe the damage"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="file"
        name="photos"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="w-full"
      />
      {form.photos.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {form.photos.map((file, idx) => (
            <div key={idx} className="flex items-center text-xs bg-gray-100 rounded px-2 py-1">
              <span className="truncate max-w-[120px]">{file.name}</span>
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? 'Submitting...' : 'Get My Quote'}
      </button>
    </form>
  );
};

export default QuoteRequestForm;
