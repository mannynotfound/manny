import { CLIPS_HOST } from '../constants';

type DefaultAnimations =
  | 'idle'
  | 'acknowledge'
  | 'agony'
  | 'backflip'
  | 'bashful'
  | 'bboy brooklyn step'
  | 'bboy freeze'
  | 'bboy flair'
  | 'bboy hand freeze'
  | 'bboy hand spin'
  | 'blowing kiss'
  | 'boogaloo'
  | 'bored'
  | 'burpee'
  | 'capoeira'
  | 'check phone'
  | 'cheer'
  | 'clap'
  | 'cocky'
  | 'convulse'
  | 'count'
  | 'cry'
  | 'cut throat'
  | 'dance bellydance'
  | 'dance gangam style'
  | 'dance chicken'
  | 'dance cabbage patch'
  | 'dance maraschino'
  | 'dance rumba'
  | 'dance salsa'
  | 'dance twerk'
  | 'dance twist'
  | 'dance ymca'
  | 'die'
  | 'drunk'
  | 'ecstatic'
  | 'electrocuted'
  | 'float'
  | 'fly'
  | 'hurricane kick'
  | 'jump'
  | 'kneel'
  | 'look off'
  | 'loser'
  | 'no'
  | 'pain'
  | 'plank'
  | 'point'
  | 'pray'
  | 'push up'
  | 'raise hand'
  | 'rap'
  | 'run'
  | 'salute'
  | 'seizure'
  | 'shake fist'
  | 'shrug'
  | 'sing'
  | 'sit up'
  | 'sleep'
  | 'smh'
  | 'stretch neck'
  | 't-pose'
  | 'teeter'
  | 'thankful'
  | 'think'
  | 'typing'
  | 'victory'
  | 'waving'
  | 'walk sad'
  | 'walk swag'
  | 'yell';

export interface Animation {
  url: string;
  async?: boolean;
}

export type AnimationLibrary = Record<string, Animation>;
export type DefaultLibrary = Record<DefaultAnimations, Animation>;

const makeAnim = (fileName: string, async: boolean | undefined = true) => ({
  url: `${CLIPS_HOST}/${fileName}.fbx`,
  async,
});

export const DEFAULT_LIBRARY: DefaultLibrary = {
  idle: makeAnim('idle_stand', false),
  waving: makeAnim('waving'),
  thankful: makeAnim('thankful'),
  bashful: makeAnim('bashful'),
  victory: makeAnim('victory'),
  acknowledge: makeAnim('acknowledge'),
  agony: makeAnim('agony'),
  backflip: makeAnim('backflip'),
  'bboy brooklyn step': makeAnim('bboy brooklyn step'),
  'bboy flair': makeAnim('bboy flair'),
  'bboy freeze': makeAnim('bboy finish'),
  'bboy hand freeze': makeAnim('bboy handstand freeze'),
  'bboy hand spin': makeAnim('bboy handstand spin'),
  'blowing kiss': makeAnim('blow a kiss'),
  boogaloo: makeAnim('boogaloo'),
  bored: makeAnim('bored'),
  burpee: makeAnim('burpee'),
  capoeira: makeAnim('capoeira'),
  'check phone': makeAnim('check phone'),
  cheer: makeAnim('cheer'),
  clap: makeAnim('clap'),
  cocky: makeAnim('cocky'),
  convulse: makeAnim('convulse'),
  count: makeAnim('count'),
  cry: makeAnim('cry'),
  'cut throat': makeAnim('cut throat'),
  'dance bellydance': makeAnim('bellydance'),
  'dance gangam style': makeAnim('k-pop dance'),
  'dance chicken': makeAnim('chicken dance'),
  'dance cabbage patch': makeAnim('cabbage patch dance'),
  'dance maraschino': makeAnim('maraschino'),
  'dance rumba': makeAnim('rumba dance'),
  'dance salsa': makeAnim('salsa dance'),
  'dance twerk': makeAnim('twerk'),
  'dance twist': makeAnim('twist dance'),
  'dance ymca': makeAnim('ymca dance'),
  die: makeAnim('die'),
  drunk: makeAnim('drunk'),
  ecstatic: makeAnim('ecstatic'),
  electrocuted: makeAnim('electrocuted'),
  float: makeAnim('float'),
  fly: makeAnim('fly'),
  'hurricane kick': makeAnim('hurricane kick'),
  jump: makeAnim('jump'),
  kneel: makeAnim('kneel'),
  'look off': makeAnim('look off'),
  loser: makeAnim('loser'),
  no: makeAnim('no'),
  pain: makeAnim('pain'),
  plank: makeAnim('plank'),
  point: makeAnim('point'),
  pray: makeAnim('pray'),
  'push up': makeAnim('push up'),
  'raise hand': makeAnim('raise hand'),
  rap: makeAnim('rap'),
  run: makeAnim('run'),
  salute: makeAnim('salute'),
  seizure: makeAnim('seizure'),
  'shake fist': makeAnim('shake fist'),
  shrug: makeAnim('shrug'),
  sing: makeAnim('sing'),
  'sit up': makeAnim('situp'),
  sleep: makeAnim('sleep'),
  smh: makeAnim('smh'),
  'stretch neck': makeAnim('stretch neck'),
  't-pose': makeAnim('t-pose'),
  teeter: makeAnim('teeter'),
  think: makeAnim('think'),
  typing: makeAnim('typing'),
  'walk sad': makeAnim('walk sad'),
  'walk swag': makeAnim('walk swag'),
  yell: makeAnim('yell'),
};
