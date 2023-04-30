import { Object3D } from 'three';

type DefaultAnimations = 'idle' | 'acknowledge' | 'agony' | 'backflip' | 'bashful' | 'bboy brooklyn step' | 'bboy freeze' | 'bboy flair' | 'bboy hand freeze' | 'bboy hand spin' | 'blowing kiss' | 'boogaloo' | 'bored' | 'burpee' | 'capoeira' | 'check phone' | 'cheer' | 'clap' | 'cocky' | 'convulse' | 'count' | 'cry' | 'cut throat' | 'dance bellydance' | 'dance gangam style' | 'dance chicken' | 'dance cabbage patch' | 'dance maraschino' | 'dance rumba' | 'dance salsa' | 'dance twerk' | 'dance twist' | 'dance ymca' | 'die' | 'drunk' | 'ecstatic' | 'electrocuted' | 'float' | 'fly' | 'hurricane kick' | 'jump' | 'kneel' | 'look off' | 'loser' | 'no' | 'pain' | 'plank' | 'point' | 'pray' | 'push up' | 'raise hand' | 'rap' | 'run' | 'salute' | 'seizure' | 'shake fist' | 'shrug' | 'sing' | 'sit up' | 'sleep' | 'smh' | 'stretch neck' | 't-pose' | 'teeter' | 'thankful' | 'think' | 'typing' | 'victory' | 'waving' | 'walk sad' | 'walk swag' | 'yell';
interface Animation {
    url: string;
    async?: boolean;
}
type AnimationLibrary = Record<string, Animation>;
type DefaultLibrary = Record<DefaultAnimations, Animation>;

interface BaseProps {
    modelPath?: string;
    textureUrl?: string;
}
interface AnimationProps extends BaseProps {
    paused?: boolean;
    clamp?: boolean;
}
interface DefaultAnimationProps extends AnimationProps {
    animation: keyof DefaultLibrary;
}
interface Props<T extends AnimationLibrary> extends AnimationProps {
    animation: Extract<keyof T, string>;
    library: T;
}
declare function Manny(): Object3D;
declare function Manny(args: BaseProps): Object3D;
declare function Manny(args: DefaultAnimationProps): Object3D;
declare function Manny<T extends AnimationLibrary>(props: Props<T>): Object3D;

declare const animations: string[];

export { animations, Manny as default };
