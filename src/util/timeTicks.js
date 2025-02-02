import { bisector, tickStep } from 'd3-array';
import {
    timeMillisecond as millisecond,
    timeSecond as second,
    timeMinute as minute,
    timeHour as hour,
    timeDay as day,
    timeMonday as week,
    timeMonth as month,
    timeYear as year,
} from 'd3-time';

// Based on https://github.com/d3/d3-time/blob/main/src/ticks.js
// Week start on Monday, not Sunday as default in d3.js

const durationSecond = 1000;
const durationMinute = durationSecond * 60;
const durationHour = durationMinute * 60;
const durationDay = durationHour * 24;
const durationWeek = durationDay * 7;
const durationMonth = durationDay * 30;
const durationYear = durationDay * 365;

function ticker(year, month, week, day, hour, minute) {
    const tickIntervals = [
        [second, 1, durationSecond],
        [second, 5, 5 * durationSecond],
        [second, 15, 15 * durationSecond],
        [second, 30, 30 * durationSecond],
        [minute, 1, durationMinute],
        [minute, 5, 5 * durationMinute],
        [minute, 15, 15 * durationMinute],
        [minute, 30, 30 * durationMinute],
        [hour, 1, durationHour],
        [hour, 3, 3 * durationHour],
        [hour, 6, 6 * durationHour],
        [hour, 12, 12 * durationHour],
        [day, 1, durationDay],
        [day, 2, 2 * durationDay],
        [week, 1, durationWeek],
        [month, 1, durationMonth],
        [month, 3, 3 * durationMonth],
        [year, 1, durationYear],
    ];

    function ticks(start, stop, count) {
        const reverse = stop < start;
        if (reverse) [start, stop] = [stop, start];
        const interval =
            count && typeof count.range === 'function'
                ? count
                : tickInterval(start, stop, count);
        const ticks = interval ? interval.range(start, +stop + 1) : []; // inclusive stop
        return reverse ? ticks.reverse() : ticks;
    }

    function tickInterval(start, stop, count) {
        const target = Math.abs(stop - start) / count;
        const i = bisector(([, , step]) => step).right(tickIntervals, target);
        if (i === tickIntervals.length)
            return year.every(
                tickStep(start / durationYear, stop / durationYear, count)
            );
        if (i === 0)
            return millisecond.every(Math.max(tickStep(start, stop, count), 1));
        const [t, step] = tickIntervals[
            target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target
                ? i - 1
                : i
        ];
        return t.every(step);
    }

    return ticks;
}

export default ticker(year, month, week, day, hour, minute);
