import * as THREE from 'three';

export const roundedRectShape = (width, height, radius) => {
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

export const PaddleAttributes = (terrain, textureUrl = null) => {
	const textureLoader = new THREE.TextureLoader();
	let paddleMaterial;

	if (textureUrl) {
		const paddleTexture = textureLoader.load(`/images/skins/${textureUrl}`, texture => {
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.flipY = false;
			texture.repeat.set(1, 1);
		});

		paddleMaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			map: paddleTexture
		});
	} else {
		paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
	}

	const paddleShape = roundedRectShape(20 * terrain.SCALEX, 120 * terrain.SCALEY, 10 * terrain.SCALEX);
	const extrudeSettings = { depth: 0.5, bevelEnabled: false };
	const paddleGeometry = new THREE.ExtrudeGeometry(paddleShape, extrudeSettings);
	return {paddleGeometry, paddleMaterial};
}

export const BallAttributes = terrain => {
	const ballGeometry = new THREE.SphereGeometry(25 * terrain.SCALEX / 2, 32, 32);
	const ballMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
	return {ballGeometry, ballMaterial};
}

export const DashedLine = (scene, terrain) => {
	const lineMaterial = new THREE.LineDashedMaterial({
		color: 0x3f3944,
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
