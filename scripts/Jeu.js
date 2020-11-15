import {Bouton} from "./Bouton.js";
import {Tuile} from "./Tuile.js";

export class Jeu {
    constructor() {

        this.canvas = document.querySelector("canvas");

        this.chargeur = null;
        this.stage = null;

        this.boutonRouge = null;
        this.boutonVert = null;
        this.boutonBleu = null;
        this.boutonJaune = null;

        this.redPressed = false;
        this.greenPressed = false;
        this.bluePressed = false;
        this.yellowPressed = false;

        this.tableauType = [undefined, "btn1", "btn2", "btn3", "btn4"];
        this.tableauCouleur = [undefined, "rouge", "vert", "bleu", "jaune"];
        this.tableauMusic = [130, 155, 130, 120, 135,];
        this.song = null;

        this.boutonStart = null;
        this.boutonRestart = null;
        this.fenetreDebut = null;
        this.fenetreFin = null;

        this.highScore = localStorage.getItem("score");
        if(this.highScore === null) {
            this.highScore = 0;
        }

        this.params = {
            cadence: 60,
            formatPolice: "100px 'Championship'",
            formatScore: "50px 'Championship'",
            formatTextScore: "35px 'Championship'",
            manifeste: "ressources/manifest.json"
        };

        this.charger(this.debuter.bind(this));
        this.initialiser();
    }

    charger(fonction) {
        this.chargeur = new createjs.LoadQueue();
        this.chargeur.installPlugin(createjs.Sound);
        this.chargeur.addEventListener("complete", fonction);
        this.chargeur.addEventListener('error', this.abandonner.bind(this));
        this.chargeur.loadManifest(this.params.manifeste);
    }

    initialiser() {
        this.stage = new createjs.StageGL(this.canvas, {antialias: true});

        createjs.Ticker.addEventListener("tick", e => this.stage.update(e));
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = this.params.cadence;

        this.ecouteurTouchePesee = this.gererTouchePesee.bind(this);
        this.ecouteurToucheRelachee = this.gererToucheRelachee.bind(this);
        window.addEventListener("keydown", this.ecouteurTouchePesee);
        window.addEventListener("keyup", this.ecouteurToucheRelachee);
    }

    gererTouchePesee(e) {

        //Déclenche une fonction avec un paramètre selon la touche appuyée

        if (e.key === "a" || e.key === "A") {
            this.boutonPese("rouge");
        } else if (e.key === "s" || e.key === "S") {
            this.boutonPese("vert");
        } else if (e.key === "k" || e.key === "K") {
            this.boutonPese("bleu");
        } else if (e.key === "l" || e.key === "L") {
            this.boutonPese("jaune");
        }

    }

    gererToucheRelachee(e) {

        //Déclenche une fonction avec un paramètre selon la touche relâchée

        if (e.key === "a" || e.key === "A") {
            this.boutonLache("rouge");
        } else if (e.key === "s" || e.key === "S") {
            this.boutonLache("vert");
        } else if (e.key === "k" || e.key === "K") {
            this.boutonLache("bleu");
        } else if (e.key === "l" || e.key === "L") {
            this.boutonLache("jaune");
        }
    }

    boutonPese(type) {

        //La touche appuyée devient semi-transparente sur l'écran et active une propriété qui est utilisée pour la détection de collisions.

        if (this.boutonRouge.couleur === type) {
            this.boutonRouge.alpha = 0.5;
            this.redPressed = true;
        } else if (this.boutonVert.couleur === type) {
            this.boutonVert.alpha = 0.5;
            this.greenPressed = true;
        } else if (this.boutonBleu.couleur === type) {
            this.boutonBleu.alpha = 0.5;
            this.bluePressed = true;
        } else if (this.boutonJaune.couleur === type) {
            this.boutonJaune.alpha = 0.5;
            this.yellowPressed = true;
        }
    }

    boutonLache(type) {

        //La touche relachée redevient à son opacité originale et perd sa propriété utilisée pour la détection de collisions.

        if (this.boutonRouge.couleur === type) {
            this.boutonRouge.alpha = 1;
            this.redPressed = false;
        } else if (this.boutonVert.couleur === type) {
            this.boutonVert.alpha = 1;
            this.greenPressed = false;
        } else if (this.boutonBleu.couleur === type) {
            this.boutonBleu.alpha = 1;
            this.bluePressed = false;
        } else if (this.boutonJaune.couleur === type) {
            this.boutonJaune.alpha = 1;
            this.yellowPressed = false;
        }
    }

    abandonner(e) {
        alert("L'élément suivant n'a pu être chargé: " + e.src);
    }

    debuter() {

        //Création de la scène et de tous ses éléments.

        let fond = new createjs.Bitmap(this.chargeur.getResult("fond"));
        this.stage.addChild(fond);

        this.conteneurBoutons = new createjs.Container();
        this.stage.addChild(this.conteneurBoutons);

        this.boutonRouge = new Bouton(this.chargeur.getResult("case1"), "rouge");
        this.conteneurBoutons.addChild(this.boutonRouge);
        this.boutonRouge.x = 145;

        this.boutonVert = new Bouton(this.chargeur.getResult("case2"), "vert");
        this.conteneurBoutons.addChild(this.boutonVert);
        this.boutonVert.x = 345;

        this.boutonBleu = new Bouton(this.chargeur.getResult("case3"), "bleu");
        this.conteneurBoutons.addChild(this.boutonBleu);
        this.boutonBleu.x = 845;

        this.boutonJaune = new Bouton(this.chargeur.getResult("case4"), "jaune");
        this.conteneurBoutons.addChild(this.boutonJaune);
        this.boutonJaune.x = 1045;

        this.boutonRouge.scale = this.boutonVert.scale = this.boutonBleu.scale = this.boutonJaune.scale = 0.8;
        this.boutonRouge.y = this.boutonVert.y = this.boutonBleu.y = this.boutonJaune.y = 650;

        this.pointageP1 = new createjs.Text("0", this.params.formatScore, "#e5c03d");
        this.pointageP1.x = 250;
        this.pointageP1.y = 65;
        this.pointageP1.cache(0, 0, this.pointageP1.getBounds().width*4, 100);
        this.stage.addChild(this.pointageP1);

        this.pointageP2 = new createjs.Text("0", this.params.formatScore, "#e325a2");
        this.pointageP2.x = this.canvas.width - this.pointageP2.getBounds().width - 275;
        this.pointageP2.y = 65;
        this.pointageP2.cache(0, 0, this.pointageP2.getBounds().width*4, 100);
        this.stage.addChild(this.pointageP2);

        this.textMissedP1 = new createjs.Text("MANQUÉ:", this.params.formatTextScore, "#E3EBF2");
        this.textMissedP1.x = 20;
        this.textMissedP1.y = 150;
        this.textMissedP1.cache(0, 0, this.textMissedP1.getBounds().width*4, 100);
        this.stage.addChild(this.textMissedP1);

        this.textMissedP2 = new createjs.Text("MANQUÉ:", this.params.formatTextScore, "#E3EBF2");
        this.textMissedP2.x = this.canvas.width - 153;
        this.textMissedP2.y = 150;
        this.textMissedP2.cache(0, 0, this.textMissedP2.getBounds().width*4, 110);
        this.stage.addChild(this.textMissedP2);

        this.missedP1 = new createjs.Text("0", this.params.formatScore, "#E3EBF2");
        this.missedP1.x = 70;
        this.missedP1.y = 200;
        this.missedP1.cache(0, 0, this.missedP1.getBounds().width*4, 100);
        this.stage.addChild(this.missedP1);

        this.missedP2 = new createjs.Text("0", this.params.formatScore, "#E3EBF2");
        this.missedP2.x = this.canvas.width - 100;
        this.missedP2.y = 200;
        this.missedP2.cache(0, 0, this.missedP2.getBounds().width*4, 100);
        this.stage.addChild(this.missedP2);

        this.textHS = new createjs.Text("MEILLEUR SCORE:", this.params.formatTextScore, "#E3EBF2");
        this.textHS.x = this.canvas.width / 2 - this.textHS.getBounds().width / 2;
        this.textHS.y = 50;
        this.textHS.cache(0, 0, this.textHS.getBounds().width, 100);
        this.stage.addChild(this.textHS);

        this.pointageHS = new createjs.Text(this.highScore, this.params.formatScore, "#E3EBF2");
        this.pointageHS.x = this.canvas.width / 2 - this.pointageHS.getBounds().width / 2;
        this.pointageHS.y = 100;
        this.pointageHS.cache(0, 0, this.pointageHS.getBounds().width*4, 100);
        this.stage.addChild(this.pointageHS);

        let accueil = new createjs.Bitmap(this.chargeur.getResult("accueil"));
        this.stage.addChild(accueil);
        accueil.alpha = 1;

        createjs.Tween
            .get(accueil)
            .wait(1000)
            .to({alpha: 0}, 1000, createjs.Ease.quadIn)
            .call(this.fenetreStart.bind(this));
    }

    fenetreStart() {
        this.boutonStart = document.getElementById("buttonStart");
        this.boutonRestart = document.getElementById("buttonRestart");

        this.fenetreDebut = document.getElementById("fenetreDebut");
        this.fenetreFin = document.getElementById("fenetreFin");
        this.fenetreDebut.style.display = "flex";
        this.fenetreFin.style.display = "none";

        this.boutonStart.addEventListener('click', this.start.bind(this));
    }

    start() {
        this.boutonStart.removeEventListener('click', this.ecouteurStart);

        this.fenetreDebut.style.display = "none";

        setTimeout(e => {

            //Sélectionne une chanson aléatoire dans celles disponibles.

            let music = Math.floor(Math.random()*5+1);
            this.song = createjs.Sound.play("music"+ music);

            this.ecouteurSong = this.checkSong.bind(this);
            createjs.Ticker.addEventListener("tick", this.ecouteurSong);
            this.launchBountons = setInterval(this.launch.bind(this), (60/this.tableauMusic[music-1])*1000);
        }, 1000);


    }

    restart() {

        //Fonction servant à redémarrer le jeu à la fin d'une partie.

        this.boutonRestart.removeEventListener("click", this.ecouteurRestart);

        this.pointageP1.text = 0;
        this.pointageP1.updateCache();

        this.pointageP2.text = 0;
        this.pointageP2.updateCache();

        this.missedP1.text = 0;
        this.missedP1.updateCache();

        this.missedP2.text = 0;
        this.missedP2.updateCache();

        this.pointageHS.text = this.highScore;
        this.pointageHS.updateCache();

        this.fenetreDebut.style.display = "flex";
        this.fenetreFin.style.display = "none";

        this.ecouteurStart = this.start.bind(this);
        this.boutonStart.addEventListener('click', this.ecouteurStart);
    }

    checkSong() {

        //Vérifie que la chanson est terminée pour arrêter la partie.

        if(this.song.playState === "playFinished") {
            createjs.Ticker.removeEventListener("tick", this.ecouteurSong);
            this.stopIt();
        }
    }

    stopIt() {

        //Fonction qui arrête la partie.

        clearInterval(this.launchBountons);

        setTimeout(e => {

            this.results = document.getElementById("results");

            if(parseInt(this.pointageP1.text) > parseInt(this.pointageP2.text)) {
                this.results.innerText = "PLAYER 1 WIN";
            } else if(parseInt(this.pointageP1.text) < parseInt(this.pointageP2.text)) {
                this.results.innerText = "PLAYER 2 WIN";
            } else if (parseInt(this.pointageP1.text) === parseInt(this.pointageP2.text)) {
                this.results.innerText = "ÉGALITÉ";
            }

            if(parseInt(this.pointageP1.text) > this.highScore) {
                localStorage.setItem("score", parseInt(this.pointageP1.text));

            }

            if(parseInt(this.pointageP2.text) > this.highScore) {
                localStorage.setItem("score", parseInt(this.pointageP2.text));
            }

            this.highScore = localStorage.getItem("score");

            this.fenetreFin.style.display = "flex";

            this.ecouteurRestart = this.restart.bind(this);
            this.boutonRestart.addEventListener("click", this.ecouteurRestart);
        }, 3000);

    }

    ajusterScoreP1(score) {

        //Augmente le score du joueur 1 selon le score passé en paramètre

        this.pointageP1.text = parseInt(this.pointageP1.text) + score;
        if (parseInt(this.pointageP1.text) < 0) {
            this.pointageP1.text = 0;
        }
        this.pointageP1.updateCache();
    }

    ajusterScoreP2(score) {

        //Augmente le score du joueur 2 selon le score passé en paramètre
        this.pointageP2.text = parseInt(this.pointageP2.text) + score;
        if (parseInt(this.pointageP2.text) < 0) {
            this.pointageP2.text = 0;
        }
        this.pointageP2.updateCache();
    }

    missP1() {

        //Augmente le nombre de notes manquées du joueur 1

        this.missedP1.text = parseInt(this.missedP1.text) + 1;
        this.missedP1.updateCache();
    }

    missP2() {

        //Augmente le nombre de notes manquées du joueur 2

        this.missedP2.text = parseInt(this.missedP2.text) + 1;
        this.missedP2.updateCache();
    }

    launch() {

        //Fonction qui sert à envoyer les tuiles à chaque fréquence (beat) de la chanson) de façon aléatoire (soit à gauche ou à droite) de chaque côté.

        let rand1 = Math.floor(Math.random() * 2) + 1;
        let rand2 = Math.floor(Math.random() * 2) + 3;


        let tuile1 = new Tuile(this.chargeur.getResult(this.tableauType[rand1]), this.tableauCouleur[rand1]);
        this.stage.addChild(tuile1);
        let tuile2 = new Tuile(this.chargeur.getResult(this.tableauType[rand2]), this.tableauCouleur[rand2]);
        this.stage.addChild(tuile2);

    }


}