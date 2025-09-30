import ICard from "./card.model"

export default interface IPrepare{
    cards: ICard[];
    selectedCard1: ICard;
    selectedCard2: ICard;
    selectedIndex1: number;
    selectedIndex2: number;
    progress: number;
    fullTrack: HTMLAudioElement;
    flipAudio: HTMLAudioElement;
    goodAudio: HTMLAudioElement;
    failAudio: HTMLAudioElement;
    gameOverAudio: HTMLAudioElement;
}