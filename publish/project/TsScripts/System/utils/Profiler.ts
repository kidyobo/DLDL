export class Profiler {
    static isopen = false;
    static push(tag: string) {
        if (Profiler.isopen) {
            Game.Profiler.Ins.Push(tag);
        }
    }
    static pop() {
        if (Profiler.isopen) {
            Game.Profiler.Ins.Pop();
        }
    }
}