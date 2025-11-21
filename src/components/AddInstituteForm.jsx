import { useState, useEffect } from 'react';
import { addInstitute } from '../api/api';


const AddInstituteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    instituteCode: '',
    email: '',
    walletAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

// Auto-dismiss success message after 5 seconds
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => {
      setSuccess('');
    }, 4000); // 5 seconds

    return () => clearTimeout(timer); // cleanup on unmount or re-trigger
  }
}, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Institute name is required';
    if (!form.instituteCode.trim()) newErrors.instituteCode = 'Institute code is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(form.walletAddress)) {
      newErrors.walletAddress = 'Must be a valid Ethereum-style address (0x + 40 hex chars)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSuccess('');
    setErrors({});
    setLoading(true);

    try {
      const res = await addInstitute(form);

      if (res.data?.success) {
        setSuccess('Institute registered successfully');
        setForm({ name: '', instituteCode: '', email: '', walletAddress: '' });
        onSuccess?.();
      } else {
        setErrors({ form: res.data?.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      let errMsg = 'Something went wrong. Please try again.';
      if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      } else if (err.response?.status === 400) {
        errMsg = 'Invalid input. Please check all fields.';
      } else if (err.response?.status === 409) {
        errMsg = 'Institute code or email already exists.';
      } else if (!err.response) {
        errMsg = 'Network error. Please check your connection.';
      }

      setErrors({ form: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-150 mx-auto">
      {/* === ALERTS: Appear ABOVE the form card === */}
      {errors.form && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {errors.form}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="mt-0.5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {/* === FORM CARD === */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
          <h2 className="text-xl font-semibold text-white">Add New Institute</h2>
          <p className="text-indigo-100 text-sm mt-1">
            Register an institution to onboard it onto the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Institute Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
              } focus:ring-2 focus:ring-indigo-200 focus:outline-none transition`}
              placeholder="e.g., Stanford University"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Institute Code */}
          <div>
            <label htmlFor="instituteCode" className="block text-sm font-medium text-gray-700 mb-1">
              Institute Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="instituteCode"
              name="instituteCode"
              value={form.instituteCode}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.instituteCode ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
              } focus:ring-2 focus:ring-indigo-200 focus:outline-none transition`}
              placeholder="e.g., STAN"
            />
            {errors.instituteCode && (
              <p className="mt-1 text-sm text-red-600">{errors.instituteCode}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Short, unique identifier (e.g., acronym). Case-insensitive.
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
              } focus:ring-2 focus:ring-indigo-200 focus:outline-none transition`}
              placeholder="admin@institute.edu"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Wallet Address */}
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={form.walletAddress}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 rounded-lg font-mono text-sm ${
                errors.walletAddress ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
              } border focus:ring-2 focus:ring-indigo-200 focus:outline-none transition`}
              placeholder="0x..."
            />
            {errors.walletAddress && (
              <p className="mt-1 text-sm text-red-600">{errors.walletAddress}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ethereum-compatible address (42 characters, starts with 0x)
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register Institute'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstituteForm;