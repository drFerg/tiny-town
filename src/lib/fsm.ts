import { writable, type Writable, get } from 'svelte/store';
import type { Vector3 } from 'three';
import { aimTowardAndGetDistance, minMagnitude, randomPoint, toCurve, toPoint } from './utils';
import { world } from './world';

interface State {
  enter?: CallableFunction;
  leave?: CallableFunction;
  update?: CallableFunction;
  clipName?: string;
  clipLoop?: boolean;
}

export interface FSM {
  subscribe: CallableFunction;
  transition: CallableFunction;
  tick: CallableFunction;
  age: CallableFunction;
  move: CallableFunction;
  rotate: CallableFunction;
  distanceTo: CallableFunction;
  attack: CallableFunction;
  receiveAttack: CallableFunction;
}

export interface FSMStore {
  name: string,
  history: State[];
  stateName: string;
  state: State;
  nextState?: State;
  nextStateName?: string;
  tstamp: number;
  tstampTx: number;
  position: Vector3;
  rotation: Vector3;
  data: {};
}

export const createFSM = (
  name: string = "",
  states: { [stateName: string]: State },
  initial: string,
  tstamp: number,
  position = {x: 0, y: 0, z: 0},
  data?: {},
) => {
  const { update, subscribe }: Writable<FSMStore> = writable({
    name,
    history: [],
    stateName: 'init',
    state: {},
    nextStateName: initial,
    tstamp: 0,
    tstampTx: 0,
    position: toPoint(position),
    rotation: toPoint({x: 0, y: 0, z: 0}),
    data: {},
  });
  let fsm: Partial<FSM> = {};
  fsm = {
    transition: function (stateName: string) {
      update((ctx) => ({...ctx, nextStateName: stateName}));
    },
    tick: function (tstamp) {

      let fsm;
      update((_fsm) => {
        // update time
        fsm = _fsm;
        fsm.tstamp = tstamp;
        return fsm;
      });

      // check for transition
      if (!fsm.nextStateName) {
        // run state's update method
        if (fsm.state.update) {
          fsm.state.update(this, fsm, tstamp);
        }
        return;
      }

      // otherwise, we're transitioning on this tick
      
      // run previous state's leave func
      console.log('leaving: ', fsm.stateName);
      if (fsm.state.leave) {
        fsm.state.leave(this, fsm, tstamp);
      }

      update((_fsm) => {
        fsm = _fsm;
      
        // push history
        fsm.history = [...fsm.history, fsm.state];

        // _transition_
        fsm.tstampTx = tstamp;
        fsm.stateName = fsm.nextStateName;
        fsm.state = states[fsm.stateName];
        fsm.nextStateName = null;
        return fsm;
      });

      console.log('entering: ', fsm.stateName);
      // run new state's enter func
      if (fsm.state.enter) {
        fsm.state.enter(this, fsm, tstamp);
      }

    },
    move: function (position) {
      update((fsm) => {
        fsm.position = position;
        return fsm;
      });
    },
    rotate: function (rotation) {
      update((fsm) => {
        fsm.rotation = rotation;
        return fsm;
      });
    },
    age: function (tstamp) {
      let age = 0;
      update((fsm) => {
        age = tstamp - fsm.tstampTx;
        return fsm;
      });
      return age;
    },
    distanceTo: function (targetFSM) {
      let _fsm: FSMStore = get(this);
      let _targetFSM: FSMStore = get(targetFSM);
      return _fsm.position.distanceTo(_targetFSM.position);
    },
    attack: function (targetFSM) {
      targetFSM.receiveAttack(this);
    },
    receiveAttack: function (sourceFSM) {
      this.transition(fsm, "attacked")
      update((fsm) => ({...fsm, attacker: sourceFSM}))
    },
    subscribe,
    update,
  };

  console.log('created fsm for ', name, fsm, states);
  return fsm;
};

const setAnimation = (animation) => null;
const maxTurnSpeed = Math.PI * (16 / 4);



export const states: { [stateName: string]: State } = {
  eating: {
    clipName: 'Eating',
    enter: (actions, ctx) => {
      setAnimation('eating');
      ctx.data.age = 10 +  Math.random() * 10;
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        actions.transition('idle');
      }
    }
  },
  idle: {
    clipName: 'Idle',
    enter: (actions, ctx) => {
      ctx.data.age = 2 + Math.random() * 5;
      setAnimation('idle')
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        actions.transition('moving');
      }
    }
  },
  moving: {
    clipName: 'Walk',
    enter: (actions, ctx) => {
      ctx.data.age = 10 + Math.random() * 10;
      setAnimation('walking')
      let points = Array.from({ length: 5 }, () => toPoint({
        x: randomPoint(),
        y: randomPoint(),
      }));
      points[0] = ctx.position;
      let curve = toCurve(points);
      ctx.data.curve = curve;
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        if (Math.random() > 0.5) {
          actions.transition('scared');
        }
        else {
          actions.transition('eating');
        }
        return;
      }
      let position = ctx.data.curve.getPointAt((tstamp - ctx.tstampTx)  * 0.005 % ctx.data.age);
      
      aimTowardAndGetDistance(ctx, position, maxTurnSpeed)
      actions.move(position);
    }
  },
  scared: {
    clipName: 'Gallop',
    enter: (actions, ctx) => {
      ctx.data.age = 5 + Math.random() * 10;
      setAnimation('gallop')
      let points = Array.from({ length: 5 }, () => toPoint({
        x: randomPoint(),
        y: randomPoint(),
      }));
      points[0] = ctx.position;
      let curve = toCurve(points);
      ctx.data.curve = curve;
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        actions.transition('eating');
        return;
      }
      let position = ctx.data.curve.getPointAt((tstamp - ctx.tstampTx)  * 0.05 % ctx.data.age);
      
      aimTowardAndGetDistance(ctx, position, maxTurnSpeed)
      actions.move(position);
    }
  },
  attacked: {
    clipName: 'Idle',
    enter: (actions, ctx) => {
      if (ctx.data.health <= 0) actions.transition("dead");
      else actions.transition("scared");
    },
  },
  dead: {
    clipName: 'Death',
    clipLoop: false,
  }
};



export const foxStates: { [stateName: string]: State } = {
  idle: {
    clipName: 'Idle',
    enter: (actions, ctx) => {
      ctx.data.age = 2 + Math.random() * 5;
      setAnimation('idle')
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        actions.transition('find');
      }
    }
  },
  find: {
    clipName: 'Eating',
    enter: (actions, ctx) => {
      let lunch = world.findClosest(actions, "Alpaca", 100);
      actions.update(ctx => ({...ctx, data: {...ctx.data, lunch}}));
    },
    update: (actions, ctx, tstamp) => {
      if (ctx.data.lunch) {
        console.log("Found lunch")
        actions.transition("hunting");
        return;
      }
      else {
        actions.transition("idle");
      }
    }
  },
  hunting: {
    clipName: 'Walk',
    enter: (actions, ctx) => {
      ctx.data.age = 10 + Math.random() * 10;
      setAnimation('walking')
      let target: FSMStore = get(ctx.data.lunch);
      let points = [ctx.position, target.position];
      let curve = toCurve(points);
      ctx.data.curve = curve;
    },
    update: (actions, ctx, tstamp) => {
      if (actions.age(tstamp) >= ctx.data.age) {
        actions.transition('find');
        return;
      }

      // are we close? attack
      if (actions.distanceTo(ctx.data.lunch) <= 1) {
        actions.transition('attack');
        return;
      }

      let position = ctx.data.curve.getPointAt((tstamp - ctx.tstampTx)  * 0.05 % 1);
      
      aimTowardAndGetDistance(ctx, position, maxTurnSpeed)
      actions.move(position);
    }
  },
  attack: {
    clipName: 'Attack',
    enter: (actions, ctx) => {
      ctx.data.age = 2 + Math.random() * 2;
      setAnimation('attacking')
    },
    update: (actions, ctx, tstamp) => {
      // are still close? find
      if (actions.distanceTo(ctx.data.lunch) > 1) {
        actions.transition('find');
        return;
      }

      // turn to face target
      let target: FSMStore = get(ctx.data.lunch);
      aimTowardAndGetDistance(ctx, target.position, maxTurnSpeed)
      // actions.attack(ctx.data.lunch);
    }
  },
};
