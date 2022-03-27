import { writable, type Writable, get } from 'svelte/store';
import type { FSM } from './fsm';

interface Animal {
  type: string,
  fsm: FSM,
}

interface WorldStore {
  animals: Array<Animal>;
}

const createWorld = () => {
  const { update, subscribe }: Writable<WorldStore> = writable({
    animals: [],
  });
  return {
    subscribe,
    findClosest: (source, type, range) => {
      let best = 10000000;
      let bestAnimal;

      update(world => {
        world.animals.forEach((animal) => {
          if (animal.type != type) return;
          console.log(animal)
          let d = source.distanceTo(animal.fsm)
          if (range && d <= range && d <= best) {
            bestAnimal = animal;
          }
        })
        return world;
      })
      return bestAnimal;
    },
    add: (type, fsm) => {
      update(world => ({animals: [...world.animals, {type, fsm}]}));
    }
  }
}

export const world = createWorld();