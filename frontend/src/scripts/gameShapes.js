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

export const setPaddleAttributes = (terrain, textureUrl = null) => {
	const textureLoader = new THREE.TextureLoader();
	let paddleMaterial;

	if (textureUrl) {
		const paddleTexture = textureLoader.load(`/images/skins/${textureUrl}`, texture => {
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;
			texture.flipY = false;
			texture.offset.set(0.5, 0.5);
			texture.repeat.set(0.4, 0.4);
			texture.rotation = Math.PI / 2;
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

export const setBallAttributes = terrain => {
	const ballGeometry = new THREE.SphereGeometry(25 * terrain.SCALEX / 2, 32, 32);
	const ballMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
	return {ballGeometry, ballMaterial};
}

export const setWallAttributes = terrain => {
	const wallHeight = terrain.SCENEHEIGHT + 5;

	const wallMaterial = new THREE.MeshPhysicalMaterial({
		color: 0x666666,
		reflectivity: 0.9,
		roughness: 0.05,
		thickness: 1.0,
		transmission: 0.9,
		ior: 1.5,
		transparent: true,
		opacity: 0.8,
	});

	const wallGeometry = new THREE.BoxGeometry(0, wallHeight, 2);

	return { wallGeometry, wallMaterial };
}

export const addDashedLine = (scene, terrain) => {
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
