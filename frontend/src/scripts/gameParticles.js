import * as THREE from "three";

const computeGeometry = () => {
	const nb = 50;
	const width = 38, depth = 25;
	const positions = new Float32Array( nb * nb * 3 );
	const colors = new Float32Array( nb * nb * 3 );

	let k = 0;
	for ( let i = 0; i < nb; i ++ ) {
		for ( let j = 0; j < nb; j ++ ) {
			const x = i * (width / nb) - width / 2;
			const z = j * (depth / nb) - depth / 2;
			const y = 0;
			positions[ 3 * k + 0 ] = x;
			positions[ 3 * k + 1 ] = y;
			positions[ 3 * k + 2 ] = z;

			const intensity = 0.7;
			colors[ 3 * k + 0 ] = j / nb * intensity;
			colors[ 3 * k + 1 ] = 0;
			colors[ 3 * k + 2 ] = i / nb * intensity;
			k++;
		}
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3 ));
	geometry.setAttribute('color', new THREE.BufferAttribute( colors, 3 ));
	geometry.computeBoundingBox();
	return geometry;
}

export const addParticles = scene => {
	const geometry = computeGeometry();
	const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true });
	const mesh = new THREE.Points(geometry, material);
	mesh.rotation.x = Math.PI / 2;
	mesh.position.set(0, 0, -10);
	scene.add(mesh);

	let waves = [];

	const animateWave = () => {
		const positions = geometry.attributes.position.array;
		const nb = 50;

		for (let i = 0; i < nb * nb; i++) {
			positions[i * 3 + 1] = 0;
		}

		const indexToRemove = [];

		waves.forEach((wave, waveIndex) => {
			for (let i = 0; i < nb; i++) {
				for (let j = 0; j < nb; j++) {
					const index = (i * nb + j) * 3;
					const x = positions[index];
					const y = positions[index + 2];

					const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);

					const rippleEffect = wave.amplitude * Math.sin(distance - wave.radius);

					if (distance < wave.radius) {
						positions[index + 1] = rippleEffect;
					}
				}
			}

			wave.radius += wave.speed;
			if (wave.amplitude > 0.05) {
				wave.amplitude *= 0.98;
			} else {
				indexToRemove.push(waveIndex);
			}
		});

		for (let i = indexToRemove.length - 1; i >= 0; i--) {
			waves.splice(indexToRemove[i], 1);
		}

		geometry.attributes.position.needsUpdate = true;
	};

	const dispose = () => {
		scene.remove(mesh);
		geometry.dispose();
		material.dispose();
	};

	return { animateWave, waves, dispose };
};

export const createParticleBurst = (scene, position) => {
	const particleCount = 100;
	const particleGeometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const velocities = new Float32Array(particleCount * 3);

	for (let i = 0; i < particleCount; i++) {
		positions[i * 3] = position.x;
		positions[i * 3 + 1] = position.y;
		positions[i * 3 + 2] = position.z;

		velocities[i * 3] = (Math.random() - 0.5) * 3;
		velocities[i * 3 + 1] = (Math.random() - 0.5) * 3;
		velocities[i * 3 + 2] = (Math.random() - 0.5) * 3;
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

	const particleMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 0.15,
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

			velocities[i * 3] += (Math.random() - 0.5) * 0.01;
			velocities[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
		}

		// Update geometry attributes
        particleGeometry.attributes.position.needsUpdate = true;

        // Gradually fade out the particles by reducing opacity
        particleMaterial.opacity *= 0.95;

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
