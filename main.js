// ============================================================================
//  Demo Plataformas
// 
// ============================================================================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const constante = {
	FPS: 100,
	TILE_X: 50,
	TILE_Y: 50,
	COLUMNAS: 16,
	FILAS: 11,
	NRO_ESTRELLAS: 500
}

const resolucion = [constante.TILE_X * constante.COLUMNAS, constante.TILE_Y * constante.FILAS]

const objeto = {
	fondoimg: [],
	estrella: []
}

const sonidos = {
	musica_fondo: new Audio('./audio/backgroundMusic.wav')
}

// ============================================================================
let comenzar = false;

document.addEventListener('click', (ev) => {

	console.log(ev.target.id);

	if (ev.target.id === 'canvas' && !comenzar) {
		comenzar = true;
		sonidos.musica_fondo.play();
		sonidos.musica_fondo.loop = true;
	}

});

// ============================================================================
class FondoImg {

	constructor() {

		this.img = new Image();
		this.img.src = './img/fondo_espacial_pixabay1.jpg';

		this.rect = {
			x: 0,
			y: 0,
			ancho: resolucion[0],
			alto: resolucion[1]  
		}
	}

	dibuja() {
		ctx.globalAlpha = 1.0;
		ctx.drawImage(this.img, this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
	}
}

// ============================================================================
class Estrella {

	constructor(imagen) {

		this.img = new Image();
		this.img.src = imagen;

		this.rect = {
			x: 0,
			y: 0,
			ancho: 0,
			alto: 0
		}

		this.move = {
			angulo: undefined,
			vel: undefined,
			alpha: 0.5,
		}

		this.check_resetEstrella(true);
	}

	dibuja(comenzar) {

		if (!comenzar) return;

		this.actualiza();
		
		const x = Math.floor(this.rect.x);
		const y = Math.floor(this.rect.y);
		const ancho = Math.floor(this.rect.ancho);
		const alto = Math.floor(this.rect.alto);

		ctx.globalAlpha = this.move.alpha;
		ctx.drawImage(this.img, x, y, ancho, alto);
	}

	actualiza() {

		this.rect.x += Math.cos(this.move.angulo) * this.move.vel;
		this.rect.y += Math.sin(this.move.angulo) * this.move.vel;

		this.rect.ancho += this.move.vel / 80;
		this.rect.alto = this.rect.ancho;

		if (this.move.alpha < 1.0) this.move.alpha += this.move.vel / 100;

		this.check_resetEstrella(false);
	}

	check_resetEstrella(inicial) {

		const ancho = this.rect.ancho * 2;
		const alto = this.rect.alto * 2;

		if (this.rect.x + ancho > resolucion[0] || this.rect.x < -ancho || this.rect.y + alto > resolucion[1] || this.rect.y < -alto || inicial) {

			const grados_rnd = numero_random(0, 359);

			this.rect.x = numero_random(Math.floor(canvas.width / 2) - 2, Math.floor(canvas.width / 2) + 2);
			this.rect.y = numero_random(Math.floor(canvas.height / 2) - 2, Math.floor(canvas.height / 2) + 2);
			this.rect.ancho = 1.0;
			this.rect.alto = 1.0;

			this.move.angulo = (grados_rnd * Math.PI) / 180;
			this.move.vel = numero_random(1, 4);
			this.move.alpha = 0.5;
		}
	}
}

// ============================================================================
function numero_random(min, max) {
	return Math.floor(Math.random()* (max - min) + min);
}

// ============================================================================
function dibuja_texto(id, txt, x, y, font, align, color, alpha, comenzar) {

	if (comenzar && id === 1) return;
	if (!comenzar && id === 2) return;

	ctx.save();

	ctx.font = font;
	ctx.textAlign = align;
	ctx.shadowColor = 'white';
	ctx.shadowBlur = 8;
	// ctx.fillStyle = lista_colores[Math.floor(Math.random()* lista_colores.length)];
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.fillText(txt, x, y);

	ctx.restore();
}

// ============================================================================
window.onload = () => {

	canvas.width = resolucion[0];
	canvas.height = resolucion[1];
	ctx.scale(1, 1);

	// -------------------------------------------------
	objeto.fondoimg = new FondoImg();

	for (let i = 0; i < constante.NRO_ESTRELLAS; i ++) {
		objeto.estrella.push(new Estrella('./img/estrella_movil.png'));
	}

	// -------------------------------------------------
	setInterval(() => {
		bucle_principal();
	}, 1000 / constante.FPS);
}

// ===================================================================
function bucle_principal() {

	// ctx.fillStyle = 'rgb(0, 0, 35)';
	// ctx.fillRect(0, 0, resolucion[0], resolucion[1]);

	objeto.fondoimg.dibuja();

	objeto.estrella.forEach(star => {
		star.dibuja(comenzar);
	});

	dibuja_texto(1, 'Toque para hipervelocidad...', Math.floor(resolucion[0] / 2), Math.floor(resolucion[1] / 2), '24px arial', 'center', 'lightyellow', 1, comenzar);
	dibuja_texto(2, 'hipervelocidad activada!', Math.floor(resolucion[0] / 2), resolucion[1] - 30, '24px arial', 'center', 'lightyellow', 1, comenzar);
}
