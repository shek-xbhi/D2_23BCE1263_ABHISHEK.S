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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [errors, setErrors] = useState({});

  // Defense-Grade Media Compression Simulation
  // Intercepts the raw File object and technically compresses it via an off-DOM canvas,
  // preventing enormous Base64 payloads from clogging the mock "database".
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800; // Simulated compression width constraint
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Re-encode as WebP format with 0.7 quality to mimic strong compression
          const compressedDataUrl = canvas.toDataURL('image/webp', 0.7);
          console.log(`Media Compression complete: Transformed to WebP (${width}x${height})`);
          resolve(compressedDataUrl);
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessingImage(true);
      
      // Simulate slow media pipeline
      await new Promise(r => setTimeout(r, 1500));

      // Create an immediate local preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Await "Defense-Grade" compression before committing to payload
      const compressedString = await compressImage(file);
      setFormData(p => ({ ...p, image: compressedString }));
      
      setIsProcessingImage(false);

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(previewUrl), 5000);
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
              <div className="image-upload-area" onClick={() => !isProcessingImage && document.getElementById('image-input').click()}>
                
                {isProcessingImage ? (
                  <div className="upload-placeholder">
                    <span style={{ fontWeight: 'bold', color: '#075e54' }}>System Processing Pipeline...</span>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '10px' }}>
                      <div style={{ width: '60%', height: '100%', background: '#075e54', borderRadius: '4px', animation: 'pulse 1s infinite alternate' }} />
                    </div>
                  </div>
                ) : imagePreview ? (
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
                  disabled={isProcessingImage}
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
