import { useState, useEffect } from 'react';
import { getStates, getDistricts, getBlocks, getPanchayats, getVillages } from '../data/locationData';
import { MapPin } from 'lucide-react';

const LocationSelector = ({ value = {}, onChange, compact = false }) => {
  const [state, setState] = useState(value.state || '');
  const [district, setDistrict] = useState(value.district || '');
  const [block, setBlock] = useState(value.block || '');
  const [panchayat, setPanchayat] = useState(value.panchayat || '');
  const [village, setVillage] = useState(value.village || '');

  const states = getStates();
  const districts = getDistricts(state);
  const blocks = getBlocks(state, district);
  const panchayats = getPanchayats(state, district, block);
  const villages = getVillages(state, district, block, panchayat);

  useEffect(() => {
    onChange?.({ state, district, block, panchayat, village });
  }, [state, district, block, panchayat, village]);

  const handleStateChange = (val) => {
    setState(val);
    setDistrict('');
    setBlock('');
    setPanchayat('');
    setVillage('');
  };

  const handleDistrictChange = (val) => {
    setDistrict(val);
    setBlock('');
    setPanchayat('');
    setVillage('');
  };

  const handleBlockChange = (val) => {
    setBlock(val);
    setPanchayat('');
    setVillage('');
  };

  const handlePanchayatChange = (val) => {
    setPanchayat(val);
    setVillage('');
  };

  return (
    <div className={`location-selector ${compact ? 'compact' : ''}`}>
      <div className="location-header">
        <MapPin size={16} />
        <span>Location Hierarchy</span>
      </div>
      <div className="location-fields">
        <div className="form-group">
          <label>State</label>
          <select value={state} onChange={(e) => handleStateChange(e.target.value)}>
            <option value="">Select State</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>District</label>
          <select value={district} onChange={(e) => handleDistrictChange(e.target.value)} disabled={!state}>
            <option value="">Select District</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Block / Taluk</label>
          <select value={block} onChange={(e) => handleBlockChange(e.target.value)} disabled={!district}>
            <option value="">Select Block</option>
            {blocks.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Panchayat</label>
          <select value={panchayat} onChange={(e) => handlePanchayatChange(e.target.value)} disabled={!block}>
            <option value="">Select Panchayat</option>
            {panchayats.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Village</label>
          <select value={village} onChange={(e) => setVillage(e.target.value)} disabled={!panchayat}>
            <option value="">Select Village</option>
            {villages.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
