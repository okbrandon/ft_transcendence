import * as THREE from 'three';
import { BallAttributes, PaddleAttributes } from './ShapeAttributes';

const Lightning = scene => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);

	// Spotlight for strong neon-like lighting effects
	const spotlight = new THREE.SpotLight(0xff00ff, 100);
	spotlight.position.set(0, 0, 20);
	spotlight.castShadow = true;
	scene.add(spotlight);
};

function computeGeometry() {
	const nb = 50, amp = 0.1, fre = 1, pi2= Math.PI*2;
	const width = 38, depth = 25;

	const positions = new Float32Array( nb * nb * 3 )
	const colors = new Float32Array( nb * nb * 3 )

	let k = 0
	for ( let i = 0; i < nb; i ++ ) {
		for ( let j = 0; j < nb; j ++ ) {
			const x = i*(width/nb)-width/2
			const z = j*(depth/nb)-depth/2
			const y = 0
			positions[ 3 * k + 0 ] = x
			positions[ 3 * k + 1 ] = y
			positions[ 3 * k + 2 ] = z
			// const intensity = (y / amp) / 2 + 0.3
			const intensity = 0.3;
			colors[ 3 * k + 0] = j/nb * intensity
			colors[ 3 * k + 1 ] = 0
			colors[ 3 * k + 2 ] = i/nb * intensity
			k++
		}
	}
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
	geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) )
	geometry.computeBoundingBox()
	return geometry
}

const Particles = scene => {
	const geometry = computeGeometry();
	const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true });
	const mesh = new THREE.Points(geometry, material);
	mesh.rotation.x = Math.PI / 2;
	mesh.position.set(0, 0, -10);
	scene.add(mesh);

	let wave = { amplitude: 0, x: 0, z: 0, speed: 0.02, time: 0 }; // Initial wave state

	const animateWave = () => {
		const positions = geometry.attributes.position.array;
		const nb = 50;
		const amp = 0.3; // Adjust amplitude of wave

		for (let i = 0; i < nb; i++) {
			for (let j = 0; j < nb; j++) {
				const index = (i * nb + j) * 3;
				const x = positions[index];
				const z = positions[index + 2];

				// Distance from wave origin
				const distance = Math.sqrt((x - wave.x) ** 2 + (z - wave.z) ** 2);

				// Calculate y displacement based on wave equation
				const y = amp * wave.amplitude * Math.sin(wave.time - distance);

				// Update the Y position of the particles
				positions[index + 1] = y;
			}
		}

		geometry.attributes.position.needsUpdate = true;

		// Animate the wave over time
		wave.time += wave.speed;
		wave.amplitude *= 0.98; // Decay amplitude over time
	};

	return { mesh, animateWave, wave };
};

const GameScene = (canvas, paddle1, paddle2, ball, terrain, hit) => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(40, terrain.WIDTH / terrain.HEIGHT, 0.1, 1000);
	camera.position.set(0, 0, 20.7);
	camera.lookAt(0, 0, 0);

	Lightning(scene);
	const particles = Particles(scene);

	const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
	renderer.setSize(terrain.WIDTH, terrain.HEIGHT);
	renderer.shadowMap.enabled = true;

	const { paddleGeometry, paddleMaterial } = PaddleAttributes(terrain);
	const { ballGeometry, ballMaterial } = BallAttributes(terrain);

	paddle1.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle1.current.position.set(-11, 0, 0);
	paddle1.current.castShadow = true; // Enable shadows
	scene.add(paddle1.current);

	paddle2.current = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddle2.current.position.set(11, 0, 0);
	paddle2.current.castShadow = true; // Enable shadows
	scene.add(paddle2.current);

	ball.current = new THREE.Mesh(ballGeometry, ballMaterial);
	ball.current.position.set(0, 0, 0);
	ball.current.castShadow = true; // Enable shadows for the ball
	scene.add(ball.current);

	const animate = () => {
		renderer.render(scene, camera);
		if (hit && hit.current) {
			particles.wave.amplitude = 1;  // Reset amplitude to full
			particles.wave.x = hit.current.x;  // Set wave origin to paddle hit
			particles.wave.z = hit.current.z;
			particles.wave.time = 0; // Reset wave time
			hit.current = null;
		}
		if (particles.wave.amplitude > 0) {
			particles.animateWave();
		}
		requestAnimationFrame(animate);
	};
	animate();

	return {renderer, camera};
};

export default GameScene;
