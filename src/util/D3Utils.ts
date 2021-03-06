import * as d3 from 'd3';

const enterExitDuration = 400;
const stateChangeDuration = 600;

export const exitTransition = d3
    .transition('exit')
    .ease(d3.easeBackIn)
    .duration(enterExitDuration);

export const enterTransition = d3
    .transition('enter')
    .ease(d3.easeBackOut)
    .duration(enterExitDuration);

export const stateChangeTransition = d3
    .transition('change')
    .ease(d3.easeCircleInOut)
    .duration(stateChangeDuration);
