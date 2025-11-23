import { useState, useEffect } from 'react';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { addInstitute } from '../api/api';

const AddInstituteForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    instituteCode: '',
    email: '',
    walletAddress: '',
  });

  const [bulkData, setBulkData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'
  const [isDragging, setIsDragging] = useState(false);

  // Auto-dismiss success
  useEffect(() => {
    if (success || bulkSuccess) {
      const timer = setTimeout(() => {
        setSuccess("");
        setBulkSuccess("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, bulkSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Institute name is required';
    if (!form.instituteCode.trim()) newErrors.instituteCode = 'Institute code is required';

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = 'Enter a valid email';

    if (!form.walletAddress.trim())
      newErrors.walletAddress = 'Wallet address is required';
    else if (!/^0x[a-fA-F0-9]{40}$/.test(form.walletAddress))
      newErrors.walletAddress = 'Invalid Ethereum address';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();

    if (fileExt === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          setBulkData(results.data);
          setPreviewData(results.data.slice(0, 5)); // Show first 5 rows as preview
        },
      });
    } else if (fileExt === "xlsx") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setBulkData(json);
        setPreviewData(json.slice(0, 5)); // Show first 5 rows as preview
      };
      reader.readAsBinaryString(file);
    } else {
      setErrors({ form: "Only CSV or Excel (.xlsx) files allowed" });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.csv,.xlsx';
      fileInput.onchange = (e) => handleFileUpload(e);
      const event = new Event('change', { bubbles: true });
      fileInput.files = files;
      fileInput.dispatchEvent(event);
    }
  };

  const handleBulkSubmit = async () => {
    if (bulkData.length === 0) {
      setErrors({ form: "Please upload a valid CSV/Excel file" });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess("");
    setBulkSuccess("");

    try {
      const res = await addInstitute({ bulk: bulkData });

      if (res.data.success) {
        setBulkSuccess(`Bulk upload successful. ${bulkData.length} institutes added.`);
        setBulkData([]);
        setPreviewData([]);
        onSuccess?.();
      } else {
        setErrors({ form: res.data.message || "Bulk upload failed." });
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Bulk upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const res = await addInstitute(form);

      if (res.data?.success) {
        setSuccess("Institute registered successfully");
        setForm({ name: "", instituteCode: "", email: "", walletAddress: "" });
        onSuccess?.();
      } else {
        setErrors({ form: res.data?.message });
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || "Error submitting" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto px-4 pb-10">
      {/* Messages */}
      {(errors.form || success || bulkSuccess) && (
        <div className="mb-6">
          {errors.form && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-3 rounded-r-lg">
              <p className="text-red-700">{errors.form}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3 rounded-r-lg">
              <p className="text-green-700">{success}</p>
            </div>
          )}
          {bulkSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-3 rounded-r-lg">
              <p className="text-green-700">{bulkSuccess}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'single'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Single Entry
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
            activeTab === 'bulk'
              ? 'bg-white shadow-sm text-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Bulk Upload
        </button>
      </div>

      {/* Single Entry Form */}
      {activeTab === 'single' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Institute</h2>
            <p className="text-gray-600">Fill in the details to register a single institution</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Institute Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter institute name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Institute Code *
                </label>
                <input
                  type="text"
                  name="instituteCode"
                  value={form.instituteCode}
                  onChange={handleChange}
                  placeholder="Enter institute code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.instituteCode && <p className="text-red-500 text-sm mt-1">{errors.instituteCode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wallet Address *
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={form.walletAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                />
                {errors.walletAddress && <p className="text-red-500 text-sm mt-1">{errors.walletAddress}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Register Institute'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Bulk Upload Section */}
      {activeTab === 'bulk' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bulk Upload</h2>
            <p className="text-gray-600">Upload CSV or Excel file to add multiple institutes at once</p>
          </div>

          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
            }`}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-indigo-600 font-semibold hover:text-indigo-500">
                Click to upload
              </span>{' '}
              or drag and drop
            </label>
            <p className="text-gray-500 text-sm mt-2">
              CSV or Excel files only (max 10MB)
            </p>
          </div>

          {/* Preview Section */}
          {previewData.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                <span className="text-sm text-gray-600">
                  Showing {previewData.length} of {bulkData.length} records
                </span>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 text-sm text-gray-900">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {bulkData.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleBulkSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-8 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  `Upload ${bulkData.length} Records`
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddInstituteForm;