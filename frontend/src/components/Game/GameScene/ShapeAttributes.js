import * as THREE from 'three';

// Paddle geometry and material (rounded rectangles with shadows and gradient effect)
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
	const paddleShape = roundedRectShape(20 * terrain.SCALEX, 120 * terrain.SCALEY, 0.1 * terrain.SCALEX);
	const extrudeSettings = { depth: 0.1, bevelEnabled: false };
	const paddleGeometry = new THREE.ExtrudeGeometry(paddleShape, extrudeSettings);
	const paddleMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xaaaaaa,
		shininess: 50,
		emissive: 0x333333,
	});
	return {paddleGeometry, paddleMaterial};
}

export const BallAttributes = terrain => {
	const ballGeometry = new THREE.SphereGeometry(25 * terrain.SCALEX / 2, 32, 32);
	const ballMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specular: 0xffffff,
		shininess: 100,
		emissive: 0x555555,
	});
	return {ballGeometry, ballMaterial};
}
