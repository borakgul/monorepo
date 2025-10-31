import React, { useState } from 'react';
import { dataAPI } from '../services/api';
import { useNotification } from './Notification';
import LoadingSpinner from './LoadingSpinner';
import './DataManager.css';

const DataManager = () => {
  const [newData, setNewData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newData.title.trim()) {
      showError('Başlık alanı zorunludur');
      return;
    }

    try {
      setLoading(true);
      await dataAPI.postData(newData);
      showSuccess('Veri başarıyla eklendi!');
      setNewData({ title: '', description: '' });
      // Dashboard'ı yenile (parent component'e bildir)
      window.dispatchEvent(new CustomEvent('dataUpdated'));
    } catch (error) {
      console.error('Error adding data:', error);
      showError('Veri eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="data-manager">
      <h3>Yeni Veri Ekle</h3>
      <form onSubmit={handleSubmit} className="data-form">
        <div className="form-group">
          <label htmlFor="title">Başlık:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newData.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="Veri başlığını giriniz"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Açıklama:</label>
          <textarea
            id="description"
            name="description"
            value={newData.description}
            onChange={handleChange}
            disabled={loading}
            placeholder="Veri açıklamasını giriniz (isteğe bağlı)"
            rows="3"
          />
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="small" />
              Ekleniyor...
            </>
          ) : (
            'Veri Ekle'
          )}
        </button>
      </form>
    </div>
  );
};

export default DataManager;