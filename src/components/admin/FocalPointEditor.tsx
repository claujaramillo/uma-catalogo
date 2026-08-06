'use client';
import { useState, useRef, useEffect, PointerEvent } from 'react';
import Image from 'next/image';

interface Props {
  imageUrl: string;
  initialPosition?: string; // e.g. "50% 50%"
  inputName?: string; // e.g. "image_position"
  aspectRatio?: 'vertical' | 'horizontal'; // vertical = 3:4, horizontal = 21:9
}

export default function FocalPointEditor({ 
  imageUrl, 
  initialPosition = '50% 50%',
  inputName = 'image_position',
  aspectRatio = 'vertical'
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(() => {
    const parts = initialPosition.split(' ');
    return {
      x: parseFloat(parts[0]) || 50,
      y: parseFloat(parts[1]) || 50
    };
  });
  const [tempPosition, setTempPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // In object-position, 0% means the left edge of the image touches the left edge of the container.
    // 100% means the right edge touches the right edge.
    // Dragging mouse to the left should move the image left, which means we decrease X%.
    
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.movementX;
    const dy = e.movementY;
    
    // We roughly estimate the movement relative to the container size
    // A 1% shift corresponds to moving the mouse by 1% of the width/height
    // It's not mathematically perfect for object-fit cover but feels natural for dragging.
    const percentX = (dx / rect.width) * 100;
    const percentY = (dy / rect.height) * 100;
    
    setTempPosition(prev => ({
      x: Math.max(0, Math.min(100, prev.x - percentX)),
      y: Math.max(0, Math.min(100, prev.y - percentY))
    }));
  };

  const handlePointerUp = (e: PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSave = () => {
    setPosition(tempPosition);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempPosition({ x: 50, y: 50 });
  };

  const posString = `${Math.round(position.x)}% ${Math.round(position.y)}%`;
  const tempPosString = `${Math.round(tempPosition.x)}% ${Math.round(tempPosition.y)}%`;

  return (
    <div>
      {/* Hidden input to pass data to Server Action automatically */}
      <input type="hidden" name={inputName} value={posString} />

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1rem', background: 'var(--uma-marfil)',
          border: '1px solid rgba(58,36,34,0.15)', borderRadius: '4px',
          color: 'var(--uma-cacao)', fontSize: '0.8rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s', marginTop: '0.5rem'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--uma-crema)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--uma-marfil)'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        Ajustar imagen
      </button>

      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(252, 251, 248, 0.9)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: 'var(--uma-blanco)',
            borderRadius: '8px',
            boxShadow: '0 24px 60px rgba(58,36,34,0.1)',
            width: '100%', maxWidth: '600px',
            overflow: 'hidden', border: '1px solid rgba(58,36,34,0.1)'
          }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(58,36,34,0.06)' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--uma-cacao)', margin: 0 }}>
                Encuadre de Imagen
              </h2>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: 'var(--uma-taupe)' }}>
                Arrastra la imagen para ajustar qué porción se mostrará en {aspectRatio === 'vertical' ? 'las miniaturas del catálogo (3:4)' : 'la portada (horizontal)'}.
              </p>
            </div>

            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', background: 'var(--uma-crema)' }}>
              <div 
                ref={containerRef}
                style={{
                  width: aspectRatio === 'vertical' ? '300px' : '500px', 
                  height: aspectRatio === 'vertical' ? '400px' : '220px',
                  position: 'relative',
                  borderRadius: '4px', overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                {/* Visual grid to help framing */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                  border: '1px solid rgba(255,255,255,0.4)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr'
                }}>
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)' }} />
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.3)' }} />
                  <div />
                </div>
                
                <Image 
                  src={imageUrl} 
                  alt="Preview" 
                  fill 
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: tempPosString,
                    pointerEvents: 'none' // Important to let pointer events go to the container
                  }} 
                />
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--uma-blanco)', borderTop: '1px solid rgba(58,36,34,0.06)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--uma-taupe)', fontFamily: 'monospace' }}>
                {tempPosString}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button"
                  onClick={handleReset}
                  style={{ background: 'none', border: 'none', color: 'var(--uma-arcilla)', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Restablecer
                </button>
                <button 
                  type="button"
                  onClick={() => { setTempPosition(position); setIsOpen(false); }}
                  style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid var(--uma-arena)', borderRadius: '4px', color: 'var(--uma-cacao)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="button"
                  onClick={handleSave}
                  style={{ padding: '0.6rem 1.5rem', background: 'var(--uma-cacao)', border: 'none', borderRadius: '4px', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                >
                  Guardar encuadre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
