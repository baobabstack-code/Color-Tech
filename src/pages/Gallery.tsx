import React from 'react';

const Gallery = () => {
  return (
    <div>
      <h1>Our Gallery</h1>
      <p>Here are some examples of our work:</p>
      <div className="gallery">
        <img src="https://source.unsplash.com/random/400x300?gallery1" alt="Gallery 1" />
        <img src="https://source.unsplash.com/random/400x300?gallery2" alt="Gallery 2" />
        <img src="https://source.unsplash.com/random/400x300?gallery3" alt="Gallery 3" />
      </div>
    </div>
  );
};

export default Gallery;
