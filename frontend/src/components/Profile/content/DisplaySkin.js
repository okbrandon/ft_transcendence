import React, { useCallback, useEffect, useRef } from "react";
import { StyledCanvas, UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { roundedRectShape } from "../../../scripts/gameShapes";
import { useTranslation } from "react-i18next";

const DisplaySkin = ({ currentSkin }) => {
	const canvasRef = useRef(null);
	const { t } = useTranslation();

	const getPaddleMaterial = useCallback(skin => {
		const textureLoader = new THREE.TextureLoader();

		if (skin) {
			const paddleTexture = textureLoader.load(`/images/skins/${skin}`, texture => {
				texture.wrapS = THREE.ClampToEdgeWrapping;
				texture.wrapT = THREE.ClampToEdgeWrapping;
				texture.flipY = false;
				texture.offset.set(0.5, 0.5);
				texture.repeat.set(0.1, 0.1);
				texture.needsUpdate = true;
			});

			return new THREE.MeshLambertMaterial({
				color: 0xffffff,
				map: paddleTexture,
			});
		} else {
			return new THREE.MeshLambertMaterial({ color: 0xffffff });
		}
	}, []);

	// Function to initialize scene
	const initScene = useCallback((canvas, currentSkin) => {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x1e1e28);

		// Camera setup
		const camera = new THREE.PerspectiveCamera(40, 600 / 300, 0.1, 1000);
		camera.position.set(0, 0, 5);
		camera.lookAt(0, 0, 0);

		// Lighting setup
		const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
		directionalLight.position.set(1, 1, 1);
		directionalLight.castShadow = true;
		scene.add(directionalLight, ambientLight);

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		renderer.setSize(600, 300);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;

		// Load texture if available
		const paddleMaterial = getPaddleMaterial(currentSkin);

		// Create paddle shape and mesh
		const paddleShape = roundedRectShape(5, 1, 0.2);
		const extrudeSettings = { depth: 0.5, bevelEnabled: false };
		const paddleGeometry = new THREE.ExtrudeGeometry(paddleShape, extrudeSettings).center();
		const mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
		mesh.castShadow = true;
		scene.add(mesh);

		// Set up controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
		controls.enablePan = true;

		return { scene, camera, renderer, mesh, controls };
	}, [getPaddleMaterial]);

	useEffect(() => {
		const { scene, camera, renderer, mesh, controls } = initScene(canvasRef.current, currentSkin);

		// Animation loop
		let animationFrameId;
		const animate = () => {
			mesh.rotation.y += 0.01;
			renderer.render(scene, camera);
			controls.update();
			animationFrameId = requestAnimationFrame(animate);
		};
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
			mesh.geometry.dispose();
			mesh.material.dispose();
			scene.clear();
			renderer.dispose();
			controls.dispose();
		};
	}, [currentSkin, initScene]);

    return (
        <UserInfoItemContainer>
            <UserInfoItemTitle>{t('profile.skinDisplay.title')}</UserInfoItemTitle>
			<StyledCanvas ref={canvasRef} />
        </UserInfoItemContainer>
    );
};

export default DisplaySkin;
