import { loadVideo } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.querySelector("#ar-container"),
      imageTargetSrc: '../../assets/targets/sintel.mind',
    });

    const { renderer, scene, camera } = mindarThree;

    // Load video element
    const video = await loadVideo("../../assets/videos/sintel/sintel.mp4");
    video.muted = false; // enable sound
    video.volume = 1.0;
    video.playsInline = true;

    // Setup video texture
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(1, 204 / 480); // Adjust to your video aspect ratio
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.visible = false; // Hide initially

    // Anchor setup
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      plane.visible = true;
      video.play(); // Play when target found
    };

    anchor.onTargetLost = () => {
      video.pause();  // Pause when target lost
      video.currentTime = 0; // Reset to beginning
      plane.visible = false;
    };

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  };

  const button = document.getElementById("start-button");
  button.addEventListener('click', async () => {
    await start();
    button.style.display = "none";
  });
});
