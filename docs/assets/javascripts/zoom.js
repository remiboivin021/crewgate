document.addEventListener('DOMContentLoaded', function() {
  var overlay = document.createElement('div');
  overlay.id = 'img-zoom-overlay';
  overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;cursor:zoom-out;justify-content:center;align-items:center;';
  overlay.addEventListener('click', function() { overlay.style.display = 'none'; });

  var img = document.createElement('img');
  img.style.cssText = 'max-width:95%;max-height:95%;object-fit:contain;';
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  document.querySelectorAll('.md-content img[src*="data:image/svg+xml"]').forEach(function(el) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      img.src = this.src;
      img.alt = this.alt;
      overlay.style.display = 'flex';
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') overlay.style.display = 'none';
  });
});
