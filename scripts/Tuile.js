import {jeu} from './index.js';

export class Tuile extends createjs.Bitmap {

    constructor(type, couleur) {

        super(type);

        this.couleur = couleur;
        this.vitesse = 10;
        this.scale = 0.6;
        this.regY = this.getTransformedBounds().height;

        this.initialiser();

        this.ecouteurDescente = this.descente.bind(this);
        createjs.Ticker.addEventListener("tick", this.ecouteurDescente);
    }

    initialiser() {

        //Fonction servant à positionner la tuile selon dans quelle colonne elle est.

        this.y = -100;

        if (this.couleur === "rouge") {
            this.x = 158;
        } else if (this.couleur === "vert") {
            this.x = 358;
        } else if (this.couleur === "bleu") {
            this.x = 858;
        } else if (this.couleur === "jaune") {
            this.x = 1058;
        }
    }

    descente() {
        if (this.y >= 800) {
            if(this.couleur === "rouge" || this.couleur === "vert") {
                this.p1Cross();
            } else if(this.couleur === "bleu" || this.couleur === "jaune") {
                this.p2Cross();
            }

        } else {
            this.y += this.vitesse;
        }

        //Série de "if" qui servent à déterminer la position de la tuile lorsqu'elle entre en collision avec le bouton pressé, et donne un score en fonction de la précision.

        if (this.couleur === "rouge" && ndgmr.checkRectCollision(this, jeu.boutonRouge) && jeu.redPressed) {
            if (this.y > 620 && this.y <= 640) {
                jeu.ajusterScoreP1(5);
                console.log("Bien!");
            } else if (this.y > 640 && this.y <= 660) {
                jeu.ajusterScoreP1(10);
                console.log("Super!");
            } else if (this.y > 660 && this.y <= 720) {
                jeu.ajusterScoreP1(15);
                console.log("Parfait!!");
            } else if (this.y > 720 && this.y <= 740) {
                jeu.ajusterScoreP1(10);
                console.log("Super!");
            } else if (this.y > 740) {
                jeu.ajusterScoreP1(5);
                console.log("Bien!");
            } else {
                jeu.ajusterScoreP1(1);
                console.log("Tricher c'est mal!");
            }

            this.detruire();

        } else if (this.couleur === "vert" && ndgmr.checkRectCollision(this, jeu.boutonVert) && jeu.greenPressed) {
            if (this.y > 620 && this.y <= 640) {
                jeu.ajusterScoreP1(5);
                console.log("Bien!");
            } else if (this.y > 640 && this.y <= 660) {
                jeu.ajusterScoreP1(10);
                console.log("Super!");
            } else if (this.y > 660 && this.y <= 720) {
                jeu.ajusterScoreP1(15);
                console.log("Parfait!!");
            } else if (this.y > 720 && this.y <= 740) {
                jeu.ajusterScoreP1(10);
                console.log("Super!");
            } else if (this.y > 740) {
                jeu.ajusterScoreP1(5);
                console.log("Bien!");
            } else {
                jeu.ajusterScoreP1(1);
                console.log("Tricher c'est mal!");
            }
            this.detruire();
        } else if (this.couleur === "bleu" && ndgmr.checkRectCollision(this, jeu.boutonBleu) && jeu.bluePressed) {
            if (this.y > 620 && this.y <= 640) {
                jeu.ajusterScoreP2(5);
                console.log("Bien!");
            } else if (this.y > 640 && this.y <= 660) {
                jeu.ajusterScoreP2(10);
                console.log("Super!");
            } else if (this.y > 660 && this.y <= 720) {
                jeu.ajusterScoreP2(15);
                console.log("Parfait!!");
            } else if (this.y > 720 && this.y <= 740) {
                jeu.ajusterScoreP2(10);
                console.log("Super!");
            } else if (this.y > 740) {
                jeu.ajusterScoreP2(5);
                console.log("Bien!");
            } else {
                jeu.ajusterScoreP2(1);
                console.log("Tricher c'est mal!");
            }
            this.detruire();
        } else if (this.couleur === "jaune" && ndgmr.checkRectCollision(this, jeu.boutonJaune) && jeu.yellowPressed) {
            if (this.y > 620 && this.y <= 640) {
                jeu.ajusterScoreP2(5);
                console.log("Bien!");
            } else if (this.y > 640 && this.y <= 660) {
                jeu.ajusterScoreP2(10);
                console.log("Super!");
            } else if (this.y > 660 && this.y <= 720) {
                jeu.ajusterScoreP2(15);
                console.log("Parfait!!");
            } else if (this.y > 720 && this.y <= 740) {
                jeu.ajusterScoreP2(10);
                console.log("Super!");
            } else if (this.y > 740) {
                jeu.ajusterScoreP2(5);
                console.log("Bien!");
            } else {
                jeu.ajusterScoreP2(1);
                console.log("Tricher c'est mal!");
            }
            this.detruire();
        }


    }

    p1Cross() {

        //Retire 100 points au joueur 1 lorsqu'il manque une touche.

        jeu.ajusterScoreP1(-100);
        jeu.missP1();
        this.detruire();
    }

    p2Cross() {

        //Retire 100 points au joueur 2 lorsqu'il manque une touche.

        jeu.ajusterScoreP2(-100);
        jeu.missP2();
        this.detruire();
    }

    detruire() {

        //Retire l'objet de la scène pour éviter le surchargement de données.

        createjs.Ticker.removeEventListener("tick", this.ecouteurDescente);
        this.parent.removeChild(this);

    }
}