import React from 'react';

function Flashcard({ front, back }) {
  return (
    <div>
      <div>Front: {front}</div>
      <div>Back: {back}</div>
    </div>
  );
}

export default Flashcard;
