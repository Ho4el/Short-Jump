import kaplay from "https://unpkg.com/kaplay@3000.1.17/dist/kaboom.mjs"
const FLOOR_HEIGHT = 150;
const JUMP_FORCE = 1000;
const SPEED = 480;
const SCALE = 0.3



// initialize context
kaplay({
    width: 1280,
    height: 720,
    letterbox: true,
    background: [43, 133, 145],
    degub: false,
});



scene("game", () => {

    // define gravity
    setGravity(1600);
    


    loadSprite('sun', "assets/img/sun.png")

    // add Sun
    add([
        sprite("sun"),
        pos(800, 0),
        scale(2),
    ]);


    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);




    // load assets
    loadSprite("bean", "assets/img/cats/playercat.png");

    // add a game object to screen
    const player = add([
        // list of components
        sprite("bean"),
        scale(SCALE),
        pos(350, 40),
        area(),
        body(),
    ]);




    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);




    // load assets
    loadSprite("zloa", "assets/img/cats/zlo-dota.png");
    loadSprite("zlob", "assets/img/cats/zlo-inger.png");
    loadSprite("zloc", "assets/img/cats/zlo-yarik.png");


    function spawnTree() {
        const value = Math.floor(Math.random() * (4 - 1)) + 1;
        let nameS = 'none';

        if (value === 1) {
            nameS = 'zloa';
        } else if (value === 2) {
            nameS = 'zlob';
        } else {
            nameS = 'zloc';
        }


        // add tree obj
        add([
            sprite(nameS),
            body(),
            area(),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            move(LEFT, rand(SPEED + 250, SPEED + 380)),
            offscreen({destroy: true}),
            scale(rand(SCALE - 0.05 , SCALE)),
            "tree",
        ]);



        // wait a random amount of time to spawn next tree
        wait(rand(2, 2.8), spawnTree);
    }




    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;
    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    loop(1, () => {
        score++;
        scoreLabel.text = score;
    });
});




scene("lose", (score) => {
    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(SCALE * 2),
        anchor("center"),
    ]);


    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);


    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("game");
