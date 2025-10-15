"use client";

export default function DragSheeps() {
  return (
    <div>
      <p>(Tukaj bo miniigra za povleci ovčko.)</p>
      <div
        draggable
        onDragStart={() => alert('Začetek povleci ovčko!')}
        style={{
          display: 'inline-block',
          padding: '1rem',
          background: '#eee',
          borderRadius: '1rem',
          cursor: 'grab',
          marginTop: '1rem'
        }}
      >
        🐑 Povleci me!
      </div>
    </div>
  );
}