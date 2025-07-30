import { useState } from 'react';
import styles from './ContactUs.module.css';
import { t } from '../../lib/i18n';

const ContactUs = ({ isOpen, onClose, lang = 'zh' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 按照指定格式组合content
    const content = `${formData.name}\n\n${formData.subject}\n\n${formData.message}`;
    
    // 创建FormData对象
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('title', '["drawlots"]');
    formDataToSubmit.append('contact', formData.email);
    formDataToSubmit.append('content', content);
    
    try {
      const response = await fetch('http://43.138.115.192:3000/api/feedback', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSubmit
      });
      
      if (response.ok) {
        alert(t(lang, 'contactus_submitSuccess'));
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        onClose();
      } else {
        alert(t(lang, 'contactus_submitError') || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交错误:', error);
      alert(t(lang, 'contactus_submitError') || '提交失败，请稍后重试');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{t(lang, 'contactus_title')}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">{t(lang, 'contactus_name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t(lang, 'contactus_namePlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">{t(lang, 'contactus_email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t(lang, 'contactus_emailPlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">{t(lang, 'contactus_subject')}</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder={t(lang, 'contactus_subjectPlaceholder')}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">{t(lang, 'contactus_message')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t(lang, 'contactus_messagePlaceholder')}
              rows="5"
              required
            />
          </div>
          <div className={styles.actions}>
            {/* <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
              {t(lang, 'contactus_cancel')}
            </button> */}
            <button type="submit" className={styles.submitBtn}>
              {t(lang, 'contactus_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;