import { 
  Construction, Droplets, Zap, Trash2, HeartPulse, 
  TreePine, GraduationCap, ShieldAlert 
} from 'lucide-react';

const categories = [
  { id: 'roads', label: 'Roads & Infrastructure', icon: Construction, color: '#e67e22' },
  { id: 'water', label: 'Water Supply', icon: Droplets, color: '#3498db' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#f1c40f' },
  { id: 'waste', label: 'Garbage & Cleaning', icon: Trash2, color: '#27ae60' },
  { id: 'health', label: 'Health & Sanitation', icon: HeartPulse, color: '#e74c3c' },
  { id: 'environment', label: 'Environment', icon: TreePine, color: '#2ecc71' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#9b59b6' },
  { id: 'safety', label: 'Public Safety', icon: ShieldAlert, color: '#e84393' },
];

export const getCategoryById = (id) => categories.find(c => c.id === id);
export const getCategoryColor = (id) => getCategoryById(id)?.color || '#95a5a6';
export const getCategoryLabel = (id) => getCategoryById(id)?.label || 'Unknown';

export default categories;
