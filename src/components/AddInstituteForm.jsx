import { useState } from 'react';
import { addInstitute } from '../api/api';

const AddInstituteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    instituteCode: '',
    email: '',
    walletAddress: '',
    address: '',
    district: '',
    state: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await addInstitute(form);

      if (res.data?.success) {
        setSuccess(res.data.message || 'Institute registered successfully');
        setForm({
          name: '',
          type: '',
          instituteCode: '',
          email: '',
          walletAddress: '',
          address: '',
          district: '',
          state: '',
          country: '',
        });
        onSuccess?.();
      } else {
        setError(res.data?.message || 'Something went wrong');
      }

    } catch (err) {
      if (err.response) {
        // Handle specific backend error messages
        switch (err.response.status) {
          case 400:
            setError(err.response.data?.message || 'Invalid request. Please check your input.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.response.data?.message || 'An unexpected error occurred.');
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl mx-auto mt-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Add New Institute
      </h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(form).map(([key, value]) => (
          <div key={key} className="relative">
            <input
              type="text"
              name={key}
              id={key}
              value={value}
              onChange={handleChange}
              required
              className="peer w-full px-4 pt-5 pb-2 rounded-lg border border-gray-300 text-gray-800 
                         placeholder-transparent focus:outline-none focus:ring-2 
                         focus:ring-indigo-400 focus:border-indigo-400 transition"
              placeholder={key}
            />
            <label
              htmlFor={key}
              className="absolute left-3 top-2.5 text-gray-500 text-sm bg-white px-1 transition-all 
                        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 
                        peer-placeholder-shown:text-base peer-focus:top-2.5 
                        peer-focus:text-sm peer-focus:text-indigo-600"
            >
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          </div>
        ))}

        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                       text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 
                       hover:to-purple-700 transition disabled:opacity-60"
          >
            {loading ? 'Adding...' : 'Add Institute'}
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-500 text-center mt-4 font-medium">{error}</p>
      )}

      {success && (
        <p className="text-green-600 text-center mt-4 font-medium">{success}</p>
      )}
    </div>
  );
};

export default AddInstituteForm;
