const lesson = (event) => {
  event.target.style.borderBottom = "5px solid rgba(105, 56, 38, 0.356)";
  // window.location.href = "../intermidiary.html";
  body.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center h-100">
      <video class="hero-video" src="https://res.cloudinary.com/dahtbxvyk/video/upload/f_auto,q_auto/v1763993246/flutter_xyu5nr.mp4"
        autoplay muted loop preload="auto"
        poster="https://res.cloudinary.com/dahtbxvyk/video/upload/so_0/v1763993246/flutter_xyu5nr.jpg"
         style="max-width: 550px;">
      </video>
      <p style="margin: 0; font-weight: bold;">Loading...</p>
    </div>
  `;
  body.style.height = "100vh";
  body.style.display = "flex";
  body.style.alignItems = "center";
  body.style.justifyContent = "center";
}


