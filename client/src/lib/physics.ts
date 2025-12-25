import type { Body, Vector2D, SystemMetrics } from "@shared/schema";

export function add(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector2D, b: Vector2D): Vector2D {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function multiply(v: Vector2D, scalar: number): Vector2D {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function magnitude(v: Vector2D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalize(v: Vector2D): Vector2D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function distance(a: Vector2D, b: Vector2D): number {
  return magnitude(subtract(a, b));
}

export function computeAcceleration(body: Body, bodies: Body[], G: number): Vector2D {
  let ax = 0;
  let ay = 0;
  const softening = 10;

  for (const other of bodies) {
    if (other.id === body.id) continue;

    const dx = other.position.x - body.position.x;
    const dy = other.position.y - body.position.y;
    const distSq = dx * dx + dy * dy + softening * softening;
    const dist = Math.sqrt(distSq);
    const force = (G * other.mass) / distSq;

    ax += force * (dx / dist);
    ay += force * (dy / dist);
  }

  return { x: ax, y: ay };
}

export function eulerStep(bodies: Body[], G: number, dt: number): Body[] {
  return bodies.map((body) => {
    const acc = computeAcceleration(body, bodies, G);
    const newVelocity = add(body.velocity, multiply(acc, dt));
    const newPosition = add(body.position, multiply(body.velocity, dt));

    return {
      ...body,
      position: newPosition,
      velocity: newVelocity,
    };
  });
}

export function verletStep(bodies: Body[], G: number, dt: number): Body[] {
  const accelerations = bodies.map((body) => computeAcceleration(body, bodies, G));

  const halfVelocities = bodies.map((body, i) => 
    add(body.velocity, multiply(accelerations[i], dt / 2))
  );

  const newPositions = bodies.map((body, i) => 
    add(body.position, multiply(halfVelocities[i], dt))
  );

  const tempBodies = bodies.map((body, i) => ({
    ...body,
    position: newPositions[i],
  }));

  const newAccelerations = tempBodies.map((body) => 
    computeAcceleration(body, tempBodies, G)
  );

  return bodies.map((body, i) => ({
    ...body,
    position: newPositions[i],
    velocity: add(halfVelocities[i], multiply(newAccelerations[i], dt / 2)),
  }));
}

export function rk4Step(bodies: Body[], G: number, dt: number): Body[] {
  const n = bodies.length;

  const getState = (bs: Body[]): { pos: Vector2D[]; vel: Vector2D[] } => ({
    pos: bs.map((b) => b.position),
    vel: bs.map((b) => b.velocity),
  });

  const applyDerivatives = (
    pos: Vector2D[],
    vel: Vector2D[],
    dpos: Vector2D[],
    dvel: Vector2D[],
    h: number
  ): Body[] => {
    return bodies.map((b, i) => ({
      ...b,
      position: add(pos[i], multiply(dpos[i], h)),
      velocity: add(vel[i], multiply(dvel[i], h)),
    }));
  };

  const computeDerivatives = (bs: Body[]): { dpos: Vector2D[]; dvel: Vector2D[] } => {
    const dpos = bs.map((b) => b.velocity);
    const dvel = bs.map((b) => computeAcceleration(b, bs, G));
    return { dpos, dvel };
  };

  const state0 = getState(bodies);
  const k1 = computeDerivatives(bodies);

  const bodies2 = applyDerivatives(state0.pos, state0.vel, k1.dpos, k1.dvel, dt / 2);
  const k2 = computeDerivatives(bodies2);

  const bodies3 = applyDerivatives(state0.pos, state0.vel, k2.dpos, k2.dvel, dt / 2);
  const k3 = computeDerivatives(bodies3);

  const bodies4 = applyDerivatives(state0.pos, state0.vel, k3.dpos, k3.dvel, dt);
  const k4 = computeDerivatives(bodies4);

  return bodies.map((body, i) => {
    const newPos = {
      x: state0.pos[i].x + (dt / 6) * (k1.dpos[i].x + 2 * k2.dpos[i].x + 2 * k3.dpos[i].x + k4.dpos[i].x),
      y: state0.pos[i].y + (dt / 6) * (k1.dpos[i].y + 2 * k2.dpos[i].y + 2 * k3.dpos[i].y + k4.dpos[i].y),
    };
    const newVel = {
      x: state0.vel[i].x + (dt / 6) * (k1.dvel[i].x + 2 * k2.dvel[i].x + 2 * k3.dvel[i].x + k4.dvel[i].x),
      y: state0.vel[i].y + (dt / 6) * (k1.dvel[i].y + 2 * k2.dvel[i].y + 2 * k3.dvel[i].y + k4.dvel[i].y),
    };

    return {
      ...body,
      position: newPos,
      velocity: newVel,
    };
  });
}

export function stepSimulation(
  bodies: Body[],
  G: number,
  dt: number,
  method: "euler" | "verlet" | "rk4"
): Body[] {
  switch (method) {
    case "euler":
      return eulerStep(bodies, G, dt);
    case "verlet":
      return verletStep(bodies, G, dt);
    case "rk4":
      return rk4Step(bodies, G, dt);
  }
}

export function computeKineticEnergy(bodies: Body[]): number {
  return bodies.reduce((total, body) => {
    const v = magnitude(body.velocity);
    return total + 0.5 * body.mass * v * v;
  }, 0);
}

export function computePotentialEnergy(bodies: Body[], G: number): number {
  let total = 0;
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const dist = distance(bodies[i].position, bodies[j].position);
      if (dist > 0) {
        total -= (G * bodies[i].mass * bodies[j].mass) / dist;
      }
    }
  }
  return total;
}

export function computeMomentum(bodies: Body[]): Vector2D {
  return bodies.reduce(
    (total, body) => ({
      x: total.x + body.mass * body.velocity.x,
      y: total.y + body.mass * body.velocity.y,
    }),
    { x: 0, y: 0 }
  );
}

export function computeAngularMomentum(bodies: Body[]): number {
  return bodies.reduce((total, body) => {
    const L = body.mass * (body.position.x * body.velocity.y - body.position.y * body.velocity.x);
    return total + L;
  }, 0);
}

export function computeCenterOfMass(bodies: Body[]): Vector2D {
  const totalMass = bodies.reduce((sum, b) => sum + b.mass, 0);
  if (totalMass === 0) return { x: 0, y: 0 };

  return {
    x: bodies.reduce((sum, b) => sum + b.mass * b.position.x, 0) / totalMass,
    y: bodies.reduce((sum, b) => sum + b.mass * b.position.y, 0) / totalMass,
  };
}

export function computeSystemMetrics(bodies: Body[], G: number): SystemMetrics {
  const kineticEnergy = computeKineticEnergy(bodies);
  const potentialEnergy = computePotentialEnergy(bodies, G);

  return {
    kineticEnergy,
    potentialEnergy,
    totalEnergy: kineticEnergy + potentialEnergy,
    momentum: computeMomentum(bodies),
    angularMomentum: computeAngularMomentum(bodies),
    centerOfMass: computeCenterOfMass(bodies),
  };
}
