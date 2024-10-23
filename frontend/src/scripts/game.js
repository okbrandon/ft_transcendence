import * as THREE from 'three';
import { setBallAttributes, setPaddleAttributes, addDashedLine, setWallAttributes } from './gameShapes';
import { createParticleBurst, addParticles } from './gameParticles';

const addLights = (scene, terrain, ball) => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 2);
	scene.add(ambientLight);
	// Light intensity and distance configuration
	const lightIntensity = 80;
	const lightDistance = 30;

	const lightColors = ['#FF6F91', '#6FFFE9', '#B983FF', '#FFD700'];

	// Positions for the four corner lights
	const cornerPositions = [
		{ x: -terrain.SCENEWIDTH / 2, y: terrain.SCENEHEIGHT / 2, z: 5 },  // Top-left
		{ x: terrain.SCENEWIDTH / 2, y: terrain.SCENEHEIGHT / 2, z: 5 },   // Top-right
		{ x: -terrain.SCENEWIDTH / 2, y: -terrain.SCENEHEIGHT / 2, z: 5 }, // Bottom-left
		{ x: terrain.SCENEWIDTH / 2, y: -terrain.SCENEHEIGHT / 2, z: 5 }   // Bottom-right
	];

	// Add 4 corner lights
	const cornerLights = cornerPositions.map((position, index) => {
		const pointLight = new THREE.PointLight(lightColors[index], lightIntensity, lightDistance);
		pointLight.position.set(position.x, position.y, position.z);
		pointLight.castShadow = true;
		scene.add(pointLight);
		return pointLight;
	});

	return { ambientLight, cornerLights };
};

const addPaddle = (scene, terrain, paddleSkin, paddle, side) => {
	const { paddleGeometry, paddleMaterial } = setPaddleAttributes(terrain, paddleSkin);
	paddle.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle.current.position.set(side === 'left' ? -11 : 11, 0, 0);
	paddle.current.castShadow = true;
	scene.add(paddle.current);
}

const addWall = (scene, terrain, side, walls) => {
	const { wallGeometry, wallMaterial } = setWallAttributes(terrain);

	const wall = new THREE.Mesh(wallGeometry, wallMaterial);
	wall.position.set(side === 'left' ? -terrain.SCENEWIDTH / 2 - 1.5 : terrain.SCENEWIDTH / 2 + 1.5, 0, 0);
	scene.add(wall);
	walls.push(wall);
}

const addToScene = (scene, terrain, paddle1, paddle2, paddle1Skin, paddle2Skin, ball, walls) => {
	const { ballGeometry, ballMaterial } = setBallAttributes(terrain);

	addPaddle(scene, terrain, paddle1Skin, paddle1, 'left');
	addPaddle(scene, terrain, paddle2Skin, paddle2, 'right');

	ball.current = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.current.position.set(0, 0, 0);
	ball.current.castShadow = true;
	scene.add(ball.current);

	addWall(scene, terrain, 'left', walls);
	addWall(scene, terrain, 'right', walls);
}

const gameCanvas = (canvas, paddle1, paddle2, paddle1Skin, paddle2Skin, ball, terrain, hit) => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, terrain.WIDTH / terrain.HEIGHT, 0.1, 1000);
	camera.position.set(0, 0, 20.8);
	camera.lookAt(0, 0, 0);

	const walls = [];
	addToScene(scene, terrain, paddle1, paddle2, paddle1Skin, paddle2Skin, ball, walls);

	const lights = addLights(scene, terrain, ball);
	const particles = addParticles(scene);
	const dashedLine = addDashedLine(scene, terrain);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
	renderer.shadowMap.enabled = true;

	const mapToRipplePlane = (hitPosition, cameraZ, rippleZ) => {
		const zRatio = (cameraZ - rippleZ) / cameraZ;
		const adjustedX = hitPosition.x * zRatio;
		const adjustedY = hitPosition.y * zRatio;
		return { x: adjustedX, y: adjustedY };
	}

	let animationFrameId;

	const animate = () => {
		renderer.render(scene, camera);

		if (hit && hit.current) {
			const hitPosition = new THREE.Vector3(hit.current.x, hit.current.y, 0);
			const ripplePosition = mapToRipplePlane(hitPosition, camera.position.z, -10);

			particles.waves.push({
				amplitude: 5,
				x: ripplePosition.x,
				y: -ripplePosition.y,
				radius: 5,
				speed: 0.05
			});
			hit.current = null;

			createParticleBurst(scene, hitPosition);
		}
		if (particles.waves.length > 0) particles.animateWave();

		animationFrameId = requestAnimationFrame(animate);
	};
	animationFrameId = requestAnimationFrame(animate);

	const dispose = () => {
		cancelAnimationFrame(animationFrameId);
		if (paddle1.current) {
			paddle1.current.geometry.dispose();
			paddle1.current.material.dispose();
			scene.remove(paddle1.current);
		}
		if (paddle2.current) {
			paddle2.current.geometry.dispose();
			paddle2.current.material.dispose();
			scene.remove(paddle2.current);
		}
		if (ball.current) {
			ball.current.geometry.dispose();
			ball.current.material.dispose();
			scene.remove(ball.current);
		}

		walls.forEach(wall => {
			wall.geometry.dispose();
			wall.material.dispose();
			scene.remove(wall);
		});

		scene.remove(lights.ambientLight);
		lights.ambientLight.dispose();
		lights.cornerLights.forEach(light => {
			scene.remove(light);
			light.dispose();
		});

		particles.dispose();
		dashedLine.dispose();
		renderer.dispose();
	}

	return {renderer, camera, dispose};
};

export default gameCanvas;
