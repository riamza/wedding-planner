import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Heading, Text } from '../../components/ui/Typography';
import { useTranslation } from 'react-i18next';

export default function EventList({ user, onLogout }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await api.events.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', paddingBottom: '2rem' }}>
      <header className='glass-nav' style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className='container flex justify-between items-center' style={{ height: '80px', position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)' }}>WEDDIO</div>
          <div className='flex items-center gap-4'>
            <Text secondary>{t('hello')}</Text>
            <Button onClick={onLogout} variant='secondary' style={{ borderRadius: '40px' }}>{t('logout')}</Button>
          </div>
        </div>
      </header>
      <main className='container' style={{ marginTop: '120px', maxWidth: '1000px', margin: '120px auto 0 auto', padding: '0 20px' }}>
        <div className='flex justify-between items-center mb-8'>
          <Heading level={2}>{t('my_events')}</Heading>
          <Button onClick={() => navigate('/create-event/templates')}>+ {t('add_event')}</Button>
        </div>
        {loading ? (
          <Text>{t('loading')}</Text>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Text secondary style={{ marginBottom: '1rem' }}>{t('no_events_yet')}</Text>
            <Button onClick={() => navigate('/create-event/templates')}>{t('create_first_event')}</Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {events.map((ev) => (
              <Card key={ev.id} style={{ padding: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }} 
                onClick={() => navigate('/dashboard/' + ev.id)} 
                onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')} 
                onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Heading level={3} style={{ marginBottom: '0.5rem' }}>{ev.brideName} & {ev.groomName}</Heading>
                <Text secondary style={{ marginBottom: '1rem' }}>{new Date(ev.eventDate).toLocaleDateString('ro-RO')}</Text>
                {ev.selectedPackage && (
                  <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--color-bg)', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    {t('package')}: {ev.selectedPackage}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}