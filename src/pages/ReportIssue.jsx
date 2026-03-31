import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import categories from '../data/categories';
import LocationSelector from '../components/LocationSelector';
import { issueImages } from '../data/mockData';
import {
  ImagePlus, FileText, Tag, MapPin, Send, X, AlertCircle, CheckCircle
} from 'lucide-react';

const ReportIssue = () => {
  const { user } = useAuth();
  const { addIssue } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: '',
    location: user?.location || {},
  });
  const [imagePreview, setImagePreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(p => ({ ...p, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (formData.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.location.village) errs.location = 'Please select complete location';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const issueImage = formData.image || issueImages[formData.category] || issueImages.roads;

    addIssue({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: issueImage,
      location: formData.location,
      reportedBy: user?.id || 'anonymous',
      reporterName: user?.name || 'Anonymous',
    });

    setSubmitted(true);
    setTimeout(() => navigate('/'), 2000);
  };

  if (submitted) {
    return (
      <div className="report-success">
        <div className="success-animation">
          <CheckCircle size={64} />
        </div>
        <h2>Issue Reported Successfully!</h2>
        <p>Your issue has been submitted and is now visible to the community for validation.</p>
        <p className="success-sub">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="page-header">
        <h1>Report an Issue</h1>
        <p>Help your community by reporting local problems. Other residents will validate your report.</p>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="report-form-grid">
          {/* Left column */}
          <div className="report-col">
            {/* Image upload */}
            <div className="form-group">
              <label><ImagePlus size={14} /> Upload Image</label>
              <div className="image-upload-area" onClick={() => document.getElementById('image-input').click()}>
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview('');
                        setFormData(p => ({ ...p, image: '' }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <ImagePlus size={32} />
                    <span>Click to upload an image</span>
                    <span className="upload-hint">JPG, PNG up to 5MB</span>
                  </div>
                )}
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  hidden
                />
              </div>
            </div>

            {/* Category */}
            <div className="form-group">
              <label><Tag size={14} /> Category</label>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-btn ${formData.category === cat.id ? 'active' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, category: cat.id }))}
                    style={formData.category === cat.id ? {
                      borderColor: cat.color,
                      backgroundColor: `${cat.color}15`,
                    } : {}}
                  >
                    <cat.icon size={20} style={{ color: cat.color }} />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <span className="form-error"><AlertCircle size={12} /> {errors.category}</span>}
            </div>
          </div>

          {/* Right column */}
          <div className="report-col">
            {/* Title */}
            <div className="form-group">
              <label><FileText size={14} /> Issue Title</label>
              <input
                type="text"
                placeholder="Brief title describing the issue"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                maxLength={100}
              />
              <span className="char-count">{formData.title.length}/100</span>
              {errors.title && <span className="form-error"><AlertCircle size={12} /> {errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label><FileText size={14} /> Description</label>
              <textarea
                placeholder="Describe the issue in detail — what, where, how severe, how long has it been..."
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                rows={5}
                maxLength={500}
              />
              <span className="char-count">{formData.description.length}/500</span>
              {errors.description && <span className="form-error"><AlertCircle size={12} /> {errors.description}</span>}
            </div>

            {/* Location */}
            <LocationSelector
              value={formData.location}
              onChange={(loc) => setFormData(p => ({ ...p, location: loc }))}
            />
            {errors.location && <span className="form-error"><AlertCircle size={12} /> {errors.location}</span>}
          </div>
        </div>

        <div className="report-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Send size={18} />
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
