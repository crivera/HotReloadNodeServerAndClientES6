export function getRandomColor() {
	let length = 6;
	const chars = '0123456789ABCDEF';
	let hex = '';
	while(length--) hex += chars[(Math.random() * 16) | 0];
	return hex;
}

export function now() {
	return new Date().getTime();
}

export function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}