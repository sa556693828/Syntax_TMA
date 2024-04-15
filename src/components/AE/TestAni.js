import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PhysicsSimulation = () => {
    const renderRef = useRef();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('p5').then(({ default: p5 }) => {
                const sketch = (p) => {
                    let engine;
                    let boxes = [];
                    let mouseConstraint;

                    p.setup = () => {
                        p.createCanvas(600, 600).parent(renderRef.current);
                        p.background(255);
                        let { Engine, Bodies, World, Mouse, MouseConstraint } = Matter;
                        let boxA = Bodies.rectangle(300, 800, 40, 40);
                        let ground = Bodies.rectangle(p.width / 2, p.height + 15, p.width, 30, { isStatic: true });
                        let wallLeft = Bodies.rectangle(-15, p.height, 30, 200, { isStatic: true });
                        let wallRight = Bodies.rectangle(615, p.height, 30, 200, { isStatic: true });

                        engine = Engine.create();

                        var mouse = Mouse.create(p.canvas.elt);
                        mouseConstraint = MouseConstraint.create(engine, { mouse: mouse });
                        World.add(engine.world, mouseConstraint);

                        boxes.push(boxA);
                        boxes.push(ground);
                        boxes.push(wallLeft);
                        boxes.push(wallRight);
                        World.add(engine.world, [boxA, ground, wallLeft, wallRight]);
                        Engine.run(engine);
                    };

                    p.generateNewBox = () => {
                        let { Engine, Bodies, World } = Matter;
                        let sz = p.random([50, 70, 90]);
                        let boxA = Bodies.polygon(p.random(p.width), 600, p.int(p.random(3, 8)), sz);
                        boxA.sz = sz;
                        boxes.push(boxA);
                        World.add(engine.world, boxA);
                    };

                    p.draw = () => {
                        p.background(255);
                        for (let box of boxes) {
                            let sz = box.sz;
                            p.fill(0);
                            p.stroke(255);
                            if (mouseConstraint.constraint.bodyB === box) {
                                p.fill(255);
                                p.stroke(0);
                            }
                            p.strokeWeight(1);
                            p.beginShape();
                            for (let vert of box.vertices) {
                                p.vertex(vert.x, vert.y);
                            }
                            p.endShape(p.CLOSE);

                            p.rectMode(p.CENTER);
                            p.noStroke();
                            p.push();
                            p.translate(box.position.x, box.position.y);
                            p.rotate(box.angle);
                            if (sz) {
                                p.fill(255);
                                p.ellipse(8, 0, 10);
                                p.ellipse(-8, 0, 10);
                                p.rect(0, 18, 20, 2);
                                p.fill(0);
                                p.ellipse(8, 0, 5);
                                p.ellipse(-8, 0, 5);
                                p.ellipse(0, 10, 10);
                                p.fill(0);
                            }
                            p.pop();
                        }

                        if (p.frameCount % 10 === 0) {
                            p.generateNewBox();
                        }
                    };
                };
                new p5(sketch);
            });
        }
    }, [])
    return <div ref={renderRef} />
};

export default PhysicsSimulation;
