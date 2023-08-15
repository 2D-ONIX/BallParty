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

    // Variable para controlar si ya se generó un cubo en este nivel
    this.nuevoCuboGenerado = false;
  }

  preload() {}

  create() {
    // Fondo del juego
    this.cameras.main.setBackgroundColor("#FFFFFF");

    // Bola verde
    this.bola = this.physics.add.circle(400, 300, 15, 0x00FF00);
    this.bola.setBounce(1); // Hacer que la bola rebote en lugar de detenerse en las colisiones
    this.bola.setVelocity(this.velocidadBola, this.velocidadBola); // Configurar velocidad inicial
    this.bola.setGravity(0, 0); // Establecer gravedad en cero para la bola

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

    // Colisionador entre la bola y los cubos
    this.cubos = this.physics.add.group();
    this.physics.add.collider(this.bola, this.cubos, this.colisionBolaCubo, null, this);

    // Colisionador entre la barra y los cubos
    this.physics.add.collider(this.barra, this.cubos, this.colisionBarraCubo, null, this);

    // Intervalo para generar el cubo azul
    this.time.addEvent({
      delay: 3000,
      callback: this.generarCuboAzul,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    if (this.nivel <= 20) {
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
        // La lógica de movimiento de la bola permanece sin cambios
      }
    } else {
      // Si el nivel es mayor que 20, el juego se pausa y muestra el mensaje "Win"
      this.physics.pause();
      this.add.text(400, 300, "Win", {
        fontSize: "48px",
        fill: "#000000",
        align: "center",
      }).setOrigin(0.5);
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
      this.bola.vx = this.velocidadBola * Math.cos(Phaser.Math.FloatBetween(0, Math.PI * 2));
      this.bola.vy = this.velocidadBola * Math.sin(Phaser.Math.FloatBetween(0, Math.PI * 2));

      const randomColor = Phaser.Display.Color.RandomRGB();
      this.cameras.main.setBackgroundColor(randomColor.color);

      // Habilitar la generación de un nuevo cubo para el próximo nivel
      this.nuevoCuboGenerado = false;
    }
  }

  generarCuboAzul() {
    if (!this.nuevoCuboGenerado && this.nivel <= 20) {
      const x = Phaser.Math.Between(50, 750);
      const y = Phaser.Math.Between(50, 550);
      const cubo = this.add.rectangle(x, y, 30, 30, 0x0000FF);
      this.cubos.add(cubo);

      // Marcar que se generó un nuevo cubo en este nivel
      this.nuevoCuboGenerado = true;
    }
  }


}

