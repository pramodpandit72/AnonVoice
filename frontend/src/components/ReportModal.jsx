import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

const ReportModal = ({ postId, commentId, onClose }) => {
  const { theme } = useTheme();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    { value: 'spam', label: 'Spam', icon: 'fa-robot' },
    { value: 'harassment', label: 'Harassment', icon: 'fa-hand' },
    { value: 'hate_speech', label: 'Hate Speech', icon: 'fa-ban' },
    { value: 'violence', label: 'Violence', icon: 'fa-skull' },
    { value: 'misinformation', label: 'Misinformation', icon: 'fa-circle-exclamation' },
    { value: 'other', label: 'Other', icon: 'fa-ellipsis' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      alert('Please select a reason');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reports', {
        postId,
        commentId,
        reason,
        description: description.trim()
      });
      alert('Report submitted. Thank you for helping keep the community safe.');
      onClose();
    } catch (error) {
      console.error('Report error:', error);
      alert(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-lg shadow-xl ${
          theme === 'dark' ? 'bg-[#1a1a1b]' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          theme === 'dark' ? 'border-[#343536]' : 'border-[#edeff1]'
        }`}>
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'}`}>
            <i className="fa-solid fa-flag text-orange-500 mr-2"></i>
            Report Content
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-10 ${theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'}`}
          >
            <i className={`fa-solid fa-times ${theme === 'dark' ? 'text-[#818384]' : 'text-[#878a8c]'}`}></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4">
          <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-[#818384]' : 'text-[#787c7e]'}`}>
            Help us understand what's wrong with this content.
          </p>

          {/* Reason Selection */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {reasons.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReason(r.value)}
                className={`flex items-center gap-2 p-3 rounded border transition-all ${
                  reason === r.value
                    ? 'border-orange-500 bg-orange-500 bg-opacity-10'
                    : theme === 'dark'
                      ? 'border-[#343536] hover:border-[#818384]'
                      : 'border-[#edeff1] hover:border-[#878a8c]'
                }`}
              >
                <i className={`fa-solid ${r.icon} ${reason === r.value ? 'text-orange-500' : ''}`}></i>
                <span className={`text-sm font-medium ${
                  reason === r.value 
                    ? 'text-orange-500' 
                    : theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
                }`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          {/* Additional Description */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-[#d7dadc]' : 'text-[#1c1c1c]'
            }`}>
              Additional details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context..."
              className={`w-full p-3 rounded border text-sm resize-none focus:outline-none focus:border-orange-500 ${
                theme === 'dark'
                  ? 'bg-[#272729] border-[#343536] text-[#d7dadc] placeholder-[#818384]'
                  : 'bg-white border-[#edeff1] text-[#1c1c1c] placeholder-[#878a8c]'
              }`}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                theme === 'dark'
                  ? 'text-[#d7dadc] hover:bg-[#272729]'
                  : 'text-[#1c1c1c] hover:bg-[#f6f7f8]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason || submitting}
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                reason && !submitting
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
