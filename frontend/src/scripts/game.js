import * as THREE from 'three';
import { BallAttributes, PaddleAttributes, Particles } from './gameShapes';

const Lightning = scene => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambientLight);

	const ballLight = new THREE.PointLight(0xffffff, 50, 50);
	ballLight.castShadow = true;

	return { ambientLight, ballLight };
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
	ball.current.add(lights.ballLight);
	scene.add(ball.current);
}

const GameCanvas = (canvas, paddle1, paddle2, ball, terrain, hit) => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, terrain.WIDTH / terrain.HEIGHT, 0.1, 1000);
	camera.position.set(0, 0, 20.7);
	camera.lookAt(0, 0, 0);

	const lights = Lightning(scene);
	const particles = Particles(scene);

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
		scene.remove(lights.ballLight);
		lights.ballLight.dispose();

		particles.dispose();

		renderer.dispose();
	}

	return {renderer, camera, dispose};
};

export default GameCanvas;
