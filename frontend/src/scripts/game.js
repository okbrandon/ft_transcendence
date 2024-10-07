import * as THREE from 'three';
import { BallAttributes, PaddleAttributes, Particles, DashedLine } from './gameShapes';

const Lightning = (scene, terrain) => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 2);
	scene.add(ambientLight);
	// Light intensity and distance configuration
	const lightIntensity = 80;
	const lightDistance = 150;

	const lightColors = ['#FF6F91', '#6FFFE9', '#B983FF', '#FFD700'];

	// Positions for the four corner lights
	const cornerPositions = [
		{ x: -terrain.SCENEWIDTH / 2, y: terrain.SCENEHEIGHT / 2, z: 15 },  // Top-left
		{ x: terrain.SCENEWIDTH / 2, y: terrain.SCENEHEIGHT / 2, z: 15 },   // Top-right
		{ x: -terrain.SCENEWIDTH / 2, y: -terrain.SCENEHEIGHT / 2, z: 15 }, // Bottom-left
		{ x: terrain.SCENEWIDTH / 2, y: -terrain.SCENEHEIGHT / 2, z: 15 }   // Bottom-right
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

const AddToScene = (scene, terrain, lights, paddle1, paddle2, ball) => {
	const { paddleGeometry, paddleMaterial } = PaddleAttributes(terrain);
	const { ballGeometry, ballMaterial } = BallAttributes(terrain);

	paddle1.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle1.current.position.set(-11, 0, 0);
	paddle1.current.castShadow = true;
	scene.add(paddle1.current);

	paddle2.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle2.current.position.set(11, 0, 0);
	paddle2.current.castShadow = true;
	scene.add(paddle2.current);

	ball.current = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.current.position.set(0, 0, 0);
	ball.current.castShadow = true;
	scene.add(ball.current);
}

const createParticleBurst = (scene, position) => {
	const particleCount = 20;
	const particleGeometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const velocities = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i++) {
		positions[i * 3] = position.x;
		positions[i * 3 + 1] = position.y;
		positions[i * 3 + 2] = position.z;

		velocities[i * 3] = (Math.random() - 0.5) * 2;
		velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
		velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

	const particleMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 0.1,
		transparent: true,
		opacity: 1.0,
	});

	const particles = new THREE.Points(particleGeometry, particleMaterial);
	scene.add(particles);

	let animationFrameId;

	const animateBurst = () => {
		const positions = particleGeometry.attributes.position.array;
		const velocities = particleGeometry.attributes.velocity.array;

		let allInvisible = true;

		for (let i = 0; i < particleCount; i++) {
			positions[i * 3] += velocities[i * 3] * 0.05;
			positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.05;
			positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.05;
		}

		particleMaterial.opacity *= 0.95;
		particleGeometry.attributes.position.needsUpdate = true;

		if (particleMaterial.opacity > 0.01) {
			allInvisible = false;
		}

		if (!allInvisible) {
			animationFrameId = requestAnimationFrame(animateBurst);
		} else {
			scene.remove(particles);
			particleGeometry.dispose();
			particleMaterial.dispose();

			cancelAnimationFrame(animationFrameId);
		}
	};

	animationFrameId = requestAnimationFrame(animateBurst);
};

const GameCanvas = (canvas, paddle1, paddle2, ball, terrain, hit) => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, terrain.WIDTH / terrain.HEIGHT, 0.1, 1000);
	camera.position.set(0, 0, 20.7);
	camera.lookAt(0, 0, 0);

	const lights = Lightning(scene, terrain);
	const particles = Particles(scene);
	const dashedLine = DashedLine(scene, terrain);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
	renderer.shadowMap.enabled = true;

	AddToScene(scene, terrain, lights, paddle1, paddle2, ball);

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
			particles.wave.amplitude = 5;
			particles.wave.x = ripplePosition.x;
			particles.wave.y = -ripplePosition.y;
			particles.wave.radius = 5;
			hit.current = null;

			createParticleBurst(scene, hitPosition);
		}
		if (particles.wave.amplitude > 0) particles.animateWave();
		animationFrameId = requestAnimationFrame(animate);
	};
	animate();

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

export default GameCanvas;
