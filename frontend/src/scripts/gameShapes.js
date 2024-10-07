import * as THREE from 'three';

const roundedRectShape = (width, height, radius) => {
	const shape = new THREE.Shape();
	const w = width / 2;
	const h = height / 2;

	shape.moveTo(-w + radius, -h);
	shape.lineTo(w - radius, -h);
	shape.quadraticCurveTo(w, -h, w, -h + radius);
	shape.lineTo(w, h - radius);
	shape.quadraticCurveTo(w, h, w - radius, h);
	shape.lineTo(-w + radius, h);
	shape.quadraticCurveTo(-w, h, -w, h - radius);
	shape.lineTo(-w, -h + radius);
	shape.quadraticCurveTo(-w, -h, -w + radius, -h);

	return shape;
};

export const PaddleAttributes = terrain => {
	const paddleShape = roundedRectShape(20 * terrain.SCALEX, 120 * terrain.SCALEY, 10 * terrain.SCALEX);
	const extrudeSettings = { depth: 0.5, bevelEnabled: false };
	const paddleGeometry = new THREE.ExtrudeGeometry(paddleShape, extrudeSettings);
	const paddleMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xaaaaaa,
		shininess: 100,
		emissive: 0x333333,
	});
	return {paddleGeometry, paddleMaterial};
}

export const BallAttributes = terrain => {
	const ballGeometry = new THREE.SphereGeometry(25 * terrain.SCALEX / 2, 32, 32);
	const ballMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		emissive: 0xffffff,
		emissiveIntensity: 100,
		metalness: 0.1,
		roughness: 0.2,
		clearcoat: 1,
		clearcoatRoughness: 0.05,
	});
	return {ballGeometry, ballMaterial};
}

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

			const intensity = 0.3;
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

export const Particles = scene => {
	const geometry = computeGeometry();
	const material = new THREE.PointsMaterial({ size: 0.15, vertexColors: true });
	const mesh = new THREE.Points(geometry, material);
	mesh.rotation.x = Math.PI / 2;
	mesh.position.set(0, 0, -10);
	scene.add(mesh);

	let wave = { amplitude: 0, x: 0, y: 0, radius: 0, speed: 0.05 };

	const animateWave = () => {
		const positions = geometry.attributes.position.array;
		const nb = 50;

		for (let i = 0; i < nb; i++) {
			for (let j = 0; j < nb; j++) {
				const index = (i * nb + j) * 3;
				const x = positions[index];
				const y = positions[index + 2];

				// Distance from wave origin
				const distance = Math.sqrt((x - wave.x) ** 2 + (y - wave.y) ** 2);

				// Ripple based on distance from the center and wave time
				const rippleEffect = wave.amplitude * Math.sin(distance - wave.radius);

				// Apply ripple height
				if (distance < wave.radius) {
					positions[index + 1] = rippleEffect;
				} else {
					positions[index + 1] = 0;
				}
			}
		}

		geometry.attributes.position.needsUpdate = true;

		wave.radius += wave.speed;

		if (wave.amplitude > 0.05) {
			wave.amplitude *= 0.98;
		}
	};

	const dispose = () => {
		scene.remove(mesh);
		geometry.dispose();
		material.dispose();
	};

	return { animateWave, wave, dispose };
};

export const DashedLine = (scene, terrain) => {
	const lineMaterial = new THREE.LineDashedMaterial({
		color: 0xffffff,
		dashSize: 0.5,
		gapSize: 0.5,
	});
	const points = [];
	points.push(new THREE.Vector3(0, terrain.SCENEHEIGHT / 2, 0));
	points.push(new THREE.Vector3(0, -terrain.SCENEHEIGHT / 2, 0));

	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
	const line = new THREE.Line(lineGeometry, lineMaterial);
	line.computeLineDistances();
	scene.add(line);

	const dispose = () => {
		scene.remove(line);
		lineGeometry.dispose();
		lineMaterial.dispose();
	};

	return { dispose };
};
