(function () {
    var Game = function(canvasId) {
        var self = this;        
        
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", "640px");
        canvas.setAttribute("height", "480px");
        canvas.setAttribute("id", canvasId);

        document.getElementById('invaders').appendChild(canvas);
        
        var gameSize = { w: canvas.width, h: canvas.height };
        this.gameSize = gameSize;
        
        var imagePath = '/assets/images/invaders/';
        var images = [];
        var items = 0;
        
        var itemLoaded = function(e) {
            items ++;
            
            if (items >= images.length) {
                self.deaths = [];
                self.entities = createInvaders(self).concat(new Player(self, self.gameSize));
                tick();
            }
        };
        
        var tick = function() {
            self.update();
            self.draw(ctx, gameSize);
            requestAnimationFrame(tick);
        };
                
        var ctx = document.getElementById(canvasId).getContext("2d");
        this.ctx = ctx;
        ctx.fillStyle = "rgb(249, 250, 252)";
        ctx.fillRect(0, 0, gameSize.w, gameSize.h);
        
        var alien = new Image();
        this.alien = alien;
        alien.src = imagePath + "alien.png";
        images.push(alien);
        
        var ship = new Image();
        this.ship = ship;
        ship.src = imagePath + "ship.png";
        images.push(ship);
        
        var death = new Image();
        this.death = death;
        death.src = imagePath + "death.png";
        images.push(death);
        
        var xray = new Image();
        this.xray = xray;
        xray.src = imagePath + "xray.png";
        images.push(xray);
        
        alien.onload = ship.onload = death.onload = xray.onload = itemLoaded;
    };
    
    Game.prototype = {
        update: function() {
            var self = this;
            
            this.deaths = this.deaths.filter(function(d) {
                return d.count >= 0;
            });
            
            var entities = this.entities;
            
            var notCollidingWithAnything = function(entityA) {
                return entities.filter(function (entityB) {
                    var collided = colliding(entityA, entityB);
                    
                    if (collided && (entityA instanceof Invader || entityA instanceof Player)) {
                        self.addDeath(new Death(self, entityA.position));
                    }
                    
                    if (collided && (entityB instanceof Invader || entityB instanceof Player)) {
                        self.addDeath(new Death(self, entityB.position));
                    }
                    
                    return collided;
                }).length === 0;
            };
            
            var outOfBounds = function(ents) {
                return ents.filter(function(e) {
                    return e.position.x > 0 &&
                        e.position.x < self.gameSize.w &&
                        e.position.y > 0 &&
                        e.position.y < self.gameSize.h;
                });
            };
            
            this.entities = outOfBounds(this.entities);
            this.entities = this.entities.filter(notCollidingWithAnything);
            
            for (var i=0; i<this.entities.length; i++) {
                this.entities[i].update();
            }
            
            for (i=0; i<this.deaths.length; i++) {
                this.deaths[i].update();
            }
            
            //console.log("game updating");
        },
        draw: function(ctx, gameSize) {
            ctx.fillStyle = "rgb(249, 250, 252)";
            ctx.fillRect(0, 0, gameSize.w, gameSize.h);
            
            for (var i=0; i<this.deaths.length; i++) {
                this.deaths[i].draw();
            }
            
            for (i=0; i<this.entities.length; i++) {
                this.entities[i].draw();
            }
        },
        addEntity: function(entity) {
            this.entities.push(entity);
        },
        
        addDeath: function(death) {
            this.deaths.push(death);
        },
        
        invadersBelow: function(invader) {
            return this.entities.filter(function (anotherInvader) {
                return anotherInvader instanceof Invader &&
                    anotherInvader.position.y > invader.position.y &&
                    Math.abs(anotherInvader.position.x - invader.position.x < anotherInvader.size.w)
            }).length > 0;
        }
    };
    
    var Player = function(game, gameSize) {
        this.game = game;
        this.size = { w: 26, h: 16 };
        this.position = { x: (gameSize.w - this.size.w)/2, y: gameSize.h - this.size.h };
        this.pauseFire = 0;
        this.fireEnabled = true;
        this.controls = new Controls();
    };
    
    Player.prototype = {
        update: function() {
            if (!this.fireEnabled) this.pauseFire ++;
            if (this.pauseFire > 18) {
                this.pauseFire = 0;
                this.fireEnabled = true;
            }
            
            if (this.controls.isDown(this.controls.KEYS.LEFT)) {
                this.position.x -=1;
            } else if (this.controls.isDown(this.controls.KEYS.RIGHT)) {
                this.position.x += 1;
            }
            
            if (this.fireEnabled && this.controls.isDown(this.controls.KEYS.FIRE)) {
                this.game.addEntity(new Bullet(this, { x: 0, y: -5 }));
                this.fireEnabled = false;
            }
        },
        draw: function() {
            this.game.ctx.drawImage(this.game.ship, 0, 0, this.size.w, this.size.h, this.position.x - this.size.w/2, this.position.y - this.size.h/2, this.size.w, this.size.h);
        }
    };
    
    var Bullet = function(player, vel) {
        this.player = player;
        this.size = { w: 2, h: 8 };
        this.position = { x: player.position.x, y: player.position.y - player.size.h };
        this.vel = vel;
    };
    
    Bullet.prototype = {
        update: function() {
            this.position.x += this.vel.x;
            this.position.y += this.vel.y;
        },
        draw: function() {
            var ctx = this.player.game.ctx;
            ctx.fillStyle = "rgb(252, 103, 103)";
            ctx.fillRect(this.position.x - this.size.w/2, this.position.y - this.size.h/2, this.size.w, this.size.h);
        }
    };
    
    var Invader = function(game, position, i) {
        this.game = game;
        this.position = position;
        this.i = i;
        this.size = { w: 22, h: 14  };
        this.sprite = this.game.alien;
        this.speedX = 0.6;
        this.patrol = 0;
        this.count = (i % 16) * 8;
    };
    
    Invader.prototype = {
        update: function() {
            this.count = (++this.count > 16) ? 0 : this.count;
            
            if (this.patrol < 0 || this.patrol > 74) {
                this.speedX = -this.speedX;
                this.position.y += 15;
            }
            
            this.patrol += this.speedX;
            this.position.x += this.speedX;
            
            if (!this.game.invadersBelow(this) && Math.random() > 0.995) {
                this.game.addEntity(new Xray(this.game, { x: this.position.x - this.size.w/2, y: this.position.y + this.size.h }, { x: Math.random() - 0.5, y: 2 }));
            }
        },
        draw: function() {
            var offset = (this.count > 8) ? this.size.w-1 : 0;
            this.game.ctx.drawImage(this.sprite, 0 + offset, 0, this.size.w-1, this.size.h, this.position.x - this.size.w/2, this.position.y - this.size.h/2, this.size.w, this.size.h);
        }
    };
    
    var Xray = function(game, position, vel) {
        this.game = game;
        this.size = { w: 6, h: 14 };
        this.position = position;
        this.vel = vel;
        this.sprite = this.game.xray;
        this.count = 0;
    };
    
    Xray.prototype = {
        update: function() {
            this.position.x += this.vel.x;
            this.position.y += this.vel.y;
            
            this.count = (++this.count > 10) ? 0 : this.count;
        },
        draw: function() {
            var offset = (this.count > 5) ? 3 : 0;
            this.game.ctx.drawImage(this.sprite, 0 + offset, 0, this.size.w, this.size.h, this.position.x - this.size.w/2, this.position.y - this.size.h/2, this.size.w, this.size.h);
        }
    };
    
    var Death = function(game, position) {
        this.game = game;
        this.size = { w: 22, h:14 };
        this.position = position;
        this.count = 13;
        this.sprite = this.game.death;
    };
    
    Death.prototype = {
        update: function() {
            this.count --;
        },
        draw: function() {
            this.game.ctx.drawImage(this.sprite, 0, 0, this.size.w, this.size.h, this.position.x - this.size.w/2, this.position.y - this.size.h/2, this.size.w, this.size.h);
        }
    };
    
    var Controls = function() {
        var keyState = {};
        
        window.onkeydown = function(e) {
            keyState[e.keyCode] = true;
        };
        
        window.onkeyup = function(e) {
            keyState[e.keyCode] = false;
        };
        
        this.isDown = function(keyCode) {
            return keyState[keyCode] === true;
        };
        
        this.KEYS = { LEFT: 37, RIGHT: 39, FIRE: 32 };
    };
    
    var createInvaders = function(game) {
        var invaders = [];
        
        for (var i=0; i<80; i++) {
            var x = 30 + (i % 16) * 30;
            var y = 30 + ( i % 5) * 21;
            invaders.push(new Invader(game, { x: x, y: y}, i));
        }
        
        return invaders;
    };
    
    var colliding = function(b1, b2) {
        var b1right     = b1.position.x + b1.size.w / 2;
        var b1bottom    = b1.position.y + b1.size.h / 2;
        var b1left      = b1.position.x - b1.size.w / 2;
        var b1top       = b1.position.y - b1.size.h / 2;
        var b2right     = b2.position.x + b2.size.w / 2;
        var b2bottom    = b2.position.y + b2.size.h / 2;
        var b2left      = b2.position.x - b2.size.w / 2;
        var b2top       = b2.position.y - b2.size.h / 2;
        
        return !(b1 === b2 ||
                b1bottom < b2top ||
                b1right < b2left ||
                b1left > b2right ||
                b1top > b2bottom);
    };
    
    window.onload = function() {
        new Game("screen");
    };
})();