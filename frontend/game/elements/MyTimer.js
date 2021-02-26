const TimerState = { "START": 1, "ACTIVE": 2, "STOP": 3, "PAUSE": 4, "INACTIVE": 5, "TIMEUP": 6 }
Object.freeze(TimerState)

/**
 * MyTimer class, representing the countdown timer.
 */
class MyTimer extends MyGameElement {
    constructor(scene, graph, pickId = -1) {
        super(scene, graph, pickId)

        this.spriteLoaded = false;
        this.turnTime = 60; // The time each player has to play

        this.lastTime = 0;
        this.timePassed = 0;

        this.state = TimerState.INACTIVE;
    }

    setGraph(graph) {
        this.graph = graph;
        this.setSprite();
        this.setTime();
    }

    setSprite() {
        this.timeMarker = this.graph.nodes['timeMarker'].sprites[0]
        this.spriteLoaded = true;
    }

    setTime() {
        this.timeMarker.setText(String(this.turnTime - Math.round(this.timePassed)));
    }

    setState(state) {
        this.state = state;
    }


    update(t) {

        if (!this.spriteLoaded) return;

        switch (this.state) {
            case TimerState.START:
                this.start_state(t);
                break;
            case TimerState.ACTIVE:
                this.active_state(t);
                break;
            case TimerState.PAUSE:
                this.pause_state(t);
                break;
            case TimerState.STOP:
                this.stop_state();
                break;
            default:
                break;
        }

    }


    start_state(t) {
        this.lastTime = t;
        this.timePassed = 0;
        this.setState(TimerState.ACTIVE);
    }

    active_state(t) {

        this.timePassed += (t - this.lastTime) / 1000;

        if (this.timePassed > this.turnTime) {
            this.lastTime = 0;
            this.timePassed = 60;

            this.setTime();
            this.setState(TimerState.TIMEUP);
            return;
        }

        this.lastTime = t;
        this.setTime();
    }

    stop_state() {
        this.lastTime = 0;
        this.timePassed = 0;
        this.setTime();
        this.setState(TimerState.INACTIVE);
    }

    pause_state(t) {
        this.lastTime = t;
    }



    isInactive() {
        return this.state == TimerState.INACTIVE;
    }

    isTimeUp() {
        return this.state == TimerState.TIMEUP;
    }

    isPaused() {
        return this.state == TimerState.PAUSE;
    }

    display() {

        if (!this.spriteLoaded)
            this.setSprite();

        this.graph.display();
    }
}