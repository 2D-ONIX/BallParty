// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/
export default class Juego extends Phaser.Scene {
  constructor() {
    super("Juego");

    // Variables para controlar el estado del juego
    this.gameStarted = false;
    this.showTitleScreen = true;

    // Variables de juego
    this.puntos = 0;
    this.nivel = 1;
    this.velocidadBola = 200;
  }

  preload() {}

  create() {
    // Fondo del juego
    this.cameras.main.setBackgroundColor("#FFFFFF");

    // Bola verde
    this.bola = this.add.circle(400, 300, 15, 0x00FF00);
    this.bola.vx = this.velocidadBola;
    this.bola.vy = this.velocidadBola;

    // Barra amarilla
    this.barra = this.add.rectangle(400, 550, 100, 10, 0xFFFF00);

    // Texto de nivel y puntos
    this.nivelText = this.add.text(20, 20, "Nivel: " + this.nivel, {
      fontSize: "20px",
      fill: "#000000",
    });

    this.puntosText = this.add.text(700, 20, "Puntos: " + this.puntos, {
      fontSize: "20px",
      fill: "#000000",
    });

    // Control de teclas
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // Eventos de colisión
    this.physics.add.collider(this.bola, this.barra, this.colisionBolaBarra, null, this);

    // Intervalo para generar el cubo azul
    this.time.addEvent({
      delay: 3000,
      callback: this.generarCuboAzul,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // Movimiento de la barra
    if (this.cursorKeys.left.isDown) {
      this.barra.x -= 5;
    } else if (this.cursorKeys.right.isDown) {
      this.barra.x += 5;
    }

    if (this.cursorKeys.up.isDown) {
      this.barra.y -= 5;
    } else if (this.cursorKeys.down.isDown) {
      this.barra.y += 5;
    }

    // Movimiento de la bola
    if (this.gameStarted) {
      this.bola.x += this.bola.vx * this.time.deltaTime / 1000;
      this.bola.y += this.bola.vy * this.time.deltaTime / 1000;

      // Rebote en los bordes de la pantalla
      if (this.bola.x <= 15 || this.bola.x >= 785) {
        this.bola.vx *= -1;
      }
      if (this.bola.y <= 15 || this.bola.y >= 585) {
        this.bola.vy *= -1;
      }
    }
  }

  colisionBolaBarra() {
    this.puntos += 10;
    this.puntosText.setText("Puntos: " + this.puntos);

    if (this.puntos >= 100) {
      this.puntos = 0;
      this.puntosText.setText("Puntos: " + this.puntos);
      this.nivel += 1;
      this.nivelText.setText("Nivel: " + this.nivel);

      this.velocidadBola *= 1.1;
      this.bola.vx = this.velocidadBola;
      this.bola.vy = this.velocidadBola;

      const randomColor = Phaser.Display.Color.RandomRGB();
      this.cameras.main.setBackgroundColor(randomColor.color);
    }
  }

  generarCuboAzul() {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);
    this.add.rectangle(x, y, 30, 30, 0x0000FF);
  }
}
