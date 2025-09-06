import { useState, useEffect, useCallback } from 'react';
import { GameState, CrimeNode, CRIMES, CAPANGAS, BUILDINGS, BRIBES } from '@/types/game';

const initialState: GameState = {
  dirty: 0,
  clean: 0,
  dirtyPer: 0,
  cleanPer: 0,
  cleanCost: 0,
  heat: 0,
  heatPer: 0,
  eff: 1,
  lv: 1,
  xp: 0,
  xpNeed: 100,
  capMax: 50,
  bldMax: 20,
  subMax: 50,
  crimes: [],
  capangas: [],
  builds: [],
  bribes: [],
  playerCrime: null,
};

export const useGameState = () => {
  const [state, setState] = useState<GameState>(initialState);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [onlyPlayerLevel, setOnlyPlayerLevel] = useState(true);

  const ceilFormat = useCallback((n: number): string => {
    const v = Number.isFinite(n) ? n : 0;
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1e9) return sign + Math.ceil(abs / 1e9) + 'B';
    if (abs >= 1e6) return sign + Math.ceil(abs / 1e6) + 'M';
    if (abs >= 1e3) return sign + Math.ceil(abs / 1e3) + 'k';
    return sign + Math.ceil(abs).toString();
  }, []);

  const clamp = useCallback((x: number, a: number, b: number): number => 
    Math.min(b, Math.max(a, x)), []);

  const totalAssigned = useCallback((): number => {
    return state.crimes.reduce((a, c) => a + (c.workers || 0), 0);
  }, [state.crimes]);

  const availableCapangas = useCallback((): number => {
    return Math.max(0, state.capangas.length - totalAssigned() - (state.playerCrime ? 1 : 0));
  }, [state.capangas.length, totalAssigned, state.playerCrime]);

  const getCrimeNode = useCallback((id: string): CrimeNode | null => {
    setState(prev => {
      let crime = prev.crimes.find(x => x.id === id);
      if (!crime) {
        const base = CRIMES.find(x => x.id === id);
        if (!base) return prev;
        crime = { id, base, workers: 0 };
        return {
          ...prev,
          crimes: [...prev.crimes, crime]
        };
      }
      return prev;
    });
    return state.crimes.find(x => x.id === id) || null;
  }, [state.crimes]);

  const getCrimeWorkers = useCallback((id: string): number => {
    const c = state.crimes.find(x => x.id === id);
    return c ? (c.workers || 0) : 0;
  }, [state.crimes]);

  const assignPlayer = useCallback((id: string) => {
    const base = CRIMES.find(x => x.id === id);
    if (!base || state.lv < base.reqLv) return;
    
    setState(prev => {
      if (prev.playerCrime === id) {
        return { ...prev, playerCrime: null };
      } else {
        // Ensure crime node exists
        let crimes = prev.crimes;
        if (!crimes.find(c => c.id === id)) {
          crimes = [...crimes, { id, base, workers: 0 }];
        }
        return { ...prev, playerCrime: id, crimes };
      }
    });
  }, [state.lv]);

  const addCapangaToCrime = useCallback((id: string, delta: number) => {
    setState(prev => {
      let crimes = prev.crimes;
      let crime = crimes.find(c => c.id === id);
      
      if (!crime) {
        const base = CRIMES.find(x => x.id === id);
        if (!base || prev.lv < base.reqLv) return prev;
        crime = { id, base, workers: 0 };
        crimes = [...crimes, crime];
      } else if (prev.lv < crime.base.reqLv) {
        return prev;
      }

      if (delta > 0) {
        const free = Math.max(0, prev.capangas.length - crimes.reduce((a, c) => a + (c.workers || 0), 0) - (prev.playerCrime ? 1 : 0));
        if (free <= 0) return prev;
        const add = Math.min(delta, free);
        crime = { ...crime, workers: (crime.workers || 0) + add };
      } else if (delta < 0) {
        crime = { ...crime, workers: Math.max(0, (crime.workers || 0) - 1) };
      }

      crimes = crimes.map(c => c.id === id ? crime : c);
      return { ...prev, crimes };
    });
  }, []);

  const hireCapanga = useCallback((kind: typeof CAPANGAS[0]) => {
    setState(prev => {
      const cost = Number(kind.hire) || 0;
      if (prev.dirty < cost || prev.capangas.length >= prev.capMax) return prev;
      
      return {
        ...prev,
        dirty: prev.dirty - cost,
        capangas: [...prev.capangas, { kind }]
      };
    });
  }, []);

  const fireCapanga = useCallback((kind: typeof CAPANGAS[0]) => {
    setState(prev => {
      const idx = prev.capangas.findIndex(h => h.kind.id === kind.id);
      if (idx < 0) return prev;

      const newCapangas = [...prev.capangas];
      newCapangas.splice(idx, 1);

      // Redistribute workers if needed
      let crimes = [...prev.crimes];
      let over = Math.max(0, crimes.reduce((a, c) => a + (c.workers || 0), 0) - (newCapangas.length - (prev.playerCrime ? 1 : 0)));
      
      if (over > 0) {
        crimes.sort((a, b) => (b.workers || 0) - (a.workers || 0));
        crimes.forEach(c => {
          if (over > 0 && c.workers && c.workers > 0) {
            const take = Math.min(c.workers, over);
            c.workers -= take;
            over -= take;
          }
        });
      }

      return { ...prev, capangas: newCapangas, crimes };
    });
  }, []);

  const buyBuilding = useCallback((b: typeof BUILDINGS[0]) => {
    setState(prev => {
      if (prev.builds.length >= prev.bldMax) return prev;
      const cost = Number(b.cost) || 0;
      if (prev.dirty < cost) return prev;
      
      return {
        ...prev,
        dirty: prev.dirty - cost,
        builds: [...prev.builds, { b }]
      };
    });
  }, []);

  const sellBuilding = useCallback((b: typeof BUILDINGS[0]) => {
    setState(prev => {
      const i = prev.builds.findIndex(x => x.b.id === b.id);
      if (i >= 0) {
        const newBuilds = [...prev.builds];
        newBuilds.splice(i, 1);
        return { ...prev, builds: newBuilds };
      }
      return prev;
    });
  }, []);

  const buyBribe = useCallback((s: typeof BRIBES[0]) => {
    setState(prev => {
      if (prev.bribes.length >= prev.subMax) return prev;
      return { ...prev, bribes: [...prev.bribes, { s }] };
    });
  }, []);

  const recalcRates = useCallback(() => {
    setState(prev => {
      // Calculate rates similar to original logic
      const salaryDirty = prev.capangas.reduce((a, h) => a + (Number(h.kind.salary) || 0), 0);

      let mDirty = 1, mHeat = 1;
      if (prev.capangas.length) {
        const sumD = prev.capangas.reduce((a, h) => a + (h.kind.buffs?.dirtyMul || 1), 0);
        const sumH = prev.capangas.reduce((a, h) => a + (h.kind.buffs?.heatMul || 1), 0);
        mDirty = sumD / prev.capangas.length;
        mHeat = sumH / prev.capangas.length;
      }

      let dirtyGain = 0;
      let heatGain = 0;
      let activeCapangas = 0;
      
      prev.crimes.forEach(c => {
        const base = c.base;
        if (!base || prev.lv < base.reqLv) return;

        const workers = c.workers || 0;
        const playerOn = (prev.playerCrime === c.id) ? 1 : 0;

        if (workers > 0) activeCapangas += workers;

        dirtyGain += (Number(base.dirty) || 0) * (workers + playerOn) * mDirty;
        heatGain += (Number(base.heat) || 0) * workers * mHeat;
      });

      let cleanGain = 0, launder = 0;
      prev.builds.forEach(x => {
        const b = x?.b;
        if (!b) return;
        const r = Number(b.rate) || 0;
        if (b.type === 'clean') cleanGain += r;
        else launder += r;
      });

      const heatDown = prev.bribes.reduce((a, x) => a + (Number(x?.s?.reduce) || 0), 0);
      const cleanCost = prev.bribes.reduce((a, x) => a + (Number(x?.s?.costPer) || 0), 0);

      const over = Math.max(0, prev.heat - 50);
      const eff = clamp(1 - (over * 2) / 100, 0, 1);

      let dirtyPer = Math.max(0, dirtyGain - salaryDirty) * eff;
      let cleanPer = Math.max(0, cleanGain - cleanCost) * eff;
      let heatPer = heatGain - heatDown;

      if (activeCapangas === 0) {
        heatPer = Math.min(heatPer, -0.5);
      }

      return {
        ...prev,
        dirtyPer,
        cleanPer,
        heatPer,
        eff,
        cleanCost
      };
    });
  }, [clamp]);

  const tick = useCallback((dt: number) => {
    setState(prev => {
      let newHeat = prev.heat + (Number(prev.heatPer) || 0) * dt;
      if (newHeat < 0) newHeat = 0;

      let newDirty = prev.dirty + (Number(prev.dirtyPer) || 0) * dt;
      
      // Launder dirty money
      const launderRate = prev.builds.filter(b => b.b.type === 'launder').reduce((a, b) => a + b.b.rate, 0) * prev.eff;
      const mv = Math.min(launderRate * dt, newDirty);
      newDirty -= mv;
      
      let newClean = prev.clean + mv + (Number(prev.cleanPer) || 0) * dt;

      // XP gain from player crime
      let newXp = prev.xp;
      let newLv = prev.lv;
      let newXpNeed = prev.xpNeed;
      
      if (prev.playerCrime) {
        const c = CRIMES.find(x => x.id === prev.playerCrime);
        if (c) {
          newXp += Math.max(1, Math.ceil((Number(c.dirty) || 0) * 0.1)) * dt;
          if (newXp >= newXpNeed) {
            newXp -= newXpNeed;
            newLv++;
            newXpNeed = Math.max(100, Math.ceil(newXpNeed * 1.15));
          }
        }
      }

      return {
        ...prev,
        heat: newHeat,
        dirty: newDirty,
        clean: newClean,
        xp: newXp,
        lv: newLv,
        xpNeed: newXpNeed
      };
    });
  }, []);

  const saveGame = useCallback(() => {
    localStorage.setItem('mafia_empire_v4', JSON.stringify(state));
  }, [state]);

  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem('mafia_empire_v4');
      if (!saved) return;
      const obj = JSON.parse(saved) || {};
      setState({
        ...initialState,
        ...obj,
        crimes: Array.isArray(obj.crimes) ? obj.crimes : [],
        capangas: Array.isArray(obj.capangas) ? obj.capangas : [],
        builds: Array.isArray(obj.builds) ? obj.builds : [],
        bribes: Array.isArray(obj.bribes) ? obj.bribes : []
      });
    } catch (e) {
      console.warn('Load failed', e);
    }
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem('mafia_empire_v4');
    setState(initialState);
  }, []);

  // Game loop
  useEffect(() => {
    recalcRates();
  }, [state.crimes, state.capangas, state.builds, state.bribes, state.lv, state.playerCrime, recalcRates]);

  useEffect(() => {
    let lastTime = performance.now();
    let animationId: number;

    const gameLoop = (currentTime: number) => {
      const deltaTime = Math.min(0.2, (currentTime - lastTime) / 1000) * gameSpeed;
      lastTime = currentTime;
      
      if (deltaTime > 0) {
        tick(deltaTime);
      }
      
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameSpeed, tick]);

  return {
    state,
    gameSpeed,
    setGameSpeed,
    onlyPlayerLevel,
    setOnlyPlayerLevel,
    ceilFormat,
    assignPlayer,
    addCapangaToCrime,
    getCrimeWorkers,
    availableCapangas,
    hireCapanga,
    fireCapanga,
    buyBuilding,
    sellBuilding,
    buyBribe,
    saveGame,
    loadGame,
    resetGame,
    recalcRates
  };
};